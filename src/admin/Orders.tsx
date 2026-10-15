import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer, Order, Quote } from './types';
import { Plus, Pencil, Trash2, X, Check, ClipboardList, Download, FileText } from 'lucide-react';
import { downloadOrderPdf } from './orderPdf';

const STATUS_OPTIONS = ['offen', 'in Bearbeitung', 'abgeschlossen', 'storniert'];
const STATUS_COLORS: Record<string, string> = {
  'offen': 'text-yellow-400 bg-yellow-400/8 border-yellow-400/20',
  'in Bearbeitung': 'text-cyan-400 bg-cyan-400/8 border-cyan-400/20',
  'abgeschlossen': 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20',
  'storniert': 'text-red-400 bg-red-400/8 border-red-400/20',
};

const emptyOrder = { customer_id: '', title: '', status: 'offen', order_date: new Date().toISOString().slice(0, 10), notes: '' };
const INPUT = 'w-full bg-[#12122a] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; data: typeof emptyOrder; id?: string }>({ open: false, data: { ...emptyOrder } });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [converting, setConverting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: o }, { data: c }] = await Promise.all([
      supabase.from('admin_orders').select('*, admin_customers(name, company)').order('created_at', { ascending: false }),
      supabase.from('admin_customers').select('id, name, company').order('name'),
    ]);
    setOrders(o ?? []);
    setCustomers((c ?? []) as Customer[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => setModal({ open: true, data: { ...emptyOrder, order_date: new Date().toISOString().slice(0, 10) } });
  const openEdit = (o: Order) => setModal({ open: true, data: { customer_id: o.customer_id, title: o.title, status: o.status, order_date: o.order_date, notes: o.notes }, id: o.id });
  const closeModal = () => setModal({ open: false, data: { ...emptyOrder } });

  const save = async () => {
    if (!modal.data.customer_id || !modal.data.title) return;
    setSaving(true);
    if (modal.id) {
      await supabase.from('admin_orders').update(modal.data).eq('id', modal.id);
    } else {
      await supabase.from('admin_orders').insert(modal.data);
    }
    setSaving(false);
    closeModal();
    load();
  };

  const del = async (id: string) => {
    await supabase.from('admin_orders').delete().eq('id', id);
    setDeleteId(null);
    load();
  };

  const convertToInvoice = async (order: Order) => {
    if (converting) return;
    setConverting(order.id);

    let quote: Quote | null = null;
    if (order.quote_id) {
      const { data: q } = await supabase.from('admin_quotes').select('*').eq('id', order.quote_id).maybeSingle();
      quote = q as Quote | null;
    }

    const { count } = await supabase.from('admin_invoices').select('*', { count: 'exact', head: true });
    const invoiceNumber = `RE-${new Date().getFullYear()}-${String((count ?? 0) + 1).padStart(3, '0')}`;

    const invoicePayload = {
      invoice_number: invoiceNumber,
      customer_id: order.customer_id,
      order_id: order.id,
      status: 'entwurf',
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      subtotal: quote ? Number(quote.subtotal) : 0,
      tax_rate: quote ? Number(quote.tax_rate) : 8.1,
      tax_amount: quote ? Number(quote.tax_amount) : 0,
      total: quote ? Number(quote.total) : 0,
      notes: quote?.notes ?? '',
    };

    const invoiceResult = await supabase.from('admin_invoices').insert(invoicePayload).select('id').maybeSingle();
    if (invoiceResult.error || !invoiceResult.data) {
      setConverting(null);
      return;
    }

    if (quote && quote.items && quote.items.length > 0) {
      await supabase.from('admin_invoice_items').insert(
        quote.items.map(item => ({
          invoice_id: invoiceResult.data!.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      );
    }

    await supabase.from('admin_orders').update({ status: 'abgeschlossen' }).eq('id', order.id);
    setConverting(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Aufträge</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-[#05050f] font-mono font-bold text-xs rounded-lg hover:bg-cyan-300 transition-colors">
          <Plus size={14} /> Neuer Auftrag
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 font-mono text-sm">Laden...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-white/20 font-mono text-sm">Noch keine Aufträge vorhanden.</div>
      ) : (
        <div className="grid gap-3">
          {orders.map(o => (
            <div key={o.id} className="bg-[#0f0f1a] border border-white/8 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-white/14 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-cyan-400/8 border border-cyan-400/15 flex items-center justify-center shrink-0">
                  <ClipboardList size={14} className="text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{o.title}</p>
                  <p className="text-white/35 text-xs font-mono truncate">
                    {(o.admin_customers as any)?.name || '—'} · {new Date(o.order_date).toLocaleDateString('de-CH')}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {o.quote_id && <span className="text-cyan-400/50 text-[10px] font-mono">Aus Offerte</span>}
                    {o.items && o.items.length > 0 && <span className="text-white/25 text-[10px] font-mono">{o.items.length} Pos.</span>}
                    {Number(o.total) > 0 && <span className="text-cyan-400/60 text-[10px] font-mono font-bold">CHF {Number(o.total).toFixed(2)}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`hidden md:inline-block px-2.5 py-1 rounded-lg text-xs font-mono border ${STATUS_COLORS[o.status] ?? 'text-white/40 bg-white/4 border-white/10'}`}>
                  {o.status}
                </span>
                {o.status !== 'abgeschlossen' && o.status !== 'storniert' && (
                  <button
                    onClick={() => convertToInvoice(o)}
                    disabled={converting === o.id}
                    title="Rechnung erstellen"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono hover:bg-emerald-400/20 hover:border-emerald-400/40 transition-colors disabled:opacity-50"
                  >
                    <FileText size={12} /> {converting === o.id ? '...' : 'Rechnung'}
                  </button>
                )}
                <button onClick={() => downloadOrderPdf(o)} title="PDF herunterladen" className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors">
                  <Download size={13} />
                </button>
                <button onClick={() => openEdit(o)} className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteId(o.id)} className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-red-400 hover:border-red-400/30 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">{modal.id ? 'Auftrag bearbeiten' : 'Neuer Auftrag'}</h3>
              <button onClick={closeModal} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Kunde *</label>
                <select value={modal.data.customer_id} onChange={e => setModal(m => ({ ...m, data: { ...m.data, customer_id: e.target.value } }))} className={INPUT}>
                  <option value="">Bitte wählen...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` – ${c.company}` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Titel *</label>
                <input type="text" value={modal.data.title} onChange={e => setModal(m => ({ ...m, data: { ...m.data, title: e.target.value } }))} className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Status</label>
                  <select value={modal.data.status} onChange={e => setModal(m => ({ ...m, data: { ...m.data, status: e.target.value } }))} className={INPUT}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Datum</label>
                  <input type="date" value={modal.data.order_date} onChange={e => setModal(m => ({ ...m, data: { ...m.data, order_date: e.target.value } }))} className={INPUT} />
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Notizen</label>
                <textarea value={modal.data.notes} onChange={e => setModal(m => ({ ...m, data: { ...m.data, notes: e.target.value } }))} rows={3} className={`${INPUT} resize-none`} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 py-2 border border-white/10 rounded-lg text-white/50 text-sm font-mono hover:border-white/20 transition-colors">Abbrechen</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2 bg-cyan-400 text-[#05050f] font-mono font-bold text-sm rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Check size={14} /> {saving ? 'Speichern...' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-white mb-2">Auftrag löschen?</h3>
            <p className="text-white/40 text-sm mb-6">Dieser Vorgang kann nicht rückgängig gemacht werden.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-white/10 rounded-lg text-white/50 text-sm font-mono hover:border-white/20 transition-colors">Abbrechen</button>
              <button onClick={() => del(deleteId)} className="flex-1 py-2 bg-red-500 text-white font-mono font-bold text-sm rounded-lg hover:bg-red-400 transition-colors">Löschen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
