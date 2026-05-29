// web/app/api/run/[id]/route.ts — SSE endpoint streaming agent events to the client.
// For v1, every requiresApproval tool is auto-approved if ?yes=1 is set; otherwise auto-denied.
// Real interactive approval flows can land in a later iteration.
import { NextRequest } from "next/server";
import { store, tools, loadAgent } from "@/lib/server";

// Force this route to run on the Node runtime — the runtime spawns subprocesses (stdio MCP),
// which the edge runtime cannot do.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const prompt = url.searchParams.get("prompt") ?? "";
  const autoApprove = url.searchParams.get("yes") === "1";

  if (!prompt) return new Response("missing prompt", { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      let loaded: Awaited<ReturnType<typeof loadAgent>> | null = null;
      try {
        loaded = await loadAgent(store(), id, {
          builtInTools: tools(),
          overrides: {
            onEvent: (e) => send(e),
            approve: async ({ name, args }) => {
              send({ type: "approval_request", name, args, decision: autoApprove });
              return autoApprove;
            },
          },
        });
        await loaded.agent.run(prompt);
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        if (loaded) await loaded.close().catch(() => {});
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
