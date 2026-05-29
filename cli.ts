// cli.ts — terminal-driven CRUD + run, so you can use agentkit before the UI exists.
// Usage: npx tsx cli.ts <command> [args...]
import { openStore } from "./store";
import { loadAgent } from "./loader";
import { builtInTools } from "./builtins";

const DB_PATH = process.env.AGENTKIT_DB ?? "agentkit.db";

const [, , cmd, ...args] = process.argv;

async function main() {
  switch (cmd) {
    case undefined:
    case "help":
      return printHelp();

    case "agents:list":
      return cmdListAgents();
    case "agents:create":
      return cmdCreateAgent();
    case "agents:show":
      return cmdShowAgent(requireArg(args[0], "agent id"));
    case "agents:delete":
      return cmdDeleteAgent(requireArg(args[0], "agent id"));

    case "mcp:list":
      return cmdListMcp();
    case "mcp:add":
      return cmdAddMcp();
    case "mcp:show":
      return cmdShowMcp(requireArg(args[0], "mcp id"));
    case "mcp:delete":
      return cmdDeleteMcp(requireArg(args[0], "mcp id"));

    case "tools":
      return cmdListTools();

    case "run":
      return cmdRun(requireArg(args[0], "agent id"), args.slice(1).join(" "));

    default:
      console.error(`unknown command: ${cmd}\n`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`agentkit cli

  agents:list                          list all agents
  agents:create                        create an agent (env-driven, see below)
  agents:show    <id>                  show one agent
  agents:delete  <id>                  delete an agent

  mcp:list                             list MCP server configs
  mcp:add                              add an MCP server (env-driven, see below)
  mcp:show       <id>                  show one MCP server
  mcp:delete     <id>                  delete an MCP server

  tools                                list available built-in tools
  run            <agentId> <prompt>    run an agent

env vars for create/add:
  AGENTKIT_DB                          database path (default: agentkit.db)
  for agents:create:
    NAME, MODEL, SYSTEM_PROMPT, BUILTIN_TOOLS (comma-separated ids),
    MCP_SERVERS (comma-separated ids), MAX_STEPS (default 10), TEMPERATURE (default 0.1)
  for mcp:add (stdio):
    NAME, TRANSPORT=stdio, COMMAND, ARGS (json array), ENV (json object), REQUIRES_APPROVAL=1|0
  for mcp:add (http):
    NAME, TRANSPORT=http, URL, REQUIRES_APPROVAL=1|0
`);
}

function cmdListAgents() {
  const store = openStore(DB_PATH);
  const rows = store.listAgents();
  if (rows.length === 0) {
    console.log("(no agents)");
  } else {
    for (const r of rows) console.log(`${r.id}  ${r.name}  [${r.model}]`);
  }
  store.close();
}

function cmdCreateAgent() {
  const store = openStore(DB_PATH);
  const row = store.createAgent({
    name: requireEnv("NAME"),
    model: requireEnv("MODEL"),
    systemPrompt: requireEnv("SYSTEM_PROMPT"),
    builtInToolIds: csv(process.env.BUILTIN_TOOLS),
    mcpServerIds: csv(process.env.MCP_SERVERS),
    maxSteps: Number(process.env.MAX_STEPS ?? "10"),
    temperature: Number(process.env.TEMPERATURE ?? "0.1"),
  });
  console.log(`created agent ${row.id}`);
  store.close();
}

function cmdShowAgent(id: string) {
  const store = openStore(DB_PATH);
  const row = store.getAgent(id);
  if (!row) {
    console.error("not found");
    process.exit(1);
  }
  console.log(JSON.stringify(row, null, 2));
  store.close();
}

function cmdDeleteAgent(id: string) {
  const store = openStore(DB_PATH);
  console.log(store.deleteAgent(id) ? "deleted" : "not found");
  store.close();
}

function cmdListMcp() {
  const store = openStore(DB_PATH);
  const rows = store.listMcpServers();
  if (rows.length === 0) {
    console.log("(no mcp servers)");
  } else {
    for (const r of rows) console.log(`${r.id}  ${r.name}  [${r.transport}]`);
  }
  store.close();
}

function cmdAddMcp() {
  const store = openStore(DB_PATH);
  const transport = requireEnv("TRANSPORT") as "stdio" | "http";
  if (transport !== "stdio" && transport !== "http") throw new Error("TRANSPORT must be 'stdio' or 'http'");

  const requiresApproval = process.env.REQUIRES_APPROVAL !== "0";

  const row = store.createMcpServer(
    transport === "stdio"
      ? {
          name: requireEnv("NAME"),
          transport: "stdio",
          command: requireEnv("COMMAND"),
          args: process.env.ARGS ? (JSON.parse(process.env.ARGS) as string[]) : undefined,
          env: process.env.ENV ? (JSON.parse(process.env.ENV) as Record<string, string>) : undefined,
          requiresApproval,
        }
      : {
          name: requireEnv("NAME"),
          transport: "http",
          url: requireEnv("URL"),
          requiresApproval,
        },
  );
  console.log(`created mcp server ${row.id}`);
  store.close();
}

function cmdShowMcp(id: string) {
  const store = openStore(DB_PATH);
  const row = store.getMcpServer(id);
  if (!row) {
    console.error("not found");
    process.exit(1);
  }
  console.log(JSON.stringify(row, null, 2));
  store.close();
}

function cmdDeleteMcp(id: string) {
  const store = openStore(DB_PATH);
  console.log(store.deleteMcpServer(id) ? "deleted" : "not found");
  store.close();
}

function cmdListTools() {
  for (const [id, t] of Object.entries(builtInTools)) {
    console.log(`${id}  -  ${t.description}`);
  }
}

async function cmdRun(agentId: string, prompt: string) {
  if (!prompt) throw new Error("missing prompt");
  const store = openStore(DB_PATH);
  const { agent, close } = await loadAgent(store, agentId, {
    builtInTools,
    overrides: {
      onEvent: (e) => console.log(JSON.stringify(e)),
      approve: async ({ name, args }) => {
        // Stdin prompt for any tool flagged requiresApproval.
        process.stdout.write(`approve "${name}" ${JSON.stringify(args)} [y/N]? `);
        const ans = await readLine();
        return ans.trim().toLowerCase() === "y";
      },
    },
  });
  try {
    const { output } = await agent.run(prompt);
    console.log("\nFINAL:\n" + output);
  } finally {
    await close();
    store.close();
  }
}

// ---- helpers ----
function requireArg(v: string | undefined, label: string): string {
  if (!v) {
    console.error(`missing arg: ${label}`);
    process.exit(1);
  }
  return v;
}
function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`missing env var: ${name}`);
  return v;
}
function csv(s: string | undefined): string[] {
  if (!s) return [];
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}
function readLine(): Promise<string> {
  return new Promise((resolve) => {
    process.stdin.once("data", (d) => resolve(d.toString()));
  });
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
