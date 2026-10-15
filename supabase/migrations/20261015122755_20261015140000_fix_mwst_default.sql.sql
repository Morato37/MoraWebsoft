-- Fix default MwSt from 7.7 to 8.1 on admin_invoices
ALTER TABLE admin_invoices ALTER COLUMN tax_rate SET DEFAULT 8.1;

-- Update existing rows that still have the old default
UPDATE admin_invoices SET tax_rate = 8.1 WHERE tax_rate = 7.7;
