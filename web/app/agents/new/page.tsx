import { store, tools } from "@/lib/server";
import { createAgentAction } from "@/lib/actions";
import { listOllamaModels, expectsReliableToolCalls } from "@/lib/ollama";

export const dynamic = "force-dynamic";

export default async function NewAgentPage() {
  const mcpServers = store().listMcpServers();
  const builtIns = Object.values(tools());
  const modelsResult = await listOllamaModels();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">New agent</h1>
      <form action={createAgentAction} className="space-y-4 max-w-2xl">
        <Field label="Name">
          <input name="name" required className="input" placeholder="time-bot" />
        </Field>

        <Field
          label="Model"
          hint={
            modelsResult.ok
              ? "Models with a ⚠ may pass unreliable arguments to tool calls. They usually still work — just expect occasional misfires on smaller models."
              : `Could not reach Ollama (${modelsResult.error}). Start Ollama or enter a model name manually.`
          }
        >
          {modelsResult.ok && modelsResult.models.length > 0 ? (
            <select name="model" required className="input" defaultValue="">
              <option value="" disabled>
                Select a model…
              </option>
              {modelsResult.models.map((m) => {
                const ok = expectsReliableToolCalls(m);
                const sizeLabel = m.parameterSize ? ` · ${m.parameterSize}` : "";
                return (
                  <option key={m.name} value={m.name}>
                    {ok ? "" : "⚠ "}
                    {m.name}
                    {sizeLabel}
                  </option>
                );
              })}
            </select>
          ) : (
            <input name="model" required className="input" placeholder="qwen3:8b" />
          )}
        </Field>

        <Field label="System prompt">
          <textarea name="systemPrompt" required rows={4} className="input" placeholder="You are a concise assistant." />
        </Field>

        <Field label="Built-in tools">
          <div className="space-y-1">
            {builtIns.map((t) => (
              <label key={t.name} className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="builtInToolIds" value={t.name} className="mt-1" />
                <span>
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-neutral-500"> — {t.description}</span>
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="MCP servers">
          {mcpServers.length === 0 ? (
            <p className="text-sm text-neutral-500">No MCP servers configured yet.</p>
          ) : (
            <div className="space-y-1">
              {mcpServers.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="mcpServerIds" value={s.id} />
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-neutral-500 text-xs">[{s.transport}]</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Max steps">
            <input name="maxSteps" type="number" defaultValue={10} min={1} max={50} className="input" />
          </Field>
          <Field label="Temperature">
            <input name="temperature" type="number" defaultValue={0.1} step={0.1} min={0} max={2} className="input" />
          </Field>
        </div>

        <button className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded font-semibold hover:bg-white">
          Create agent
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
