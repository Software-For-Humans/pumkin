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
type Message = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: ToolCall[];
  tool_name?: string;
};

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

  async run(userInput: string): Promise<string> {
    const messages: Message[] = [
      { role: "system", content: this.systemPrompt },
      { role: "user", content: userInput },
    ];

    for (let step = 0; step < this.maxSteps; step++) {
      const msg = await this.chat(messages);
      const toolCalls = msg.tool_calls ?? [];
      this.emit({ type: "model_response", content: msg.content ?? "", toolCalls });

      // No tool calls => the model has produced its final answer.
      if (toolCalls.length === 0) {
        this.emit({ type: "done", output: msg.content ?? "" });
        return msg.content ?? "";
      }

      // Keep the assistant turn that requested the tools in history.
      messages.push({ role: "assistant", content: msg.content ?? "", tool_calls: toolCalls });

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
          this.emit({ type: "tool_result", name, result });
          messages.push({ role: "tool", tool_name: name, content: stringify(result) });
        } catch (err) {
          const error = err instanceof Error ? err.message : String(err);
          this.emit({ type: "tool_error", name, error });
          messages.push({ role: "tool", tool_name: name, content: `Error: ${error}` });
        }
      }
    }

    const out = "Reached max steps without a final answer.";
    this.emit({ type: "done", output: out });
    return out;
  }

  private async chat(messages: Message[]): Promise<{ content: string; tool_calls?: ToolCall[] }> {
    const res = await fetch(`${this.ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages,
        tools: [...this.tools.values()].map((t) => ({
          type: "function",
          function: { name: t.name, description: t.description, parameters: t.parameters },
        })),
        stream: false,
        options: { temperature: this.temperature },
      }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { message: { content: string; tool_calls?: ToolCall[] } };
    return data.message;
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

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`tool "${label}" timed out after ${ms}ms`)), ms)),
  ]);
}
