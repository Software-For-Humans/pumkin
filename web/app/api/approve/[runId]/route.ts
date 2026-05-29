// web/app/api/approve/[runId]/route.ts — UI POSTs here when the user clicks Approve/Deny.
// Body: { callId, decision }. Resolves the in-flight awaitApproval() promise.
import { NextRequest } from "next/server";
import { resolveApproval } from "@/lib/runs";

export const runtime = "nodejs";

export async function POST(req: NextRequest, ctx: { params: Promise<{ runId: string }> }) {
  const { runId } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { callId?: string; decision?: boolean } | null;
  if (!body?.callId || typeof body.decision !== "boolean") {
    return Response.json({ ok: false, error: "callId and decision required" }, { status: 400 });
  }
  const handled = resolveApproval(runId, body.callId, body.decision);
  return Response.json({ ok: handled });
}
