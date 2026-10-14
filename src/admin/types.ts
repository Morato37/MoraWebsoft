export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  title: string;
  status: string;
  order_date: string;
  notes: string;
  created_at: string;
  admin_customers?: { name: string; company: string };
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface CatalogItem {
  id: string;
  key: string | null;
  name: string;
  description: string;
  category: string;
  unit_price: number;
  price_type: import('./catalog').CatalogPriceType;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  note: string;
  quantity: number;
  unit_price: number;
}

export interface Quote {
  id: string;
  quote_number: string;
  customer_id: string;
  title: string;
  status: string;
  valid_until: string;
  payment_terms: string;
  discount: number;
  tax_rate: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  notes: string;
  items: QuoteItem[];
  created_at: string;
  updated_at: string;
  admin_customers?: { name: string; company: string; email?: string; address?: string; phone?: string };
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  order_id: string | null;
  status: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string;
  created_at: string;
  admin_customers?: { name: string; company: string; email?: string; address?: string; phone?: string };
  admin_invoice_items?: InvoiceItem[];
}
