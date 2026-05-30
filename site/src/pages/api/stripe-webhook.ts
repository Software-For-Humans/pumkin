// src/pages/api/stripe-webhook.ts
// Stripe webhook receiver. Configure the endpoint in Stripe Dashboard:
//   URL:     https://pumkin.app/api/stripe-webhook
//   Events:  checkout.session.completed
//            charge.refunded
//            charge.dispute.created  (optional, for visibility)
//
// The signing secret goes in STRIPE_WEBHOOK_SECRET. Webhook idempotency is
// handled by the UNIQUE constraint on pumkin_orders.stripe_session.

import type { APIRoute } from "astro";
import Stripe from "stripe";
import { supabaseAdmin, type PumkinOrder } from "../../lib/supabase";
import { sendWelcomeEmail } from "../../lib/email";

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-12-18.acacia",
});

const WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET ?? "";

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }
  if (!WEBHOOK_SECRET) {
    console.error("[pumkin] STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook not configured", { status: 500 });
  }

  // Raw body is required for signature verification — do not parse as JSON first
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pumkin] Stripe signature verification failed:", msg);
    return new Response(`Webhook signature failed: ${msg}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, event.livemode);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      case "charge.dispute.created":
        await handleDispute(event.data.object as Stripe.Dispute);
        break;

      default:
        // Silently accept other events so Stripe doesn't keep retrying.
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[pumkin] Webhook handler error for ${event.type}:`, msg);
    // Return 500 so Stripe retries with exponential backoff (up to ~3 days)
    return new Response(`Handler error: ${msg}`, { status: 500 });
  }

  return new Response("ok", { status: 200 });
};

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  isLive: boolean
): Promise<void> {
  // 1. Idempotency check — has this session already been recorded?
  const { data: existing } = await supabaseAdmin
    .from("pumkin_orders")
    .select("*")
    .eq("stripe_session", session.id)
    .maybeSingle<PumkinOrder>();

  if (existing) {
    // Already recorded. If welcome email failed previously and email_sent_at
    // is still null, retry the send. Otherwise this is just a Stripe retry —
    // ack and move on.
    if (!existing.email_sent_at && existing.status === "paid") {
      await sendWelcomeEmail(existing);
      await supabaseAdmin
        .from("pumkin_orders")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("id", existing.id);
    }
    return;
  }

  // 2. Assign founding number for live, paid orders only.
  // Test-mode events get status='test' and no founding slot consumed.
  const status: PumkinOrder["status"] = isLive ? "paid" : "test";

  let foundingNo: number | null = null;
  if (status === "paid") {
    const { data: seqRow, error: seqErr } = await supabaseAdmin
      .rpc("nextval_pumkin_founding", {});
    if (!seqErr && seqRow) {
      foundingNo = Number(seqRow);
    } else {
      // Fallback: read sequence directly via SQL
      const { data } = await supabaseAdmin
        .from("pumkin_orders")
        .select("founding_no", { count: "exact" })
        .eq("status", "paid")
        .not("founding_no", "is", null);
      foundingNo = (data?.length ?? 0) + 1;
    }
  }

  // 3. Insert the order. UNIQUE on stripe_session protects against
  //    concurrent webhook deliveries.
  const insertPayload: Partial<PumkinOrder> = {
    stripe_session: session.id,
    stripe_customer: (session.customer as string | null) ?? null,
    stripe_payment: (session.payment_intent as string | null) ?? null,
    email: session.customer_details?.email ?? session.customer_email ?? "",
    name: session.customer_details?.name ?? null,
    amount_cents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    version: "0.0.1",
    status,
    founding_no: foundingNo,
    metadata: {
      mode: session.mode,
      payment_status: session.payment_status,
      created_unix: session.created,
    },
  };

  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from("pumkin_orders")
    .insert(insertPayload)
    .select("*")
    .single<PumkinOrder>();

  if (insertErr || !inserted) {
    // Could be a race with another webhook delivery — fetch and continue
    const { data: retry } = await supabaseAdmin
      .from("pumkin_orders")
      .select("*")
      .eq("stripe_session", session.id)
      .single<PumkinOrder>();
    if (!retry) {
      throw new Error(`Insert failed: ${insertErr?.message ?? "unknown"}`);
    }
    return;
  }

  // 4. Send welcome email (only for live, paid orders — skip test mode).
  if (status === "paid" && inserted.email) {
    try {
      await sendWelcomeEmail(inserted);
      await supabaseAdmin
        .from("pumkin_orders")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("id", inserted.id);
    } catch (err) {
      // Don't fail the webhook for email errors — Stripe would retry the
      // whole thing including the insert. Log and let manual recovery
      // re-send via /api/order/[session_id] or a cron.
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[pumkin] sendWelcomeEmail failed:", msg);
    }
  }
}

async function handleRefund(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId = typeof charge.payment_intent === "string"
    ? charge.payment_intent
    : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  await supabaseAdmin
    .from("pumkin_orders")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
    })
    .eq("stripe_payment", paymentIntentId);
}

async function handleDispute(dispute: Stripe.Dispute): Promise<void> {
  const paymentIntentId = typeof dispute.payment_intent === "string"
    ? dispute.payment_intent
    : dispute.payment_intent?.id;

  if (!paymentIntentId) return;

  await supabaseAdmin
    .from("pumkin_orders")
    .update({
      status: "disputed",
      notes: `Dispute opened: ${dispute.reason} (${dispute.id})`,
    })
    .eq("stripe_payment", paymentIntentId);
}
