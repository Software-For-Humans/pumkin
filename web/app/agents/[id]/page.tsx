import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/server";
import { createThreadAction } from "@/lib/actions";
import RunConsole from "@/components/RunConsole";

export const dynamic = "force-dynamic";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = store().getAgent(id);
  if (!agent) notFound();

  const mcpNames = agent.mcpServerIds
    .map((mid) => store().getMcpServer(mid)?.name)
    .filter((n): n is string => Boolean(n));

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{agent.name}</h1>
          <div className="text-sm text-neutral-500 mt-1">{agent.model}</div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/agents/${agent.id}/edit`}
            className="px-3 py-1.5 border border-neutral-700 text-neutral-200 rounded text-sm font-semibold hover:bg-neutral-800"
          >
            edit
          </Link>
          <form action={createThreadAction.bind(null, agent.id)}>
            <button className="px-3 py-1.5 bg-neutral-100 text-neutral-900 rounded text-sm font-semibold hover:bg-white">
              + new conversation
            </button>
          </form>
        </div>
      </div>

      <details className="mb-6 text-sm">
        <summary className="cursor-pointer text-neutral-400">configuration</summary>
        <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-neutral-300">
          <dt className="text-neutral-500">system prompt</dt><dd className="whitespace-pre-wrap">{agent.systemPrompt}</dd>
          <dt className="text-neutral-500">built-in tools</dt><dd>{agent.builtInToolIds.join(", ") || "(none)"}</dd>
          <dt className="text-neutral-500">mcp servers</dt><dd>{mcpNames.join(", ") || "(none)"}</dd>
          <dt className="text-neutral-500">max steps</dt><dd>{agent.maxSteps}</dd>
          <dt className="text-neutral-500">temperature</dt><dd>{agent.temperature}</dd>
        </dl>
      </details>

      <div className="mb-3">
        <h2 className="text-sm font-semibold text-neutral-300">one-shot run</h2>
        <p className="text-xs text-neutral-500">No conversation history. Use &ldquo;new conversation&rdquo; above for multi-turn chat.</p>
      </div>
      <RunConsole agentId={agent.id} />
    </div>
  );
}
