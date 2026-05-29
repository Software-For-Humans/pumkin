// store.ts — SQLite persistence for agents and MCP server configs. Uses node:sqlite (Node 22.5+).
// No new external deps. All ops synchronous; opening the DB applies the schema idempotently.
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import type { McpServerConfig } from "./mcp";

export type AgentRow = {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
  builtInToolIds: string[]; // tool IDs the caller will resolve from its built-in registry
  mcpServerIds: string[];   // FK into mcp_servers.id
  maxSteps: number;
  temperature: number;
  createdAt: string;
};

export type AgentInput = Omit<AgentRow, "id" | "createdAt">;

// What's stored in the DB. The runtime config (McpServerConfig) is derived from this.
export type McpServerRow = {
  id: string;
  name: string;
  transport: "stdio" | "http";
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  requiresApproval: boolean;
  createdAt: string;
};

export type McpServerInput = Omit<McpServerRow, "id" | "createdAt">;

export type Store = ReturnType<typeof openStore>;

export function openStore(path: string) {
  const db = new DatabaseSync(path);
  // WAL gives durable, concurrent-reader behavior; fine for a local app.
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  applySchema(db);

  return {
    db,
    close: () => db.close(),

    // ---- agents ----
    createAgent(input: AgentInput): AgentRow {
      const id = randomUUID();
      const createdAt = new Date().toISOString();
      db.prepare(
        `INSERT INTO agents (id, name, model, system_prompt, built_in_tool_ids, mcp_server_ids, max_steps, temperature, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        input.name,
        input.model,
        input.systemPrompt,
        JSON.stringify(input.builtInToolIds),
        JSON.stringify(input.mcpServerIds),
        input.maxSteps,
        input.temperature,
        createdAt,
      );
      return { id, createdAt, ...input };
    },

    getAgent(id: string): AgentRow | null {
      const row = db.prepare(`SELECT * FROM agents WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
      return row ? rowToAgent(row) : null;
    },

    listAgents(): AgentRow[] {
      const rows = db.prepare(`SELECT * FROM agents ORDER BY created_at DESC`).all() as Record<string, unknown>[];
      return rows.map(rowToAgent);
    },

    updateAgent(id: string, patch: Partial<AgentInput>): AgentRow | null {
      const existing = this.getAgent(id);
      if (!existing) return null;
      const merged: AgentRow = { ...existing, ...patch };
      db.prepare(
        `UPDATE agents SET name=?, model=?, system_prompt=?, built_in_tool_ids=?, mcp_server_ids=?, max_steps=?, temperature=?
         WHERE id=?`,
      ).run(
        merged.name,
        merged.model,
        merged.systemPrompt,
        JSON.stringify(merged.builtInToolIds),
        JSON.stringify(merged.mcpServerIds),
        merged.maxSteps,
        merged.temperature,
        id,
      );
      return merged;
    },

    deleteAgent(id: string): boolean {
      const res = db.prepare(`DELETE FROM agents WHERE id = ?`).run(id);
      return res.changes > 0;
    },

    // ---- mcp servers ----
    createMcpServer(input: McpServerInput): McpServerRow {
      const id = randomUUID();
      const createdAt = new Date().toISOString();
      db.prepare(
        `INSERT INTO mcp_servers (id, name, transport, command, args, env, url, requires_approval, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        input.name,
        input.transport,
        input.command ?? null,
        input.args ? JSON.stringify(input.args) : null,
        input.env ? JSON.stringify(input.env) : null,
        input.url ?? null,
        input.requiresApproval ? 1 : 0,
        createdAt,
      );
      return { id, createdAt, ...input };
    },

    getMcpServer(id: string): McpServerRow | null {
      const row = db.prepare(`SELECT * FROM mcp_servers WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
      return row ? rowToMcpServer(row) : null;
    },

    listMcpServers(): McpServerRow[] {
      const rows = db.prepare(`SELECT * FROM mcp_servers ORDER BY created_at DESC`).all() as Record<string, unknown>[];
      return rows.map(rowToMcpServer);
    },

    deleteMcpServer(id: string): boolean {
      const res = db.prepare(`DELETE FROM mcp_servers WHERE id = ?`).run(id);
      return res.changes > 0;
    },

    // ---- helper: turn stored row into the runtime config mcp.ts expects ----
    toMcpConfig(row: McpServerRow): McpServerConfig {
      if (row.transport === "stdio") {
        return {
          name: row.name,
          transport: "stdio",
          command: row.command!,
          args: row.args,
          env: row.env,
          requiresApproval: row.requiresApproval,
        };
      }
      return {
        name: row.name,
        transport: "http",
        url: row.url!,
        requiresApproval: row.requiresApproval,
      };
    },
  };
}

function applySchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      model TEXT NOT NULL,
      system_prompt TEXT NOT NULL,
      built_in_tool_ids TEXT NOT NULL DEFAULT '[]',
      mcp_server_ids TEXT NOT NULL DEFAULT '[]',
      max_steps INTEGER NOT NULL DEFAULT 10,
      temperature REAL NOT NULL DEFAULT 0.1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mcp_servers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      transport TEXT NOT NULL CHECK (transport IN ('stdio','http')),
      command TEXT,
      args TEXT,
      env TEXT,
      url TEXT,
      requires_approval INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      CHECK (
        (transport = 'stdio' AND command IS NOT NULL) OR
        (transport = 'http'  AND url IS NOT NULL)
      )
    );
  `);
}

function rowToAgent(r: Record<string, unknown>): AgentRow {
  return {
    id: r.id as string,
    name: r.name as string,
    model: r.model as string,
    systemPrompt: r.system_prompt as string,
    builtInToolIds: JSON.parse((r.built_in_tool_ids as string) || "[]"),
    mcpServerIds: JSON.parse((r.mcp_server_ids as string) || "[]"),
    maxSteps: Number(r.max_steps),
    temperature: Number(r.temperature),
    createdAt: r.created_at as string,
  };
}

function rowToMcpServer(r: Record<string, unknown>): McpServerRow {
  return {
    id: r.id as string,
    name: r.name as string,
    transport: r.transport as "stdio" | "http",
    command: (r.command as string | null) ?? undefined,
    args: r.args ? (JSON.parse(r.args as string) as string[]) : undefined,
    env: r.env ? (JSON.parse(r.env as string) as Record<string, string>) : undefined,
    url: (r.url as string | null) ?? undefined,
    requiresApproval: Boolean(Number(r.requires_approval)),
    createdAt: r.created_at as string,
  };
}
