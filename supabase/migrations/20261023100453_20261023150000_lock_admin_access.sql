/*
# Lock CRM access to the designated administrator

1. Purpose
- Restrict all administrative CRM data to the existing administrator account.
- Keep public lead and CV request forms able to submit new requests without exposing stored requests.

2. Protected tables
- `admin_customers`, `admin_orders`, `admin_invoices`, `admin_invoice_items`
- `admin_leads`, `admin_cv_requests`
- `admin_quotes`, `admin_catalog_items`, `admin_catalog_settings`

3. Security changes
- Replace authenticated-user-wide policies with policies restricted to the administrator UUID `053bdf71-bd10-4589-bd9a-4d0dac1a3053`.
- Remove all anonymous access from CRM, quotation, and catalog tables.
- Preserve anonymous INSERT-only access for public lead and CV request forms, with their existing safe default checks.
- Keep RLS enabled and grant only the roles and verbs required by each flow.

4. Important notes
- The UUID is the existing administrator account identified in `auth.users`.
- Public forms can create new lead and CV request records, but cannot read, update, or delete any stored records.
- No data rows are deleted or modified by this migration.
*/

REVOKE ALL ON admin_customers FROM anon;
REVOKE ALL ON admin_orders FROM anon;
REVOKE ALL ON admin_invoices FROM anon;
REVOKE ALL ON admin_invoice_items FROM anon;
REVOKE ALL ON admin_leads FROM anon;
REVOKE ALL ON admin_cv_requests FROM anon;
REVOKE ALL ON admin_quotes FROM anon;
REVOKE ALL ON admin_catalog_items FROM anon;
REVOKE ALL ON admin_catalog_settings FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON admin_customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_invoice_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_leads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_cv_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_quotes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_catalog_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_catalog_settings TO authenticated;

GRANT INSERT ON admin_leads TO anon;
GRANT INSERT ON admin_cv_requests TO anon;

DO $$
DECLARE
  table_name text;
  admin_uuid text := '053bdf71-bd10-4589-bd9a-4d0dac1a3053';
BEGIN
  DROP POLICY IF EXISTS "anon_insert_leads" ON admin_leads;
  DROP POLICY IF EXISTS "anon_insert_cv" ON admin_cv_requests;

  FOREACH table_name IN ARRAY ARRAY[
    'admin_customers', 'admin_orders', 'admin_invoices', 'admin_invoice_items',
    'admin_leads', 'admin_cv_requests', 'admin_quotes', 'admin_catalog_items',
    'admin_catalog_settings'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can select customers" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert customers" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update customers" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete customers" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can select orders" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert orders" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update orders" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete orders" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can select invoices" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert invoices" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update invoices" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete invoices" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can select invoice items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert invoice items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update invoice items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete invoice items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can select quotes" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert quotes" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update quotes" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete quotes" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can select catalog items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert catalog items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update catalog items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete catalog items" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can select catalog settings" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert catalog settings" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update catalog settings" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete catalog settings" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_select_leads" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_insert_leads" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_update_leads" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_delete_leads" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_select_cv" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_insert_cv" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_update_cv" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "auth_delete_cv" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "admin_select" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "admin_insert" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "admin_update" ON %I', table_name);
    EXECUTE format('DROP POLICY IF EXISTS "admin_delete" ON %I', table_name);

    EXECUTE format('CREATE POLICY "admin_select" ON %I FOR SELECT TO authenticated USING (auth.uid() = %L::uuid)', table_name, admin_uuid);
    EXECUTE format('CREATE POLICY "admin_insert" ON %I FOR INSERT TO authenticated WITH CHECK (auth.uid() = %L::uuid)', table_name, admin_uuid);
    EXECUTE format('CREATE POLICY "admin_update" ON %I FOR UPDATE TO authenticated USING (auth.uid() = %L::uuid) WITH CHECK (auth.uid() = %L::uuid)', table_name, admin_uuid, admin_uuid);
    EXECUTE format('CREATE POLICY "admin_delete" ON %I FOR DELETE TO authenticated USING (auth.uid() = %L::uuid)', table_name, admin_uuid);
  END LOOP;
END $$;

CREATE POLICY "anon_insert_leads" ON admin_leads FOR INSERT TO anon WITH CHECK ((status = 'neu'::text) AND (notizen = ''::text));
CREATE POLICY "anon_insert_cv" ON admin_cv_requests FOR INSERT TO anon WITH CHECK (status = 'neu'::text);
