/*
# Add line items and totals to admin_orders

1. Modified Tables
- `admin_orders` receives:
  - `items` (jsonb, default '[]') – line items as JSONB array (same shape as quote items: description, note, quantity, unit_price)
  - `subtotal` (numeric, default 0) – sum before discount/tax
  - `discount` (numeric, default 0) – discount percentage
  - `discount_amount` (numeric, default 0) – calculated discount amount
  - `tax_rate` (numeric, default 8.1) – VAT rate
  - `tax_amount` (numeric, default 0) – calculated VAT amount
  - `total` (numeric, default 0) – grand total
  - `payment_terms` (text, default '30 Tage netto') – inherited from quote
  - `valid_until` (date, nullable) – inherited from quote validity
2. Security
- No policy changes; existing RLS on admin_orders remains unchanged.
*/

ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS subtotal numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS discount numeric(5,2) NOT NULL DEFAULT 0;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS discount_amount numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tax_rate numeric(5,2) NOT NULL DEFAULT 8.1;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tax_amount numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS total numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_terms text NOT NULL DEFAULT '30 Tage netto';
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS valid_until date;
