"use client";
import { useState, useRef, useCallback } from "react";
import EventStream from "./EventStream";

type AnyEvent = Record<string, unknown> & { type: string };
type PendingApproval = { callId: string; name: string; args: Record<string, unknown> };

// Subset of Message we care about for chat rendering.
type StoredMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: unknown[];
  tool_name?: string;
};

export default function ChatConsole({
  agentId,
  threadId,
  initialMessages,
}: {
  agentId: string;
  threadId: string;
  initialMessages: StoredMessage[];
}) {
  const [messages, setMessages] = useState<StoredMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [liveEvents, setLiveEvents] = useState<AnyEvent[]>([]);
  const [liveAssistantText, setLiveAssistantText] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingApproval[]>([]);
  const sourceRef = useRef<EventSource | null>(null);

  const send = useCallback(() => {
    if (running || !input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLiveEvents([]);
    setLiveAssistantText("");
    setRunning(true);
    setRunId(null);
    setPending([]);

    const qs = new URLSearchParams({ prompt: userMsg, threadId });
    const es = new EventSource(`/api/run/${agentId}?${qs}`);
    sourceRef.current = es;

    es.onmessage = (msg) => {
      try {
        const e = JSON.parse(msg.data) as AnyEvent;
        setLiveEvents((prev) => [...prev, e]);

        if (e.type === "run_started") {
          setRunId(String(e.runId));
        } else if (e.type === "model_response" && typeof e.content === "string") {
          // Show progressive model output (final answer arrives in done).
          setLiveAssistantText(e.content as string);
        } else if (e.type === "approval_request") {
          setPending((prev) => [
            ...prev,
            { callId: String(e.callId), name: String(e.name), args: e.args as Record<string, unknown> },
          ]);
        } else if (e.type === "approval_decided") {
          setPending((prev) => prev.filter((p) => p.callId !== String(e.callId)));
        } else if (e.type === "done") {
          const output = String(e.output ?? "");
          setMessages((prev) => [...prev, { role: "assistant", content: output }]);
          setLiveEvents([]);
          setLiveAssistantText("");
          es.close();
          setRunning(false);
        } else if (e.type === "error") {
          setMessages((prev) => [...prev, { role: "assistant", content: `[error] ${String(e.message ?? "")}` }]);
          setLiveEvents([]);
          setLiveAssistantText("");
          es.close();
          setRunning(false);
        }
      } catch {
        // ignore malformed lines
      }
    };
    es.onerror = () => {
      es.close();
      setRunning(false);
    };
  }, [running, input, agentId, threadId]);

  const stop = useCallback(() => {
    sourceRef.current?.close();
    setRunning(false);
  }, []);

  const decide = useCallback(
    async (callId: string, decision: boolean) => {
      if (!runId) return;
      setPending((prev) => prev.filter((p) => p.callId !== callId));
      await fetch(`/api/approve/${runId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, decision }),
      }).catch(() => {});
    },
    [runId],
  );

  // Render only user + assistant messages in the chat view; tool calls/results
  // are visible during the live run via the event stream, and in /runs history.
  const visibleMessages = messages.filter(
    (m): m is StoredMessage & { role: "user" | "assistant" } => m.role === "user" || m.role === "assistant",
  );

  return (
    <div>
      <div className="space-y-3 mb-6">
        {visibleMessages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {running && liveAssistantText && <ChatBubble role="assistant" content={liveAssistantText} live />}
      </div>

      {pending.length > 0 && (
        <div className="mb-4 space-y-2">
          {pending.map((p) => (
            <div key={p.callId} className="border border-blue-700 bg-blue-950/40 rounded p-3 text-sm">
              <div className="font-semibold text-blue-300 mb-1">Tool call awaiting approval</div>
              <div className="font-mono text-xs mb-3 text-neutral-300">
                <div><span className="text-neutral-500">tool</span> {p.name}</div>
                <div><span className="text-neutral-500">args</span> <span className="whitespace-pre-wrap">{JSON.stringify(p.args)}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => decide(p.callId, true)} className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold">approve</button>
                <button onClick={() => decide(p.callId, false)} className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 rounded text-xs font-semibold">deny</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {running && liveEvents.length > 0 && (
        <details className="mb-4">
          <summary className="text-xs text-neutral-500 cursor-pointer">tool activity ({liveEvents.length})</summary>
          <div className="mt-2"><EventStream events={liveEvents} /></div>
        </details>
      )}

      <div className="border-t border-neutral-800 pt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
          rows={3}
          placeholder="Ask the agent something (Cmd/Ctrl+Enter to send)…"
          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-neutral-100 font-mono text-sm mb-2"
          disabled={running}
        />
        <button
          onClick={running ? stop : send}
          className={`px-4 py-1.5 rounded font-semibold text-sm ${running ? "bg-red-700 hover:bg-red-600 text-white" : "bg-neutral-100 hover:bg-white text-neutral-900"}`}
        >
          {running ? "stop" : "send"}
        </button>
      </div>
    </div>
  );
}

function ChatBubble({ role, content, live }: { role: "user" | "assistant"; content: string; live?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`rounded-lg p-3 text-sm whitespace-pre-wrap ${isUser ? "bg-neutral-800 text-neutral-100" : "bg-neutral-900 border border-neutral-800 text-neutral-300"} ${live ? "opacity-70" : ""}`}>
      <div className="text-xs text-neutral-500 mb-1 font-semibold">{isUser ? "you" : "assistant"}{live ? " · streaming…" : ""}</div>
      {content || <span className="text-neutral-600 italic">(empty)</span>}
    </div>
  );
}
