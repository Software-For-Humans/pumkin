import Link from "next/link";
import { store } from "@/lib/server";
import { deleteRunAction } from "@/lib/actions";
import ConfirmingForm from "@/components/ConfirmingForm";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  running: "text-amber-400",
  done: "text-emerald-400",
  error: "text-red-400",
};

export default function RunsListPage() {
  const runs = store().listRuns(200);
  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Runs</h1>
      {runs.length === 0 ? (
        <p className="text-neutral-500">No runs yet. Run an agent to see history here.</p>
      ) : (
        <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
          {runs.map((r) => {
            const ts = new Date(r.startedAt);
            const duration = r.endedAt ? Math.round((+new Date(r.endedAt) - +ts) / 1000) : null;
            return (
              <li key={r.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <Link href={`/runs/${r.id}`} className="flex-1 min-w-0 hover:text-neutral-100">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-mono ${STATUS_COLOR[r.status] ?? "text-neutral-500"}`}>
                      {r.status}
                    </span>
                    <span className="text-sm text-neutral-300 font-semibold">{r.agentName}</span>
                    <span className="text-xs text-neutral-500">
                      {ts.toLocaleString()} {duration !== null ? `· ${duration}s` : ""}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 truncate">{r.prompt}</div>
                </Link>
                <ConfirmingForm
                  action={deleteRunAction.bind(null, r.id)}
                  message="Delete this run from history?"
                >
                  <button className="text-xs text-neutral-500 hover:text-red-400">delete</button>
                </ConfirmingForm>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
