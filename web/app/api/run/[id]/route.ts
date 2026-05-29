// web/app/api/run/[id]/route.ts — SSE endpoint streaming agent events to the client.
// First event is always { type: "run_started", runId } so the client knows what
// to POST against /api/approve/<runId> for approval decisions.
import { NextRequest } from "next/server";
import { store, tools, loadAgent } from "@/lib/server";
import { startRun, endRun, awaitApproval } from "@/lib/runs";

// Force the Node runtime — the agent loop spawns subprocesses (stdio MCP), which
// the edge runtime can't do.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const prompt = url.searchParams.get("prompt") ?? "";
  if (!prompt) return new Response("missing prompt", { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      const run = startRun();
      send({ type: "run_started", runId: run.id });

      let loaded: Awaited<ReturnType<typeof loadAgent>> | null = null;
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
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        if (loaded) await loaded.close().catch(() => {});
        endRun(run.id);
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
