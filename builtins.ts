// builtins.ts — the platform's stock tools. Agents reference these by key.
// Add new tools here; the agent row's builtInToolIds is what enables them per-agent.
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Tool } from "./agent";

const ROOT = process.cwd(); // file ops are confined to cwd by default; change here if you want a different root

export const builtInTools: Record<string, Tool> = {
  get_time: {
    name: "get_time",
    description: "Get the current date and time in ISO 8601 format.",
    parameters: { type: "object", properties: {} },
    handler: () => new Date().toISOString(),
  },

  read_text_file: {
    name: "read_text_file",
    description: "Read a UTF-8 text file by path relative to the working directory.",
    parameters: {
      type: "object",
      properties: { path: { type: "string", description: "relative path to the file" } },
      required: ["path"],
    },
    requiresApproval: true,
    handler: async (args) => {
      const path = String(args.path);
      const full = resolve(ROOT, path);
      if (!full.startsWith(ROOT)) throw new Error("path escapes working directory");
      return await readFile(full, "utf8");
    },
  },
};
