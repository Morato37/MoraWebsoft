/*
# Fix catalog version 2 upsert

1. Modified Tables
- No data columns are changed.
- `admin_catalog_items.key` continues to allow null values for legacy rows.

2. Indexes
- Add a full unique index for `admin_catalog_items.key` so Supabase can safely use `upsert(..., { onConflict: 'key' })`.
- PostgreSQL allows multiple null values, so legacy rows without keys remain valid.

3. Security
- No permissions or row-level security policies are changed.

4. Important Notes
- Existing catalog rows and existing quote data are preserved.
- This fixes only the catalog version migration path that populates the standard entries.
*/

CREATE UNIQUE INDEX IF NOT EXISTS admin_catalog_items_key_unique_idx_v2
  ON admin_catalog_items(key);
