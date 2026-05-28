// mcp.ts — adapt MCP servers into agent.ts Tools. Depends on @modelcontextprotocol/sdk.
// agent.ts stays zero-dependency; this is the optional layer that brings the MCP ecosystem in.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Tool, JSONSchema } from "./agent.ts";

export type McpServerConfig =
  | { name: string; transport: "stdio"; command: string; args?: string[]; env?: Record<string, string>; requiresApproval?: boolean }
  | { name: string; transport: "http"; url: string; requiresApproval?: boolean };

export type McpConnection = { tools: Tool[]; close: () => Promise<void> };

// Connect one MCP server, discover its tools, and wrap each as an agent Tool.
export async function connectMcp(cfg: McpServerConfig): Promise<McpConnection> {
  const client = new Client({ name: "agentkit", version: "0.0.1" });

  const transport =
    cfg.transport === "stdio"
      ? new StdioClientTransport({ command: cfg.command, args: cfg.args ?? [], env: mergeEnv(cfg.env) })
      : new StreamableHTTPClientTransport(new URL(cfg.url));

  await client.connect(transport);

  const { tools: mcpTools } = await client.listTools();
  const requiresApproval = cfg.requiresApproval ?? true; // MCP tools touch the world: gate by default

  const tools: Tool[] = mcpTools.map((t) => ({
    // Namespace to avoid collisions across servers; the handler calls the original name.
    name: `${cfg.name}__${t.name}`,
    description: t.description ?? "",
    parameters: (t.inputSchema as JSONSchema) ?? { type: "object", properties: {} },
    requiresApproval,
    handler: async (args) => {
      const res = await client.callTool({ name: t.name, arguments: args });
      const blocks = (res.content ?? []) as Array<{ type: string; text?: string }>;
      const text = blocks.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n");
      if (res.isError) throw new Error(text || "MCP tool returned an error");
      return text || JSON.stringify(res.content);
    },
  }));

  return { tools, close: () => client.close() };
}

// Connect several servers and flatten their tools behind one combined close().
export async function connectMcpServers(cfgs: McpServerConfig[]): Promise<McpConnection> {
  const conns = await Promise.all(cfgs.map(connectMcp));
  return {
    tools: conns.flatMap((c) => c.tools),
    close: async () => {
      await Promise.all(conns.map((c) => c.close()));
    },
  };
}

// stdio servers inherit a clean copy of the parent env plus any per-server overrides.
function mergeEnv(extra?: Record<string, string>): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) if (v !== undefined) env[k] = v;
  return { ...env, ...(extra ?? {}) };
}
