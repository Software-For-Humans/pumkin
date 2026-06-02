// agent.ts — minimal local agent runtime for Ollama. Zero dependencies (Node 18+).
// The "agent" is a loop: ask the model -> if it wants tools, run them -> feed results back -> repeat.

export type JSONSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
};

export type Tool = {
  name: string;
  description: string;
  parameters: JSONSchema;
  handler: (args: Record<string, any>) => Promise<unknown> | unknown;
  requiresApproval?: boolean;
};

export type AgentEvent =
  | { type: "model_response"; content: string; toolCalls: ToolCall[] }
  | { type: "tool_call"; name: string; args: Record<string, any> }
  | { type: "tool_result"; name: string; result: unknown }
  | { type: "tool_error"; name: string; error: string }
  | { type: "blocked"; name: string; reason: string }
  | { type: "done"; output: string };

export type AgentOptions = {
  model: string;
  systemPrompt: string;
  tools?: Tool[];
  ollamaUrl?: string; // default http://localhost:11434
  maxSteps?: number; // hard stop on the loop, default 10
  toolTimeoutMs?: number; // per-tool timeout, default 30s
  temperature?: number; // default 0.1 — keep tool calls deterministic
  onEvent?: (e: AgentEvent) => void; // observe/log everything
  approve?: (call: { name: string; args: Record<string, any> }) => Promise<boolean> | boolean;
};

type ToolCall = { function: { name: string; arguments: Record<string, any> | string } };
export type Message = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: ToolCall[];
  tool_name?: string;
};
export type { ToolCall };

export class Agent {
  private ollamaUrl: string;
  private maxSteps: number;
  private toolTimeoutMs: number;
  private temperature: number;
  private model: string;
  private systemPrompt: string;
  private onEvent?: AgentOptions["onEvent"];
  private approve?: AgentOptions["approve"];
  private tools: Map<string, Tool>;

  constructor(o: AgentOptions) {
    this.ollamaUrl = o.ollamaUrl ?? "http://localhost:11434";
    this.maxSteps = o.maxSteps ?? 10;
    this.toolTimeoutMs = o.toolTimeoutMs ?? 30_000;
    this.temperature = o.temperature ?? 0.1;
    this.model = o.model;
    this.systemPrompt = o.systemPrompt;
    this.onEvent = o.onEvent;
    this.approve = o.approve;
    this.tools = new Map((o.tools ?? []).map((t) => [t.name, t]));
  }

  async run(userInput: string, history: Message[] = []): Promise<{ output: string; messages: Message[] }> {
    const messages: Message[] = [
      { role: "system", content: this.systemPrompt },
      ...history,
      { role: "user", content: userInput },
    ];

    // Cache of tool calls already executed this run, keyed by name+args. Lets us
    // (a) feed back a cached result instead of re-running a tool the model asks
    // for again, and (b) detect when the model is spinning on calls it already made.
    const executed = new Map<string, string>();

    for (let step = 0; step < this.maxSteps; step++) {
      const msg = await this.chat(messages);
      let content = msg.content ?? "";
      let toolCalls = msg.tool_calls ?? [];

      // Robustness: many local models (and older Ollama builds) fail to emit
      // structured tool_calls and instead write the call as text in `content`
      // — a bare JSON object, a ```json fenced block, or <tool_call> tags.
      // Recover those so the agent works across the messy reality of local
      // models instead of silently treating a tool call as the final answer.
      if (toolCalls.length === 0 && content) {
        const recovered = extractTextToolCalls(content, (n) => this.resolveToolName(n));
        if (recovered.calls.length) {
          toolCalls = recovered.calls;
          content = recovered.cleaned;
        }
      }

      this.emit({ type: "model_response", content, toolCalls });

      // No tool calls => the model intends this as its final answer. If it's
      // empty, force a synthesis pass rather than returning a blank answer.
      if (toolCalls.length === 0) {
        if (content.trim()) {
          messages.push({ role: "assistant", content });
          this.emit({ type: "done", output: content });
          // Drop the system prompt from the returned history — it's owned by the
          // agent config, not the conversation, and may change between turns.
          return { output: content, messages: messages.slice(1) };
        }
        return await this.synthesize(messages);
      }

      // Keep the assistant turn that requested the tools in history.
      messages.push({ role: "assistant", content, tool_calls: toolCalls });

      // Track whether this turn re-requested data the model already has. A
      // well-behaved model never re-asks for an identical call it just received;
      // when a weak local model does, it's spinning — we answer from what we have.
      let sawDuplicate = false;

      for (const call of toolCalls) {
        const name = call.function.name;
        const args = normalizeArgs(call.function.arguments);
        const tool = this.tools.get(name);

        // Allowlist: only registered tools can ever run.
        if (!tool) {
          this.emit({ type: "blocked", name, reason: "unknown tool" });
          messages.push({ role: "tool", tool_name: name, content: `Error: tool "${name}" is not available.` });
          continue;
        }

        // Schema gate: required args must be present.
        const missing = (tool.parameters.required ?? []).filter((k) => !(k in args));
        if (missing.length) {
          this.emit({ type: "blocked", name, reason: `missing args: ${missing.join(", ")}` });
          messages.push({ role: "tool", tool_name: name, content: `Error: missing required args: ${missing.join(", ")}` });
          continue;
        }

        // Already ran this exact call? Re-feed the cached result instead of
        // re-executing (no duplicate side effects, no re-approval), and note
        // that the model is spinning so we can wrap up after this turn.
        const key = `${name}:${stableStringify(args)}`;
        if (executed.has(key)) {
          sawDuplicate = true;
          const cached = executed.get(key)!;
          this.emit({ type: "tool_call", name, args });
          this.emit({ type: "tool_result", name, result: cached });
          messages.push({ role: "tool", tool_name: name, content: cached });
          continue;
        }

        // Approval gate for anything that touches the real world.
        if (tool.requiresApproval && this.approve) {
          const ok = await this.approve({ name, args });
          if (!ok) {
            this.emit({ type: "blocked", name, reason: "denied by approver" });
            messages.push({ role: "tool", tool_name: name, content: `Error: call to "${name}" was denied.` });
            continue;
          }
        }

        this.emit({ type: "tool_call", name, args });
        try {
          const result = await withTimeout(Promise.resolve(tool.handler(args)), this.toolTimeoutMs, name);
          const resultStr = stringify(result);
          executed.set(key, resultStr);
          this.emit({ type: "tool_result", name, result });
          messages.push({ role: "tool", tool_name: name, content: resultStr });
        } catch (err) {
          const error = err instanceof Error ? err.message : String(err);
          this.emit({ type: "tool_error", name, error });
          messages.push({ role: "tool", tool_name: name, content: `Error: ${error}` });
        }
      }

      // The model re-requested something it already had → it's not going to
      // progress on its own. Force a final answer from the context gathered.
      if (sawDuplicate) {
        return await this.synthesize(messages);
      }
    }

    // Hit the step ceiling — force a final answer from everything gathered so
    // far rather than returning a canned "ran out of steps" message.
    return await this.synthesize(messages);
  }

  // Force the model to produce a prose answer from the conversation so far,
  // with tools DISABLED so it can't spin on more calls. Used when the model
  // loops on duplicate calls, hits the step ceiling, or returns empty content.
  // Guarantees a non-empty result.
  private async synthesize(messages: Message[]): Promise<{ output: string; messages: Message[] }> {
    messages.push({
      role: "user",
      content:
        "Using only the tool results above, give your final answer now. Do not request any more tools.",
    });

    let output = "";
    try {
      const msg = await this.chat(messages, { includeTools: false });
      output = (msg.content ?? "").trim();
      // If the model still emitted a tool call as text, strip it to plain prose.
      if (output) {
        const stripped = extractTextToolCalls(output, (n) => this.resolveToolName(n));
        if (stripped.calls.length) output = stripped.cleaned;
      }
    } catch (err) {
      output = `Error producing final answer: ${err instanceof Error ? err.message : String(err)}`;
    }

    if (!output) {
      output =
        "I gathered the requested information using the tools above but couldn't compose a final summary. The tool results are shown in the run.";
    }

    messages.push({ role: "assistant", content: output });
    this.emit({ type: "model_response", content: output, toolCalls: [] });
    this.emit({ type: "done", output });
    return { output, messages: messages.slice(1) };
  }

  private async chat(
    messages: Message[],
    opts: { includeTools?: boolean } = {},
  ): Promise<{ content: string; tool_calls?: ToolCall[] }> {
    const includeTools = opts.includeTools !== false;
    const body: Record<string, unknown> = {
      model: this.model,
      messages,
      stream: false,
      options: { temperature: this.temperature },
    };
    if (includeTools) {
      body.tools = [...this.tools.values()].map((t) => ({
        type: "function",
        function: { name: t.name, description: t.description, parameters: t.parameters },
      }));
    }
    const res = await fetch(`${this.ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { message: { content: string; tool_calls?: ToolCall[] } };
    return data.message;
  }

  // Resolve a model-emitted tool name to a registered tool. Handles models
  // that drop the server namespace (emitting "read_file" for "fs__read_file").
  private resolveToolName(emitted: string): string | null {
    if (this.tools.has(emitted)) return emitted;
    for (const key of this.tools.keys()) {
      if (key.endsWith(`__${emitted}`)) return key;
    }
    return null;
  }

  private emit(e: AgentEvent) {
    this.onEvent?.(e);
  }
}

// Ollama returns tool arguments as a parsed object; some models/proxies return a JSON string. Handle both.
function normalizeArgs(args: Record<string, any> | string): Record<string, any> {
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch {
      return {};
    }
  }
  return args ?? {};
}

function stringify(v: unknown): string {
  return typeof v === "string" ? v : JSON.stringify(v);
}

// Stable stringify for dedup keys: sort object keys so {a,b} and {b,a} hash the
// same. Only needs to handle the shallow arg objects models produce.
function stableStringify(v: unknown): string {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    return "{" + Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`).join(",") + "}";
  }
  return JSON.stringify(v);
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`tool "${label}" timed out after ${ms}ms`)), ms)),
  ]);
}

// ---------------------------------------------------------------------------
// Text tool-call recovery
//
// Not every model+Ollama combo emits structured `tool_calls`. Smaller local
// models and older Ollama builds frequently write the call into the message
// content as text. We support the three shapes seen in the wild:
//   1. <tool_call>{...}</tool_call>     (qwen-family native tags)
//   2. ```json\n{...}\n```              (markdown-fenced)
//   3. {"name":"...","arguments":{...}} (bare JSON object)
// A candidate is only accepted as a tool call if its name resolves to a tool
// the agent actually has — this guards against false positives where a final
// answer legitimately contains JSON.
function extractTextToolCalls(
  content: string,
  resolve: (name: string) => string | null,
): { calls: ToolCall[]; cleaned: string } {
  if (!content) return { calls: [], cleaned: content };

  const candidates: { json: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;

  // 1. <tool_call>...</tool_call>
  const tagRe = /<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/g;
  while ((m = tagRe.exec(content))) {
    candidates.push({ json: m[1], start: m.index, end: m.index + m[0].length });
  }

  // 2. ```json ... ``` (or bare ``` ... ```) fenced blocks
  if (candidates.length === 0) {
    const fenceRe = /```(?:json)?\s*([\s\S]*?)```/g;
    while ((m = fenceRe.exec(content))) {
      candidates.push({ json: m[1], start: m.index, end: m.index + m[0].length });
    }
  }

  // 3. Bare top-level JSON objects (only if nothing fenced/tagged was found).
  if (candidates.length === 0) {
    for (const span of findJsonObjects(content)) {
      candidates.push({ json: span.text, start: span.start, end: span.end });
    }
  }

  const calls: ToolCall[] = [];
  const spans: Array<[number, number]> = [];
  for (const c of candidates) {
    const parsed = tryParseCall(c.json);
    if (!parsed) continue;
    const resolved = resolve(parsed.name);
    if (!resolved) continue;
    calls.push({ function: { name: resolved, arguments: parsed.args } });
    spans.push([c.start, c.end]);
  }

  // Strip the recovered call text from the visible content so the raw JSON
  // doesn't leak into the model_response/done output.
  let cleaned = content;
  spans.sort((a, b) => b[0] - a[0]);
  for (const [s, e] of spans) cleaned = cleaned.slice(0, s) + cleaned.slice(e);
  return { calls, cleaned: cleaned.trim() };
}

// Parse one candidate string into a {name, args}, tolerating the various key
// names models use (arguments/parameters/args, nested under `function`).
function tryParseCall(raw: string): { name: string; args: Record<string, any> } | null {
  let obj: any;
  try {
    obj = JSON.parse(raw.trim());
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object") return null;
  const name = obj.name ?? obj.tool ?? obj.function?.name;
  if (typeof name !== "string" || !name) return null;
  let args = obj.arguments ?? obj.parameters ?? obj.args ?? obj.function?.arguments ?? {};
  if (typeof args === "string") {
    try {
      args = JSON.parse(args);
    } catch {
      args = {};
    }
  }
  if (typeof args !== "object" || args === null) args = {};
  return { name, args };
}

// Find balanced top-level {...} objects in a string, skipping braces inside
// JSON string literals. Used as the last-resort scan for bare tool calls.
function findJsonObjects(s: string): Array<{ text: string; start: number; end: number }> {
  const out: Array<{ text: string; start: number; end: number }> = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      if (depth > 0) {
        depth--;
        if (depth === 0 && start >= 0) {
          out.push({ text: s.slice(start, i + 1), start, end: i + 1 });
          start = -1;
        }
      }
    }
  }
  return out;
}
