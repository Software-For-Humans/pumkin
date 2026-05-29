// loader.ts — turn a stored agent row into a live Agent with all its tools wired up.
import { Agent, type AgentOptions, type Tool } from "./agent";
import { connectMcpServers, type McpConnection } from "./mcp";
import type { Store } from "./store";

export type LoadOptions = {
  // Caller passes the registry of built-in tools they're shipping with the app.
  // The agent row references these by ID; this is where the IDs become real handlers.
  builtInTools: Record<string, Tool>;
  // Anything you want layered on top of what's in the row (event logging, approval gate, etc.).
  overrides?: Partial<Pick<AgentOptions, "onEvent" | "approve" | "ollamaUrl" | "toolTimeoutMs">>;
};

export type LoadedAgent = {
  agent: Agent;
  close: () => Promise<void>;
};

export async function loadAgent(store: Store, agentId: string, opts: LoadOptions): Promise<LoadedAgent> {
  const row = store.getAgent(agentId);
  if (!row) throw new Error(`agent ${agentId} not found`);

  // Resolve built-in tool IDs against the caller's registry. Unknown IDs are a config error.
  const builtIn: Tool[] = [];
  for (const id of row.builtInToolIds) {
    const t = opts.builtInTools[id];
    if (!t) throw new Error(`agent "${row.name}" references unknown built-in tool "${id}"`);
    builtIn.push(t);
  }

  // Resolve MCP server IDs into runtime configs and connect.
  const mcpConfigs = row.mcpServerIds.map((id) => {
    const s = store.getMcpServer(id);
    if (!s) throw new Error(`agent "${row.name}" references unknown MCP server "${id}"`);
    return store.toMcpConfig(s);
  });

  let mcp: McpConnection | null = null;
  if (mcpConfigs.length > 0) mcp = await connectMcpServers(mcpConfigs);

  const tools = [...builtIn, ...(mcp?.tools ?? [])];

  const agent = new Agent({
    model: row.model,
    systemPrompt: row.systemPrompt,
    tools,
    maxSteps: row.maxSteps,
    temperature: row.temperature,
    ...(opts.overrides ?? {}),
  });

  return {
    agent,
    close: async () => {
      if (mcp) await mcp.close();
    },
  };
}
