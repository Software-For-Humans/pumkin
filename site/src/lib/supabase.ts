// src/lib/supabase.ts
// Server-side Supabase client using the service_role key.
// IMPORTANT: this client bypasses Row Level Security. Never expose it to
// the browser. It's only used inside /api/* routes and the server-rendered
// thank-you page.

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.SUPABASE_URL;
const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Don't throw on module load — let individual handlers fail with a clearer
  // 500. This lets the rest of the build succeed even if env vars are unset
  // in CI/local dev.
  console.warn("[pumkin] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
}

export const supabaseAdmin = createClient(url ?? "", serviceKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type PumkinOrder = {
  id: string;
  stripe_session: string;
  stripe_customer: string | null;
  stripe_payment: string | null;
  email: string;
  name: string | null;
  amount_cents: number;
  currency: string;
  version: string;
  download_token: string;
  founding_no: number | null;
  download_count: number;
  first_dl_at: string | null;
  last_dl_at: string | null;
  email_sent_at: string | null;
  status: "paid" | "refunded" | "disputed" | "test";
  refunded_at: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};
