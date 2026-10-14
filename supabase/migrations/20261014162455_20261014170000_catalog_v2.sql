/*
# Catalog version 2 metadata

1. Modified Tables
- `admin_catalog_items.key` stores the stable catalog key and is nullable for legacy rows.
- `admin_catalog_items.price_type` stores the display/billing unit and defaults to `fix`.
- `admin_catalog_items.sort_order` stores ordering within a category and defaults to 0.
- `admin_catalog_items.active` controls whether an item is offered for new quote positions and defaults to true.

2. New Tables
- `admin_catalog_settings` stores the installed catalog version so the application can migrate legacy entries once.

3. Security
- Row-level security is enabled on the settings table.
- Authenticated admin users receive separate SELECT, INSERT, UPDATE and DELETE policies.
- A partial unique index makes non-null catalog keys unique without changing legacy rows.

4. Important Notes
- Existing catalog rows are not deleted or renamed. The application deactivates legacy rows when it installs catalog version 2.
- Existing quote JSON remains untouched and can still render its saved item text and prices.
*/

ALTER TABLE admin_catalog_items ADD COLUMN IF NOT EXISTS key text;
ALTER TABLE admin_catalog_items ADD COLUMN IF NOT EXISTS price_type text NOT NULL DEFAULT 'fix';
ALTER TABLE admin_catalog_items ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE admin_catalog_items ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS admin_catalog_items_key_unique_idx
  ON admin_catalog_items(key)
  WHERE key IS NOT NULL;

CREATE TABLE IF NOT EXISTS admin_catalog_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  catalog_version integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_catalog_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can select catalog settings" ON admin_catalog_settings;
CREATE POLICY "Authenticated users can select catalog settings"
  ON admin_catalog_settings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert catalog settings" ON admin_catalog_settings;
CREATE POLICY "Authenticated users can insert catalog settings"
  ON admin_catalog_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can update catalog settings" ON admin_catalog_settings;
CREATE POLICY "Authenticated users can update catalog settings"
  ON admin_catalog_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can delete catalog settings" ON admin_catalog_settings;
CREATE POLICY "Authenticated users can delete catalog settings"
  ON admin_catalog_settings FOR DELETE TO authenticated USING (true);
