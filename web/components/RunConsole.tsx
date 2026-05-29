"use client";
import { useState, useRef } from "react";

type Event = { type: string; [k: string]: unknown };

export default function RunConsole({ agentId }: { agentId: string }) {
  const [prompt, setPrompt] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [running, setRunning] = useState(false);
  const [autoApprove, setAutoApprove] = useState(true);
  const sourceRef = useRef<EventSource | null>(null);

  function start() {
    if (running || !prompt.trim()) return;
    setEvents([]);
    setRunning(true);

    const qs = new URLSearchParams({ prompt, yes: autoApprove ? "1" : "0" });
    const es = new EventSource(`/api/run/${agentId}?${qs}`);
    sourceRef.current = es;

    es.onmessage = (msg) => {
      try {
        const e = JSON.parse(msg.data);
        setEvents((prev) => [...prev, e]);
        if (e.type === "done" || e.type === "error") {
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
  }

  function stop() {
    sourceRef.current?.close();
    setRunning(false);
  }

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
        <div className="flex items-center gap-3">
          <button
            onClick={running ? stop : start}
            className={`px-4 py-1.5 rounded font-semibold text-sm ${running ? "bg-red-700 hover:bg-red-600 text-white" : "bg-neutral-100 hover:bg-white text-neutral-900"}`}
          >
            {running ? "stop" : "run"}
          </button>
          <label className="text-xs text-neutral-400 flex items-center gap-1.5">
            <input type="checkbox" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} disabled={running} />
            auto-approve tool calls
          </label>
        </div>
      </div>

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

function EventLine({ event }: { event: Event }) {
  const color =
    event.type === "tool_call" ? "text-amber-400" :
    event.type === "tool_result" ? "text-emerald-400" :
    event.type === "tool_error" || event.type === "error" ? "text-red-400" :
    event.type === "blocked" ? "text-red-400" :
    event.type === "approval_request" ? "text-blue-400" :
    event.type === "done" ? "text-neutral-100" :
    "text-neutral-400";
  return (
    <div className={color}>
      <span className="text-neutral-500">[{event.type}]</span> <pre className="inline whitespace-pre-wrap">{stringifyExceptType(event)}</pre>
    </div>
  );
}

function stringifyExceptType(e: Event) {
  const { type, ...rest } = e;
  return Object.keys(rest).length ? JSON.stringify(rest) : "";
}
