// web/app/api/run/[id]/route.ts — SSE endpoint streaming agent events to the client.
// Also persists every run + its event stream into the runs table.
// First event is always { type: "run_started", runId } so the client knows what
// to POST against /api/approve/<runId> for approval decisions.
import { NextRequest } from "next/server";
import { store, tools, loadAgent } from "@/lib/server";
import { startRun as registerRun, endRun, awaitApproval } from "@/lib/runs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const prompt = url.searchParams.get("prompt") ?? "";
  if (!prompt) return new Response("missing prompt", { status: 400 });

  const agent = store().getAgent(id);
  if (!agent) return new Response("agent not found", { status: 404 });

  const encoder = new TextEncoder();
  const recorded: unknown[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        recorded.push(data);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const run = registerRun();
      // Persist a "running" row immediately so it shows up in /runs even if the
      // process crashes mid-flight (will be left dangling as 'running' — surface
      // that visually in the list view).
      store().startRun({ id: run.id, agentId: agent.id, agentName: agent.name, prompt });
      send({ type: "run_started", runId: run.id });

      let loaded: Awaited<ReturnType<typeof loadAgent>> | null = null;
      let status: "done" | "error" = "done";
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
        await loaded.agent.run(prompt);
      } catch (err) {
        status = "error";
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        if (loaded) await loaded.close().catch(() => {});
        endRun(run.id);
        store().finishRun(run.id, status, recorded);
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
