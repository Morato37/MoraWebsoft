/*
# Online-CV Bestellungen

1. New table `admin_cv_requests` – Bestellungen aus dem Online-CV-Formular
   (Person, Ziel, Design, Wunschdomain, Paket, Dateipfade im Storage-Bucket).
2. New storage bucket `cv-uploads` (privat): Lebenslauf, Foto, Zeugnisse, Ausweis.
3. Security: RLS an. anon/authenticated INSERT in Tabelle und Bucket (Formular ohne Login),
   SELECT/UPDATE/DELETE nur authenticated (Admin). Bestehende Tabellen unverändert.
*/

CREATE TABLE IF NOT EXISTS admin_cv_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vorname       text NOT NULL DEFAULT '',
  nachname      text NOT NULL DEFAULT '',
  email         text NOT NULL DEFAULT '',
  telefon       text NOT NULL DEFAULT '',
  beruf         text NOT NULL DEFAULT '',
  zielposition  text NOT NULL DEFAULT '',
  sprache       text NOT NULL DEFAULT 'de',
  design        text NOT NULL DEFAULT 'dunkel',
  akzentfarbe   text NOT NULL DEFAULT '',
  wunschdomain  text NOT NULL DEFAULT '',
  domain_alt    text NOT NULL DEFAULT '',
  paket         text NOT NULL DEFAULT 'standard',
  linkedin      text NOT NULL DEFAULT '',
  bemerkung     text NOT NULL DEFAULT '',
  dateien       jsonb NOT NULL DEFAULT '[]'::jsonb,
  status        text NOT NULL DEFAULT 'neu',
  erstellt_am   timestamptz DEFAULT now()
);

ALTER TABLE admin_cv_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_cv" ON admin_cv_requests;
CREATE POLICY "anon_insert_cv" ON admin_cv_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_cv" ON admin_cv_requests;
CREATE POLICY "auth_select_cv" ON admin_cv_requests FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_cv" ON admin_cv_requests;
CREATE POLICY "auth_update_cv" ON admin_cv_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_cv" ON admin_cv_requests;
CREATE POLICY "auth_delete_cv" ON admin_cv_requests FOR DELETE TO authenticated USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cv-uploads', 'cv-uploads', false, 15728640,
  ARRAY['application/pdf','image/jpeg','image/png','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_upload_cv" ON storage.objects;
CREATE POLICY "anon_upload_cv" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'cv-uploads');
DROP POLICY IF EXISTS "auth_read_cv" ON storage.objects;
CREATE POLICY "auth_read_cv" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'cv-uploads');
DROP POLICY IF EXISTS "auth_delete_cv_files" ON storage.objects;
CREATE POLICY "auth_delete_cv_files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cv-uploads');
