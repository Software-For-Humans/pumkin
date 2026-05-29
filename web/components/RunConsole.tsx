"use client";
import { useState, useRef, useCallback } from "react";

type AnyEvent = Record<string, unknown> & { type: string };
type PendingApproval = { callId: string; name: string; args: Record<string, unknown> };

export default function RunConsole({ agentId }: { agentId: string }) {
  const [prompt, setPrompt] = useState("");
  const [events, setEvents] = useState<AnyEvent[]>([]);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingApproval[]>([]);
  const sourceRef = useRef<EventSource | null>(null);

  const start = useCallback(() => {
    if (running || !prompt.trim()) return;
    setEvents([]);
    setPending([]);
    setRunning(true);
    setRunId(null);

    const qs = new URLSearchParams({ prompt });
    const es = new EventSource(`/api/run/${agentId}?${qs}`);
    sourceRef.current = es;

    es.onmessage = (msg) => {
      try {
        const e = JSON.parse(msg.data) as AnyEvent;
        setEvents((prev) => [...prev, e]);

        if (e.type === "run_started") {
          setRunId(String(e.runId));
        } else if (e.type === "approval_request") {
          setPending((prev) => [
            ...prev,
            { callId: String(e.callId), name: String(e.name), args: e.args as Record<string, unknown> },
          ]);
        } else if (e.type === "approval_decided") {
          // Server has confirmed our decision was applied — drop it from pending.
          setPending((prev) => prev.filter((p) => p.callId !== String(e.callId)));
        } else if (e.type === "done" || e.type === "error") {
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
  }, [running, prompt, agentId]);

  const stop = useCallback(() => {
    sourceRef.current?.close();
    setRunning(false);
  }, []);

  const decide = useCallback(
    async (callId: string, decision: boolean) => {
      if (!runId) return;
      // Optimistic: remove from pending immediately so the user sees feedback.
      setPending((prev) => prev.filter((p) => p.callId !== callId));
      await fetch(`/api/approve/${runId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, decision }),
      }).catch(() => {});
    },
    [runId],
  );

  return (
    <div>
      <div className="space-y-2 mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="What is the current time?"
          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-neutral-100 font-mono text-sm"
          disabled={running}
        />
        <button
          onClick={running ? stop : start}
          className={`px-4 py-1.5 rounded font-semibold text-sm ${
            running ? "bg-red-700 hover:bg-red-600 text-white" : "bg-neutral-100 hover:bg-white text-neutral-900"
          }`}
        >
          {running ? "stop" : "run"}
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mb-4 space-y-2">
          {pending.map((p) => (
            <div key={p.callId} className="border border-blue-700 bg-blue-950/40 rounded p-3 text-sm">
              <div className="font-semibold text-blue-300 mb-1">Tool call awaiting approval</div>
              <div className="font-mono text-xs mb-3 text-neutral-300">
                <div>
                  <span className="text-neutral-500">tool</span> {p.name}
                </div>
                <div>
                  <span className="text-neutral-500">args</span>{" "}
                  <span className="whitespace-pre-wrap">{JSON.stringify(p.args)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => decide(p.callId, true)}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold"
                >
                  approve
                </button>
                <button
                  onClick={() => decide(p.callId, false)}
                  className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 rounded text-xs font-semibold"
                >
                  deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div className="border border-neutral-800 rounded bg-neutral-950 p-3 text-xs space-y-2 font-mono">
          {events.map((e, i) => (
            <EventLine key={i} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventLine({ event }: { event: AnyEvent }) {
  const color =
    event.type === "tool_call"
      ? "text-amber-400"
      : event.type === "tool_result"
        ? "text-emerald-400"
        : event.type === "tool_error" || event.type === "error" || event.type === "blocked"
          ? "text-red-400"
          : event.type === "approval_request" || event.type === "approval_decided"
            ? "text-blue-400"
            : event.type === "done"
              ? "text-neutral-100"
              : event.type === "run_started"
                ? "text-neutral-500"
                : "text-neutral-400";
  return (
    <div className={color}>
      <span className="text-neutral-500">[{event.type}]</span>{" "}
      <pre className="inline whitespace-pre-wrap">{stringifyExceptType(event)}</pre>
    </div>
  );
}

function stringifyExceptType(e: AnyEvent) {
  const { type: _t, ...rest } = e;
  return Object.keys(rest).length ? JSON.stringify(rest) : "";
}
