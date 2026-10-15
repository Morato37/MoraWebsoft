/*
# Add structured customer address fields

1. Purpose
- Adds structured address values needed for Swiss QR bills without removing or changing the existing free-text address.

2. Modified table
- `admin_customers.street`: street name.
- `admin_customers.house_number`: house or building number.
- `admin_customers.postal_code`: postal code.
- `admin_customers.town`: town or city.
- `admin_customers.country`: two-letter ISO country code, default `CH`.

3. Data safety
- Existing customer rows keep their current `address` value.
- New fields receive empty/default values and are filled explicitly by the user.

4. Security
- No new table, policy, or permission is introduced.
- Existing access rules on `admin_customers` remain unchanged.
*/

ALTER TABLE admin_customers
  ADD COLUMN IF NOT EXISTS street text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS house_number text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS postal_code text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS town text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'CH';
