import Link from "next/link";
import { store } from "@/lib/server";
import { deleteAgentAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default function AgentsListPage() {
  const agents = store().listAgents();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Agents</h1>
        <Link href="/agents/new" className="px-3 py-1.5 bg-neutral-100 text-neutral-900 rounded text-sm hover:bg-white">
          + new agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <p className="text-neutral-500">No agents yet. Create one to get started.</p>
      ) : (
        <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
          {agents.map((a) => (
            <li key={a.id} className="px-4 py-3 flex items-center justify-between">
              <Link href={`/agents/${a.id}`} className="hover:text-neutral-100 text-neutral-300">
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs text-neutral-500">{a.model}</div>
              </Link>
              <form action={deleteAgentAction.bind(null, a.id)}>
                <button className="text-xs text-neutral-500 hover:text-red-400">delete</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
