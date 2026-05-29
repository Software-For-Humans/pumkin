// store-test.ts — exercise store CRUD + the loader against a live MCP server.
// Skips the actual Ollama call (which would need a model pulled); proves wiring instead.
import { unlinkSync, existsSync } from "node:fs";
import { openStore } from "./store";
import { loadAgent } from "./loader";
import { builtInTools } from "./builtins";

const DB = "test.db";
if (existsSync(DB)) unlinkSync(DB);

const store = openStore(DB);

// 1. Create an MCP server config
const mcp = store.createMcpServer({
  name: "everything",
  transport: "stdio",
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-everything"],
  requiresApproval: false,
});
console.log("created mcp:", mcp.id, mcp.name);

// 2. Create an agent that uses one built-in + that MCP server
const agent = store.createAgent({
  name: "test-agent",
  model: "llama3.1:8b",
  systemPrompt: "test",
  builtInToolIds: ["get_time"],
  mcpServerIds: [mcp.id],
  maxSteps: 5,
  temperature: 0.1,
});
console.log("created agent:", agent.id);

// 3. List everything back
console.log("\nlistAgents:", store.listAgents().map((a) => `${a.name}(${a.builtInToolIds.join(",")})`));
console.log("listMcpServers:", store.listMcpServers().map((m) => `${m.name}[${m.transport}]`));

// 4. Round-trip: get the agent, get the mcp server, convert to runtime config
const got = store.getAgent(agent.id)!;
const gotMcp = store.getMcpServer(got.mcpServerIds[0])!;
console.log("\nroundtrip mcp config:", store.toMcpConfig(gotMcp));

// 5. Load it for real: should connect MCP, register tools, return a live Agent
console.log("\nloading agent (this connects to MCP)...");
const loaded = await loadAgent(store, agent.id, {
  builtInTools,
  overrides: { onEvent: () => {} },
});

// Reach into the agent to confirm tools wired up correctly
const tools = (loaded.agent as any).tools as Map<string, unknown>;
const toolNames = [...tools.keys()].sort();
console.log(`agent has ${toolNames.length} tools wired:`);
for (const n of toolNames.slice(0, 5)) console.log(`  ${n}`);
console.log(`  ... and ${Math.max(0, toolNames.length - 5)} more`);

const hasBuiltin = toolNames.includes("get_time");
const hasMcp = toolNames.some((n) => n.startsWith("everything__"));
console.log(`\nbuilt-in present: ${hasBuiltin}, mcp tools present: ${hasMcp}`);

// 6. Update + delete
store.updateAgent(agent.id, { name: "renamed" });
console.log("\nafter rename:", store.getAgent(agent.id)?.name);
store.deleteAgent(agent.id);
console.log("after delete:", store.getAgent(agent.id) ?? "(gone)");

await loaded.close();
store.close();
unlinkSync(DB);
console.log("\nOK");
