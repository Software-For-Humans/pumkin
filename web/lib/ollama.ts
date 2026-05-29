// web/lib/ollama.ts — server-side helper to introspect the user's local Ollama.
// Used by the new-agent form to populate a model dropdown from /api/tags.
import "server-only";

export type OllamaModel = {
  name: string;
  parameterSize: string | null; // e.g. "8.0B", "70.6B", "137M"
  parameterBillions: number | null; // parsed numeric version for warnings
  family: string | null;
  sizeBytes: number;
};

export type ListModelsResult =
  | { ok: true; models: OllamaModel[] }
  | { ok: false; error: string };

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";

export async function listOllamaModels(): Promise<ListModelsResult> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      // No cache — installed models change frequently.
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { ok: false, error: `Ollama ${res.status}` };
    const data = (await res.json()) as { models?: Array<{ name: string; size: number; details?: { parameter_size?: string; family?: string } }> };
    const models = (data.models ?? []).map<OllamaModel>((m) => ({
      name: m.name,
      parameterSize: m.details?.parameter_size ?? null,
      parameterBillions: parseBillions(m.details?.parameter_size),
      family: m.details?.family ?? null,
      sizeBytes: m.size,
    }));
    // Sort: tool-calling-friendly sizes (8B+) first, then by name.
    models.sort((a, b) => {
      const aOk = (a.parameterBillions ?? 0) >= 8 ? 0 : 1;
      const bOk = (b.parameterBillions ?? 0) >= 8 ? 0 : 1;
      if (aOk !== bOk) return aOk - bOk;
      return a.name.localeCompare(b.name);
    });
    return { ok: true, models };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Returns true if the model is large enough that we expect reliable tool calling.
// Anything smaller than 8B in our experience emits tool-call JSON as text rather
// than via Ollama's structured tool_calls channel.
export function expectsReliableToolCalls(m: OllamaModel): boolean {
  if (m.parameterBillions === null) return false; // unknown size → warn
  return m.parameterBillions >= 8;
}

function parseBillions(s: string | undefined): number | null {
  if (!s) return null;
  const match = /^([\d.]+)\s*([BM])$/i.exec(s.trim());
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  return match[2].toUpperCase() === "B" ? value : value / 1000;
}
