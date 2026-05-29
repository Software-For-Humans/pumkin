import { notFound } from "next/navigation";
import { store } from "@/lib/server";
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
      <div className="mb-6">
        <h1 className="text-xl font-bold">{agent.name}</h1>
        <div className="text-sm text-neutral-500 mt-1">{agent.model}</div>
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

      <RunConsole agentId={agent.id} />
    </div>
  );
}
