/*
# Unified CRM intake and admin-only data access

1. New fields on `admin_leads`
- `status`: internal workflow state, default `neu`.
- `notizen`: private admin notes for follow-up.

2. CRM behavior
- Contact form submissions remain in `admin_leads` with every submitted contact, service, message, and source field.
- CV submissions remain in `admin_cv_requests` with every applicant preference and document metadata.
- The website may create new contact leads, while only authenticated admin users may read, update, or delete CRM records.

3. Security changes
- Anonymous users can no longer read, update, or delete any admin table.
- Anonymous contact inserts are limited to public form fields; workflow status and admin notes are database-controlled.
- Existing authenticated admin access is preserved for customers, orders, invoices, invoice items, contact leads, and CV requests.
- RLS remains enabled and policies are kept separate for each operation.

4. Data safety
- No existing rows, tables, or columns are deleted.
- Existing contact and CV submissions remain available to the new CRM view.
*/

ALTER TABLE admin_leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'neu',
  ADD COLUMN IF NOT EXISTS notizen text NOT NULL DEFAULT '';

REVOKE SELECT, INSERT, UPDATE, DELETE ON admin_leads FROM anon;
GRANT INSERT (name, firma, email, telefon, leistung, nachricht, quelle)
  ON admin_leads TO anon;
GRANT INSERT (name, firma, email, telefon, leistung, nachricht, quelle)
  ON admin_leads TO authenticated;

DROP POLICY IF EXISTS "anon_insert_leads" ON admin_leads;
CREATE POLICY "anon_insert_leads"
  ON admin_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'neu' AND notizen = '');

REVOKE SELECT, INSERT, UPDATE, DELETE ON admin_customers FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON admin_orders FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON admin_invoices FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON admin_invoice_items FROM anon;
REVOKE SELECT, UPDATE, DELETE ON admin_cv_requests FROM anon;

GRANT INSERT (
  id, vorname, nachname, email, telefon, beruf, zielposition, sprache,
  design, akzentfarbe, wunschdomain, domain_alt, paket, linkedin,
  bemerkung, dateien
) ON admin_cv_requests TO anon;
