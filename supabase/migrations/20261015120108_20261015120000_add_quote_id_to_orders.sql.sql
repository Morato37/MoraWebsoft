/*
# Add quote_id to admin_orders

1. Changes
- Adds nullable `quote_id` column to `admin_orders` to link orders back to their source quote.
- Adds an index on `quote_id` for quick lookups.
2. Security
- No policy changes needed; existing RLS policies on admin_orders remain unchanged.
*/

ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES admin_quotes(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS admin_orders_quote_id_idx ON admin_orders(quote_id);
