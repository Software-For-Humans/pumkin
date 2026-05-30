// web/lib/server.ts — server-only helpers. Owns the SQLite handle and all runtime imports.
// "server-only" guards against this ever being bundled to the client by mistake.
import "server-only";
import { openStore } from "@core/store";
import { loadAgent } from "@core/loader";
import { builtInTools } from "@core/builtins";
import type { Tool } from "@core/agent";
import { resolve } from "node:path";

// One process-wide DB handle. Next.js dev hot-reloads modules; keep the store on globalThis
// so we don't leak SQLite connections across reloads.
declare global {
  // eslint-disable-next-line no-var
  var __agentkitStore: ReturnType<typeof openStore> | undefined;
}

const DB_PATH = process.env.AGENTKIT_DB ?? resolve(process.cwd(), "..", "pumkin.db");

export function store() {
  if (!globalThis.__agentkitStore) globalThis.__agentkitStore = openStore(DB_PATH);
  return globalThis.__agentkitStore;
}

export function tools(): Record<string, Tool> {
  return builtInTools;
}

export { loadAgent };
