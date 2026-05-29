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

export type RunStatus = "running" | "done" | "error";

export type RunRow = {
  id: string;
  agentId: string;
  agentName: string;
  threadId: string | null;
  prompt: string;
  events: unknown[];
  status: RunStatus;
  startedAt: string;
  endedAt: string | null;
};

export type ThreadRow = {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  messages: unknown[]; // Message[] from agent.ts; kept as unknown[] here to avoid coupling
  createdAt: string;
  updatedAt: string;
};

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

    // ---- runs ----
    startRun(input: { id: string; agentId: string; agentName: string; prompt: string; threadId?: string | null }): RunRow {
      const startedAt = new Date().toISOString();
      db.prepare(
        `INSERT INTO runs (id, agent_id, agent_name, thread_id, prompt, events, status, started_at)
         VALUES (?, ?, ?, ?, ?, '[]', 'running', ?)`,
      ).run(input.id, input.agentId, input.agentName, input.threadId ?? null, input.prompt, startedAt);
      return {
        id: input.id,
        agentId: input.agentId,
        agentName: input.agentName,
        threadId: input.threadId ?? null,
        prompt: input.prompt,
        events: [],
        status: "running",
        startedAt,
        endedAt: null,
      };
    },

    finishRun(id: string, status: RunStatus, events: unknown[]): void {
      const endedAt = new Date().toISOString();
      const safe = events.map(truncateLargeFields);
      db.prepare(
        `UPDATE runs SET status = ?, ended_at = ?, events = ? WHERE id = ?`,
      ).run(status, endedAt, JSON.stringify(safe), id);
    },

    getRun(id: string): RunRow | null {
      const row = db.prepare(`SELECT * FROM runs WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
      return row ? rowToRun(row) : null;
    },

    listRuns(limit = 100): RunRow[] {
      const rows = db
        .prepare(`SELECT * FROM runs ORDER BY started_at DESC LIMIT ?`)
        .all(limit) as Record<string, unknown>[];
      return rows.map(rowToRun);
    },

    listRunsForThread(threadId: string): RunRow[] {
      const rows = db
        .prepare(`SELECT * FROM runs WHERE thread_id = ? ORDER BY started_at ASC`)
        .all(threadId) as Record<string, unknown>[];
      return rows.map(rowToRun);
    },

    deleteRun(id: string): boolean {
      const res = db.prepare(`DELETE FROM runs WHERE id = ?`).run(id);
      return res.changes > 0;
    },

    // ---- threads ----
    createThread(input: { agentId: string; agentName: string; title: string }): ThreadRow {
      const id = randomUUID();
      const now = new Date().toISOString();
      db.prepare(
        `INSERT INTO threads (id, agent_id, agent_name, title, messages, created_at, updated_at)
         VALUES (?, ?, ?, ?, '[]', ?, ?)`,
      ).run(id, input.agentId, input.agentName, input.title, now, now);
      return {
        id,
        agentId: input.agentId,
        agentName: input.agentName,
        title: input.title,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
    },

    getThread(id: string): ThreadRow | null {
      const row = db.prepare(`SELECT * FROM threads WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
      return row ? rowToThread(row) : null;
    },

    listThreads(limit = 100): ThreadRow[] {
      const rows = db
        .prepare(`SELECT * FROM threads ORDER BY updated_at DESC LIMIT ?`)
        .all(limit) as Record<string, unknown>[];
      return rows.map(rowToThread);
    },

    updateThreadMessages(id: string, messages: unknown[]): void {
      db.prepare(`UPDATE threads SET messages = ?, updated_at = ? WHERE id = ?`).run(
        JSON.stringify(messages),
        new Date().toISOString(),
        id,
      );
    },

    setThreadTitle(id: string, title: string): void {
      db.prepare(`UPDATE threads SET title = ? WHERE id = ?`).run(title, id);
    },

    deleteThread(id: string): boolean {
      // Cascade: detach all runs from this thread first (don't delete the runs;
      // they're still useful as audit history).
      db.prepare(`UPDATE runs SET thread_id = NULL WHERE thread_id = ?`).run(id);
      const res = db.prepare(`DELETE FROM threads WHERE id = ?`).run(id);
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

    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      thread_id TEXT,
      prompt TEXT NOT NULL,
      events TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL CHECK (status IN ('running','done','error')),
      started_at TEXT NOT NULL,
      ended_at TEXT
    );

    CREATE INDEX IF NOT EXISTS runs_started_at_idx ON runs (started_at DESC);
    CREATE INDEX IF NOT EXISTS runs_agent_id_idx ON runs (agent_id);
    CREATE INDEX IF NOT EXISTS runs_thread_id_idx ON runs (thread_id);

    CREATE TABLE IF NOT EXISTS threads (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      title TEXT NOT NULL,
      messages TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS threads_updated_at_idx ON threads (updated_at DESC);
  `);

  // Idempotent migrations for older DBs created before threads existed.
  const runsCols = db.prepare("PRAGMA table_info(runs)").all() as Array<{ name: string }>;
  if (!runsCols.some((c) => c.name === "thread_id")) {
    db.exec("ALTER TABLE runs ADD COLUMN thread_id TEXT");
    db.exec("CREATE INDEX IF NOT EXISTS runs_thread_id_idx ON runs (thread_id)");
  }
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

function rowToRun(r: Record<string, unknown>): RunRow {
  return {
    id: r.id as string,
    agentId: r.agent_id as string,
    agentName: r.agent_name as string,
    threadId: (r.thread_id as string | null) ?? null,
    prompt: r.prompt as string,
    events: JSON.parse((r.events as string) || "[]"),
    status: r.status as RunStatus,
    startedAt: r.started_at as string,
    endedAt: (r.ended_at as string | null) ?? null,
  };
}

function rowToThread(r: Record<string, unknown>): ThreadRow {
  return {
    id: r.id as string,
    agentId: r.agent_id as string,
    agentName: r.agent_name as string,
    title: r.title as string,
    messages: JSON.parse((r.messages as string) || "[]"),
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

// Cap any string field within an event at 32KB to keep stored runs bounded.
const MAX_FIELD = 32 * 1024;
function truncateLargeFields(ev: unknown): unknown {
  if (ev === null || typeof ev !== "object") return ev;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(ev as Record<string, unknown>)) {
    if (typeof v === "string" && v.length > MAX_FIELD) {
      out[k] = v.slice(0, MAX_FIELD) + `…[truncated ${v.length - MAX_FIELD} chars]`;
    } else if (v && typeof v === "object") {
      const s = JSON.stringify(v);
      if (s.length > MAX_FIELD) {
        out[k] = s.slice(0, MAX_FIELD) + `…[truncated ${s.length - MAX_FIELD} chars]`;
      } else {
        out[k] = v;
      }
    } else {
      out[k] = v;
    }
  }
  return out;
}
