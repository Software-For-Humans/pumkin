// src/pages/api/order/[session_id].ts
// Returns the order info needed to render /thank-you. Only returns the
// minimum needed (download token, founding number, first name) — no PII
// leakage. If someone guesses a session_id they shouldn't get useful info.

import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const sessionId = params.session_id;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return new Response(JSON.stringify({ error: "Invalid session id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabaseAdmin
    .from("pumkin_orders")
    .select("download_token, founding_no, version, status, email_sent_at, created_at")
    .eq("stripe_session", sessionId)
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ error: "Lookup failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!data) {
    // Order not found — could be webhook hasn't fired yet, or invalid session
    return new Response(JSON.stringify({ status: "pending" }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Don't expose anything beyond what the page needs to render
  return new Response(
    JSON.stringify({
      status: data.status,
      version: data.version,
      founding_no: data.founding_no,
      download_url: `/api/download/${data.download_token}`,
      email_sent: !!data.email_sent_at,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
