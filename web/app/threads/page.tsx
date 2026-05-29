import Link from "next/link";
import { store } from "@/lib/server";

export const dynamic = "force-dynamic";

export default function ThreadsListPage() {
  const threads = store().listThreads(200);
  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Threads</h1>
      {threads.length === 0 ? (
        <p className="text-neutral-500">No conversations yet. Open an agent and click &ldquo;new conversation&rdquo; to start one.</p>
      ) : (
        <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
          {threads.map((t) => {
            const turns = countTurns(t.messages);
            return (
              <li key={t.id} className="px-4 py-3">
                <Link href={`/threads/${t.id}`} className="block hover:text-neutral-100">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-neutral-300">{t.title}</span>
                    <span className="text-xs text-neutral-500">{t.agentName} · {turns} turn{turns === 1 ? "" : "s"}</span>
                  </div>
                  <div className="text-xs text-neutral-500">{new Date(t.updatedAt).toLocaleString()}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function countTurns(messages: unknown[]): number {
  return messages.filter((m): m is { role: string } => typeof m === "object" && m !== null && "role" in m && (m as { role: unknown }).role === "user").length;
}
