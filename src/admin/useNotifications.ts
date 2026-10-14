import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface NotificationCounts {
  crm: number;
  customers: number;
  orders: number;
  invoices: number;
  cv: number;
  total: number;
}

const EMPTY: NotificationCounts = {
  crm: 0,
  customers: 0,
  orders: 0,
  invoices: 0,
  cv: 0,
  total: 0,
};

export function useNotifications(): NotificationCounts & { refresh: () => void } {
  const [counts, setCounts] = useState<NotificationCounts>(EMPTY);

  const refresh = useCallback(async () => {
    const [
      { count: newLeads },
      { count: newCv },
      { count: openOrders },
      { count: openInvoices },
    ] = await Promise.all([
      supabase.from('admin_leads').select('*', { count: 'exact', head: true }).eq('status', 'neu'),
      supabase.from('admin_cv_requests').select('*', { count: 'exact', head: true }).eq('status', 'neu'),
      supabase.from('admin_orders').select('*', { count: 'exact', head: true }).in('status', ['offen', 'in Bearbeitung']),
      supabase.from('admin_invoices').select('*', { count: 'exact', head: true }).in('status', ['offen', 'überfällig']),
    ]);

    const crm = newLeads ?? 0;
    const cv = newCv ?? 0;
    const orders = openOrders ?? 0;
    const invoices = openInvoices ?? 0;

    setCounts({
      crm,
      customers: 0,
      orders,
      invoices,
      cv,
      total: crm + cv + orders + invoices,
    });
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_leads' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_cv_requests' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_orders' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_invoices' }, () => refresh())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  return { ...counts, refresh };
}
