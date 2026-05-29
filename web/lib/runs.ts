// web/lib/runs.ts — process-wide registry of in-flight runs and their pending approvals.
// SSE and the approve POST endpoint hit this same registry; that's how the unidirectional
// SSE stream becomes a request/response approval channel.
import "server-only";
import { randomUUID } from "node:crypto";

type PendingApproval = {
  resolve: (decision: boolean) => void;
  timeout: NodeJS.Timeout;
};

type Run = {
  id: string;
  pendingApprovals: Map<string, PendingApproval>;
  startedAt: number;
};

// Survive Next.js dev-mode module reloads — without this every hot reload would
// orphan in-flight runs.
declare global {
  // eslint-disable-next-line no-var
  var __agentkitRuns: Map<string, Run> | undefined;
}
const runs: Map<string, Run> = (globalThis.__agentkitRuns ??= new Map());

// Auto-deny if the browser never sends a decision (closed tab, crashed UI, etc.).
const APPROVAL_TIMEOUT_MS = 5 * 60 * 1000;

export function startRun(): Run {
  const id = randomUUID();
  const run: Run = { id, pendingApprovals: new Map(), startedAt: Date.now() };
  runs.set(id, run);
  return run;
}

export function endRun(runId: string): void {
  const run = runs.get(runId);
  if (!run) return;
  // Cancel any approvals still waiting — auto-deny so the agent loop unblocks.
  for (const p of run.pendingApprovals.values()) {
    clearTimeout(p.timeout);
    p.resolve(false);
  }
  runs.delete(runId);
}

// Called by the agent's `approve` callback. Returns a promise that resolves when
// the user clicks Approve/Deny in the UI, or times out, or the run ends.
export function awaitApproval(runId: string): { callId: string; promise: Promise<boolean> } {
  const run = runs.get(runId);
  if (!run) return { callId: "", promise: Promise.resolve(false) };

  const callId = randomUUID();
  const promise = new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => {
      run.pendingApprovals.delete(callId);
      resolve(false);
    }, APPROVAL_TIMEOUT_MS);
    run.pendingApprovals.set(callId, { resolve, timeout });
  });
  return { callId, promise };
}

// Called by the POST /api/approve/:runId endpoint. Returns whether the
// approval was actually pending (false means stale/unknown — UI should ignore).
export function resolveApproval(runId: string, callId: string, decision: boolean): boolean {
  const run = runs.get(runId);
  if (!run) return false;
  const pending = run.pendingApprovals.get(callId);
  if (!pending) return false;
  clearTimeout(pending.timeout);
  run.pendingApprovals.delete(callId);
  pending.resolve(decision);
  return true;
}
