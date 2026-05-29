import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/server";
import EventStream from "@/components/EventStream";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  running: "text-amber-400",
  done: "text-emerald-400",
  error: "text-red-400",
};

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = store().getRun(id);
  if (!run) notFound();

  const events = run.events as ({ type: string } & Record<string, unknown>)[];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-mono ${STATUS_COLOR[run.status] ?? "text-neutral-500"}`}>
            {run.status}
          </span>
          <Link href={`/agents/${run.agentId}`} className="text-sm font-semibold hover:text-neutral-100">
            {run.agentName}
          </Link>
          <span className="text-xs text-neutral-500">
            {new Date(run.startedAt).toLocaleString()}
            {run.endedAt ? ` · ${Math.round((+new Date(run.endedAt) - +new Date(run.startedAt)) / 1000)}s` : ""}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs text-neutral-500 mb-1">prompt</div>
        <div className="text-sm text-neutral-200 whitespace-pre-wrap border border-neutral-800 rounded p-3 bg-neutral-950">
          {run.prompt}
        </div>
      </div>

      <div>
        <div className="text-xs text-neutral-500 mb-1">events</div>
        <EventStream events={events} />
      </div>
    </div>
  );
}
