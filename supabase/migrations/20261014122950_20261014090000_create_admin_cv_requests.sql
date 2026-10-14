/*
# Create secure CV request workflow

1. Purpose
- Store CV website requests submitted from the public website.
- Accept applicant details and private supporting documents without requiring visitor accounts.
- Keep request management restricted to authenticated administrators.

2. New table: `admin_cv_requests`
- `id`: request identifier shared with the private upload folder.
- `vorname`, `nachname`, `email`, `telefon`: contact details.
- `beruf`, `zielposition`: current title and desired direction.
- `sprache`, `design`, `akzentfarbe`: requested CV presentation.
- `wunschdomain`, `domain_alt`: preferred domains.
- `paket`: selected CV package.
- `linkedin`, `bemerkung`: optional profile and notes.
- `dateien`: JSON metadata for uploaded document paths.
- `status`: internal workflow status, default `neu`.
- `erstellt_am`: server-created submission time.

3. Storage
- Create private bucket `cv-uploads` with a 15 MB per-file limit.
- Allow only PDF, JPG, PNG, WEBP, DOC, and DOCX uploads.
- Public users may upload only into a UUID request folder and known document slot.
- Only authenticated administrators may read or delete uploaded documents.

4. Security
- Enable RLS on the request table.
- Public INSERT is limited to applicant-entered columns; internal status and timestamps are database-controlled.
- Authenticated users may manage request rows for the protected admin area.
- No existing tables, columns, or user data are removed.
*/

CREATE TABLE IF NOT EXISTS admin_cv_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vorname text NOT NULL DEFAULT '',
  nachname text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  telefon text NOT NULL DEFAULT '',
  beruf text NOT NULL DEFAULT '',
  zielposition text NOT NULL DEFAULT '',
  sprache text NOT NULL DEFAULT 'de',
  design text NOT NULL DEFAULT 'dunkel',
  akzentfarbe text NOT NULL DEFAULT '',
  wunschdomain text NOT NULL DEFAULT '',
  domain_alt text NOT NULL DEFAULT '',
  paket text NOT NULL DEFAULT 'standard',
  linkedin text NOT NULL DEFAULT '',
  bemerkung text NOT NULL DEFAULT '',
  dateien jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'neu',
  erstellt_am timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_cv_requests ENABLE ROW LEVEL SECURITY;

REVOKE INSERT ON admin_cv_requests FROM anon, authenticated;
GRANT INSERT (
  id, vorname, nachname, email, telefon, beruf, zielposition, sprache,
  design, akzentfarbe, wunschdomain, domain_alt, paket, linkedin,
  bemerkung, dateien
) ON admin_cv_requests TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_cv" ON admin_cv_requests;
CREATE POLICY "anon_insert_cv" ON admin_cv_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'neu');

DROP POLICY IF EXISTS "auth_select_cv" ON admin_cv_requests;
CREATE POLICY "auth_select_cv" ON admin_cv_requests
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_cv" ON admin_cv_requests;
CREATE POLICY "auth_update_cv" ON admin_cv_requests
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_cv" ON admin_cv_requests;
CREATE POLICY "auth_delete_cv" ON admin_cv_requests
  FOR DELETE TO authenticated USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-uploads',
  'cv-uploads',
  false,
  15728640,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "anon_upload_cv" ON storage.objects;
CREATE POLICY "anon_upload_cv" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
    AND (storage.foldername(name))[2] IN ('cv', 'foto', 'zeugnisse', 'ausweis')
  );

DROP POLICY IF EXISTS "auth_read_cv" ON storage.objects;
CREATE POLICY "auth_read_cv" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cv-uploads');

DROP POLICY IF EXISTS "auth_delete_cv_files" ON storage.objects;
CREATE POLICY "auth_delete_cv_files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cv-uploads');
