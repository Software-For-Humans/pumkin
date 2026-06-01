// src/pages/api/slots.ts
// Live founding-license counter. Reads the real remaining slot count from the
// pumkin_remaining_founding_slots() RPC (50 minus paid orders with a founding
// number). The marketing pages are static/prerendered, so they fetch this at
// runtime from the browser to show a live number.
//
// Fails OPEN: if anything goes wrong, it reports full availability rather than
// breaking the page or scaring off buyers with a 0.

import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../lib/supabase";

export const prerender = false;

const TOTAL = 50;

export const GET: APIRoute = async () => {
  const headers = {
    "content-type": "application/json",
    "cache-control": "no-store, max-age=0",
  };

  try {
    const { data, error } = await supabaseAdmin.rpc("pumkin_remaining_founding_slots");
    if (error) throw error;

    const raw = Number(data ?? TOTAL);
    const remaining = Math.max(0, Math.min(TOTAL, Number.isFinite(raw) ? raw : TOTAL));

    return new Response(
      JSON.stringify({ remaining, total: TOTAL, sold: TOTAL - remaining }),
      { status: 200, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ remaining: TOTAL, total: TOTAL, sold: 0 }),
      { status: 200, headers }
    );
  }
};
