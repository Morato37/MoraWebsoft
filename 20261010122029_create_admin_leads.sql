/*
# Create admin_leads table

1. New Tables
- `admin_leads` – Contact form submissions from the public website
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `firma` (text, optional company name)
  - `email` (text, not null)
  - `telefon` (text, optional phone)
  - `leistung` (text, selected service)
  - `nachricht` (text, message body)
  - `quelle` (text, source / origin page)
  - `erstellt_am` (timestamptz, defaults to now())

2. Security
- RLS enabled on `admin_leads`.
- Anon + authenticated INSERT allowed (public contact form writes without login).
- SELECT / UPDATE / DELETE restricted to authenticated users (admin only).
*/

CREATE TABLE IF NOT EXISTS admin_leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL DEFAULT '',
  firma       text NOT NULL DEFAULT '',
  email       text NOT NULL DEFAULT '',
  telefon     text NOT NULL DEFAULT '',
  leistung    text NOT NULL DEFAULT '',
  nachricht   text NOT NULL DEFAULT '',
  quelle      text NOT NULL DEFAULT '',
  erstellt_am timestamptz DEFAULT now()
);

ALTER TABLE admin_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads" ON admin_leads;
CREATE POLICY "anon_insert_leads"
  ON admin_leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_leads" ON admin_leads;
CREATE POLICY "auth_select_leads"
  ON admin_leads FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_leads" ON admin_leads;
CREATE POLICY "auth_update_leads"
  ON admin_leads FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_leads" ON admin_leads;
CREATE POLICY "auth_delete_leads"
  ON admin_leads FOR DELETE
  TO authenticated USING (true);
