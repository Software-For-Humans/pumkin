// web/lib/actions.ts — server actions called from forms in client/server components.
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { store } from "./server";

export async function createAgentAction(formData: FormData) {
  const builtInToolIds = formData.getAll("builtInToolIds").map(String).filter(Boolean);
  const mcpServerIds = formData.getAll("mcpServerIds").map(String).filter(Boolean);
  store().createAgent({
    name: String(formData.get("name") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    systemPrompt: String(formData.get("systemPrompt") ?? "").trim(),
    builtInToolIds,
    mcpServerIds,
    maxSteps: Number(formData.get("maxSteps") ?? 10),
    temperature: Number(formData.get("temperature") ?? 0.1),
  });
  revalidatePath("/");
  redirect("/");
}

export async function deleteAgentAction(id: string) {
  store().deleteAgent(id);
  revalidatePath("/");
}

export async function createMcpServerAction(formData: FormData) {
  const transport = String(formData.get("transport") ?? "stdio") as "stdio" | "http";
  const requiresApproval = formData.get("requiresApproval") === "on";
  const argsRaw = String(formData.get("args") ?? "").trim();
  const envRaw = String(formData.get("env") ?? "").trim();

  if (transport === "stdio") {
    store().createMcpServer({
      name: String(formData.get("name") ?? "").trim(),
      transport: "stdio",
      command: String(formData.get("command") ?? "").trim(),
      args: argsRaw ? (JSON.parse(argsRaw) as string[]) : undefined,
      env: envRaw ? (JSON.parse(envRaw) as Record<string, string>) : undefined,
      requiresApproval,
    });
  } else {
    store().createMcpServer({
      name: String(formData.get("name") ?? "").trim(),
      transport: "http",
      url: String(formData.get("url") ?? "").trim(),
      requiresApproval,
    });
  }
  revalidatePath("/mcp");
  redirect("/mcp");
}

export async function deleteMcpServerAction(id: string) {
  store().deleteMcpServer(id);
  revalidatePath("/mcp");
}
