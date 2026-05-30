-- 001_pumkin_orders.sql
-- Run in Supabase SQL Editor or via `supabase db push`.
-- Creates the single table that holds every Pumkin order, plus the sequence
-- used to assign founding member numbers (1..50).

-- Sequence for auto-assigning founding numbers. NO MAXVALUE so we don't
-- crash the webhook if Stripe's inventory cap is bypassed; the cap is
-- enforced at the Stripe payment-link level.
CREATE SEQUENCE IF NOT EXISTS pumkin_founding_seq START 1;

CREATE TABLE IF NOT EXISTS pumkin_orders (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stripe identifiers
  stripe_session  TEXT        UNIQUE NOT NULL,
  stripe_customer TEXT,
  stripe_payment  TEXT,

  -- Buyer
  email           TEXT        NOT NULL,
  name            TEXT,

  -- Payment
  amount_cents    INT         NOT NULL,
  currency        TEXT        NOT NULL DEFAULT 'usd',
  version         TEXT        NOT NULL DEFAULT '0.0.1',

  -- License / access
  download_token  UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  founding_no     INT,        -- assigned by handler for live orders; null for test/refunded

  -- Tracking
  download_count  INT         NOT NULL DEFAULT 0,
  first_dl_at     TIMESTAMPTZ,
  last_dl_at      TIMESTAMPTZ,
  email_sent_at   TIMESTAMPTZ,

  -- Status
  status          TEXT        NOT NULL DEFAULT 'paid'
                              CHECK (status IN ('paid', 'refunded', 'disputed', 'test')),
  refunded_at     TIMESTAMPTZ,

  -- Notes / extras
  notes           TEXT,
  metadata        JSONB       NOT NULL DEFAULT '{}'::jsonb,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for hot lookups
CREATE INDEX IF NOT EXISTS idx_pumkin_orders_token   ON pumkin_orders (download_token);
CREATE INDEX IF NOT EXISTS idx_pumkin_orders_email   ON pumkin_orders (email);
CREATE INDEX IF NOT EXISTS idx_pumkin_orders_session ON pumkin_orders (stripe_session);
CREATE INDEX IF NOT EXISTS idx_pumkin_orders_status  ON pumkin_orders (status);
CREATE INDEX IF NOT EXISTS idx_pumkin_orders_created ON pumkin_orders (created_at DESC);

-- Helper view: just the live, paid orders ordered by founding number
CREATE OR REPLACE VIEW pumkin_founding_members AS
  SELECT founding_no, email, name, amount_cents, currency, created_at, version
  FROM pumkin_orders
  WHERE status = 'paid' AND founding_no IS NOT NULL
  ORDER BY founding_no ASC;

-- Helper: count of remaining founding slots
CREATE OR REPLACE FUNCTION pumkin_remaining_founding_slots()
RETURNS INT LANGUAGE SQL STABLE AS $$
  SELECT GREATEST(0, 50 - COUNT(*))::INT
  FROM pumkin_orders
  WHERE status = 'paid' AND founding_no IS NOT NULL;
$$;

-- Atomically grab the next founding number from the sequence.
-- Called by the Stripe webhook for each live, paid order.
CREATE OR REPLACE FUNCTION nextval_pumkin_founding()
RETURNS INT LANGUAGE SQL VOLATILE AS $$
  SELECT nextval('pumkin_founding_seq')::INT;
$$;

-- Row Level Security: lock the table down. Only service-role key (used by
-- API routes) can read/write. Public anon key gets nothing.
ALTER TABLE pumkin_orders ENABLE ROW LEVEL SECURITY;
-- (No policies defined => no access for anon/authenticated; service_role
--  bypasses RLS by design.)
