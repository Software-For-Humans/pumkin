import Link from "next/link";
import { store } from "@/lib/server";
import { deleteMcpServerAction } from "@/lib/actions";
import ConfirmingForm from "@/components/ConfirmingForm";

export const dynamic = "force-dynamic";

export default function McpListPage() {
  const servers = store().listMcpServers();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">MCP servers</h1>
        <Link href="/mcp/new" className="px-3 py-1.5 bg-neutral-100 text-neutral-900 rounded text-sm hover:bg-white">
          + new server
        </Link>
      </div>
      {servers.length === 0 ? (
        <p className="text-neutral-500">No MCP servers configured.</p>
      ) : (
        <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
          {servers.map((s) => (
            <li key={s.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-neutral-500">
                  {s.transport === "stdio" ? `${s.command} ${(s.args ?? []).join(" ")}` : s.url}
                </div>
              </div>
              <ConfirmingForm
                action={deleteMcpServerAction.bind(null, s.id)}
                message={`Delete MCP server "${s.name}"? Any agents using it will lose access to its tools.`}
              >
                <button className="text-xs text-neutral-500 hover:text-red-400">delete</button>
              </ConfirmingForm>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
