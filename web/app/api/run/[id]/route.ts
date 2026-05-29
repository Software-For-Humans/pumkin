// web/app/api/run/[id]/route.ts — SSE endpoint streaming agent events to the client.
// Supports both one-shot runs (no threadId) and continuations of an existing thread.
import { NextRequest } from "next/server";
import { store, tools, loadAgent } from "@/lib/server";
import { startRun as registerRun, endRun, awaitApproval } from "@/lib/runs";
import type { Message } from "@core/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const prompt = url.searchParams.get("prompt") ?? "";
  const threadId = url.searchParams.get("threadId");
  if (!prompt) return new Response("missing prompt", { status: 400 });

  const agent = store().getAgent(id);
  if (!agent) return new Response("agent not found", { status: 404 });

  // If a threadId is provided, load its prior message history.
  let priorMessages: Message[] = [];
  if (threadId) {
    const thread = store().getThread(threadId);
    if (!thread) return new Response("thread not found", { status: 404 });
    if (thread.agentId !== id) return new Response("thread does not belong to this agent", { status: 400 });
    priorMessages = thread.messages as Message[];
  }

  const encoder = new TextEncoder();
  const recorded: unknown[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        recorded.push(data);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const run = registerRun();
      store().startRun({ id: run.id, agentId: agent.id, agentName: agent.name, prompt, threadId });
      send({ type: "run_started", runId: run.id });

      let loaded: Awaited<ReturnType<typeof loadAgent>> | null = null;
      let status: "done" | "error" = "done";
      let finalMessages: Message[] | null = null;
      try {
        loaded = await loadAgent(store(), id, {
          builtInTools: tools(),
          overrides: {
            onEvent: (e) => send(e),
            approve: async ({ name, args }) => {
              const { callId, promise } = awaitApproval(run.id);
              send({ type: "approval_request", callId, name, args });
              const decision = await promise;
              send({ type: "approval_decided", callId, decision });
              return decision;
            },
          },
        });
        const result = await loaded.agent.run(prompt, priorMessages);
        finalMessages = result.messages;
      } catch (err) {
        status = "error";
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        if (loaded) await loaded.close().catch(() => {});
        endRun(run.id);
        store().finishRun(run.id, status, recorded);
        // Persist updated thread history on success.
        if (threadId && status === "done" && finalMessages) {
          store().updateThreadMessages(threadId, finalMessages);
          // Adopt the first user message as the thread title, replacing the
          // "New conversation" default.
          if (priorMessages.length === 0) {
            store().setThreadTitle(threadId, truncateTitle(prompt));
          }
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function truncateTitle(s: string): string {
  const cleaned = s.replace(/\s+/g, " ").trim();
  return cleaned.length > 80 ? cleaned.slice(0, 77) + "…" : cleaned || "Untitled";
}
