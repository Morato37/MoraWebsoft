/*
# Add catalog and quotes to the admin workspace

1. New Tables
- `admin_catalog_items` stores reusable services/products with name, description, category and CHF unit price.
- `admin_quotes` stores offers linked to an existing admin customer, including status, validity, payment terms, discount, VAT and JSON line items.

2. Modified Tables
- `admin_invoices` receives nullable `quote_id`, preserving existing invoices while allowing invoices created from accepted offers to retain their source.

3. Security
- Row-level security is enabled on both new tables.
- Authenticated admin users receive separate SELECT, INSERT, UPDATE and DELETE policies.
- Existing invoice data is preserved; the new quote link is optional.

4. Important Notes
- This is a single admin workspace, so authenticated admin policies intentionally allow access to all rows.
- Quote line items remain inside the quote row as JSONB so the complete offer can be loaded in one read.
*/

CREATE TABLE IF NOT EXISTS admin_catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_catalog_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can select catalog items" ON admin_catalog_items;
CREATE POLICY "Authenticated users can select catalog items"
  ON admin_catalog_items FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert catalog items" ON admin_catalog_items;
CREATE POLICY "Authenticated users can insert catalog items"
  ON admin_catalog_items FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can update catalog items" ON admin_catalog_items;
CREATE POLICY "Authenticated users can update catalog items"
  ON admin_catalog_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can delete catalog items" ON admin_catalog_items;
CREATE POLICY "Authenticated users can delete catalog items"
  ON admin_catalog_items FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS admin_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text NOT NULL DEFAULT '',
  customer_id uuid NOT NULL REFERENCES admin_customers(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'entwurf',
  valid_until date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  payment_terms text NOT NULL DEFAULT '30 Tage netto',
  discount numeric(5,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) NOT NULL DEFAULT 7.7,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can select quotes" ON admin_quotes;
CREATE POLICY "Authenticated users can select quotes"
  ON admin_quotes FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert quotes" ON admin_quotes;
CREATE POLICY "Authenticated users can insert quotes"
  ON admin_quotes FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can update quotes" ON admin_quotes;
CREATE POLICY "Authenticated users can update quotes"
  ON admin_quotes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can delete quotes" ON admin_quotes;
CREATE POLICY "Authenticated users can delete quotes"
  ON admin_quotes FOR DELETE TO authenticated USING (true);

ALTER TABLE admin_invoices ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES admin_quotes(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS admin_quotes_customer_id_idx ON admin_quotes(customer_id);
CREATE INDEX IF NOT EXISTS admin_invoices_quote_id_idx ON admin_invoices(quote_id);
