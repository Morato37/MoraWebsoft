/*
  # Admin CRM Schema

  Creates tables for the admin area: customers, orders, invoices and line items.

  1. New Tables
    - `admin_customers` – Client contacts (name, company, email, phone, address, notes)
    - `admin_orders`    – Orders linked to a customer (title, status, date, notes)
    - `admin_invoices`  – Invoices linked to an order/customer (number, status, issue date, due date, totals)
    - `admin_invoice_items` – Line items belonging to an invoice (description, qty, unit price)

  2. Security
    - RLS enabled on all tables
    - Only authenticated users (the admin) may read/write any of these tables
*/

-- Customers
CREATE TABLE IF NOT EXISTS admin_customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL DEFAULT '',
  company     text NOT NULL DEFAULT '',
  email       text NOT NULL DEFAULT '',
  phone       text NOT NULL DEFAULT '',
  address     text NOT NULL DEFAULT '',
  notes       text NOT NULL DEFAULT '',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE admin_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select customers"
  ON admin_customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON admin_customers FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON admin_customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete customers"
  ON admin_customers FOR DELETE TO authenticated USING (true);


-- Orders
CREATE TABLE IF NOT EXISTS admin_orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  uuid NOT NULL REFERENCES admin_customers(id) ON DELETE CASCADE,
  title        text NOT NULL DEFAULT '',
  status       text NOT NULL DEFAULT 'offen',
  order_date   date NOT NULL DEFAULT CURRENT_DATE,
  notes        text NOT NULL DEFAULT '',
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE admin_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select orders"
  ON admin_orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON admin_orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON admin_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON admin_orders FOR DELETE TO authenticated USING (true);


-- Invoices
CREATE TABLE IF NOT EXISTS admin_invoices (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL DEFAULT '',
  customer_id    uuid NOT NULL REFERENCES admin_customers(id) ON DELETE CASCADE,
  order_id       uuid REFERENCES admin_orders(id) ON DELETE SET NULL,
  status         text NOT NULL DEFAULT 'entwurf',
  issue_date     date NOT NULL DEFAULT CURRENT_DATE,
  due_date       date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  subtotal       numeric(12,2) NOT NULL DEFAULT 0,
  tax_rate       numeric(5,2) NOT NULL DEFAULT 7.7,
  tax_amount     numeric(12,2) NOT NULL DEFAULT 0,
  total          numeric(12,2) NOT NULL DEFAULT 0,
  notes          text NOT NULL DEFAULT '',
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE admin_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select invoices"
  ON admin_invoices FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert invoices"
  ON admin_invoices FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update invoices"
  ON admin_invoices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete invoices"
  ON admin_invoices FOR DELETE TO authenticated USING (true);


-- Invoice line items
CREATE TABLE IF NOT EXISTS admin_invoice_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   uuid NOT NULL REFERENCES admin_invoices(id) ON DELETE CASCADE,
  description  text NOT NULL DEFAULT '',
  quantity     numeric(10,2) NOT NULL DEFAULT 1,
  unit_price   numeric(12,2) NOT NULL DEFAULT 0,
  total        numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE admin_invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select invoice items"
  ON admin_invoice_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert invoice items"
  ON admin_invoice_items FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update invoice items"
  ON admin_invoice_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete invoice items"
  ON admin_invoice_items FOR DELETE TO authenticated USING (true);
