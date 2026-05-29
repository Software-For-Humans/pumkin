// example.ts — run with: npx tsx example.ts "your prompt here"
// Requires Ollama running locally with a tool-capable model pulled.
import { Agent, type Tool } from "./agent";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = process.cwd(); // confine all file reads to the project directory

const tools: Tool[] = [
  {
    name: "get_time",
    description: "Get the current date and time in ISO 8601 format.",
    parameters: { type: "object", properties: {} },
    handler: () => new Date().toISOString(),
  },
  {
    name: "read_text_file",
    description: "Read a UTF-8 text file by path relative to the project root.",
    parameters: {
      type: "object",
      properties: { path: { type: "string", description: "relative path to the file" } },
      required: ["path"],
    },
    requiresApproval: true, // touches the filesystem -> gate it
    handler: async ({ path }) => {
      const full = resolve(ROOT, path);
      if (!full.startsWith(ROOT)) throw new Error("path escapes project root");
      return await readFile(full, "utf8");
    },
  },
];

const agent = new Agent({
  model: "qwen3-coder:32b", // pick what fits your VRAM; llama3.1:8b for quick tests
  systemPrompt: "You are a local assistant. Use the available tools when they help. Be concise.",
  tools,
  onEvent: (e) => console.log(JSON.stringify(e)),
  approve: async ({ name, args }) => {
    console.log(`[approve] ${name} ${JSON.stringify(args)} -> auto-yes (demo)`);
    return true; // wire this to a real prompt / UI confirmation
  },
});

const prompt = process.argv[2] ?? "What time is it? Then read package.json and summarize it in one line.";
const { output } = await agent.run(prompt);
console.log("\nFINAL:\n" + output);
