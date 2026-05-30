// src/pages/api/download/[token].ts
// Validates a download token against pumkin_orders, increments tracking
// counters, then 302-redirects to a signed Spaces URL with short expiry.
// The .exe never appears at a public URL — only via signed URLs we mint
// per-request.

import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";
import { signedInstallerUrl } from "../../../lib/spaces";

export const prerender = false;

// UUID v4 / v7 / etc. — flexible regex
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: APIRoute = async ({ params }) => {
  const token = params.token;

  if (!token || !UUID_RE.test(token)) {
    return new Response("Invalid download link", { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("pumkin_orders")
    .select("id, status, version, download_count, first_dl_at")
    .eq("download_token", token)
    .maybeSingle();

  if (error) {
    return new Response("Lookup failed — try again or email hi@pumkin.app", { status: 500 });
  }

  if (!order) {
    return new Response(
      "This download link isn't valid. If you've bought Pumkin, " +
      "check your welcome email or contact hi@pumkin.app.",
      { status: 404 }
    );
  }

  if (order.status === "refunded") {
    return new Response(
      "This order was refunded. The download link is no longer active.",
      { status: 403 }
    );
  }

  if (order.status === "disputed") {
    return new Response(
      "This order is under dispute. Contact hi@pumkin.app to resolve.",
      { status: 403 }
    );
  }

  if (order.status !== "paid") {
    return new Response("Order not active.", { status: 403 });
  }

  // Generate the signed installer URL (10-minute expiry)
  let signedUrl: string;
  try {
    signedUrl = await signedInstallerUrl(order.version, 600);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pumkin] Failed to sign installer URL:", msg);
    return new Response(
      "Couldn't generate download right now. Try again in a minute, " +
      "or email hi@pumkin.app.",
      { status: 500 }
    );
  }

  // Update tracking counters (fire and forget — don't block the redirect)
  const now = new Date().toISOString();
  void supabaseAdmin
    .from("pumkin_orders")
    .update({
      download_count: order.download_count + 1,
      first_dl_at: order.first_dl_at ?? now,
      last_dl_at: now,
    })
    .eq("id", order.id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: signedUrl,
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
};
