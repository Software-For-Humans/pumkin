// web/components/EventStream.tsx — renders a list of agent events in the same
// color-coded format as the live run console. Used by both the live RunConsole
// and the /runs/[id] history detail page.
type AnyEvent = Record<string, unknown> & { type: string };

export default function EventStream({ events }: { events: AnyEvent[] }) {
  if (events.length === 0) return null;
  return (
    <div className="border border-neutral-800 rounded bg-neutral-950 p-3 text-xs space-y-2 font-mono">
      {events.map((e, i) => (
        <EventLine key={i} event={e} />
      ))}
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
  const { type: _t, ...rest } = event;
  const body = Object.keys(rest).length ? JSON.stringify(rest) : "";
  return (
    <div className={color}>
      <span className="text-neutral-500">[{event.type}]</span>{" "}
      <pre className="inline whitespace-pre-wrap">{body}</pre>
    </div>
  );
}
