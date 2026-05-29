"use client";
import { useState } from "react";
import { createMcpServerAction } from "@/lib/actions";

export default function NewMcpPage() {
  const [transport, setTransport] = useState<"stdio" | "http">("stdio");

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">New MCP server</h1>
      <form action={createMcpServerAction} className="space-y-4 max-w-2xl">
        <Field label="Name" hint="Tools will be namespaced as `<name>__<tool>`.">
          <input name="name" required className="input" placeholder="everything" />
        </Field>

        <Field label="Transport">
          <select name="transport" value={transport} onChange={(e) => setTransport(e.target.value as "stdio" | "http")} className="input">
            <option value="stdio">stdio (local subprocess)</option>
            <option value="http">http (streamable)</option>
          </select>
        </Field>

        {transport === "stdio" ? (
          <>
            <Field label="Command" hint="e.g. `npx`, `node`, or an absolute path to a binary.">
              <input name="command" required className="input" placeholder="npx" />
            </Field>
            <Field label="Args (JSON array)">
              <input name="args" className="input" placeholder='["-y","@modelcontextprotocol/server-everything"]' />
            </Field>
            <Field label="Env (JSON object)">
              <input name="env" className="input" placeholder='{"API_KEY":"..."}' />
            </Field>
          </>
        ) : (
          <Field label="URL">
            <input name="url" required type="url" className="input" placeholder="https://example.com/mcp" />
          </Field>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="requiresApproval" defaultChecked />
          Require approval for every tool call from this server
        </label>

        <button className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded font-semibold hover:bg-white">
          Create server
        </button>
      </form>

      <style>{`.input { width: 100%; padding: 0.5rem 0.75rem; background: #171717; border: 1px solid #404040; border-radius: 0.25rem; color: #e5e5e5; font-family: inherit; }`}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-300 mb-1">{label}</label>
      {hint && <p className="text-xs text-neutral-500 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}
