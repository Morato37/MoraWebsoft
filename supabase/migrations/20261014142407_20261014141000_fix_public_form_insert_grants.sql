/*
# Restore restricted public form inserts

1. Purpose
- Keep the public contact and online-CV forms functional after tightening admin-table privileges.

2. Changes
- Restore INSERT access for the anonymous form role on `admin_leads` and `admin_cv_requests`.
- The existing INSERT policies still require contact leads and CV requests to start with status `neu`.
- Contact admin notes must remain empty on public inserts.

3. Security
- Anonymous users still cannot SELECT, UPDATE, or DELETE CRM data.
- Anonymous users cannot create a lead with an internal workflow status or private admin note.
- Authenticated admin access remains unchanged.

4. Data safety
- No rows or columns are removed or changed.
*/

GRANT INSERT ON admin_leads TO anon;
GRANT INSERT ON admin_cv_requests TO anon;
