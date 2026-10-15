import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer, Invoice, Order } from './types';
import { Plus, Pencil, Trash2, X, Check, FileText, Download, Trash, CalendarClock } from 'lucide-react';
import { openInvoicePdf } from './invoicePdf';

const STATUS_OPTIONS = ['entwurf', 'offen', 'bezahlt', 'überfällig', 'storniert'];
const STATUS_COLORS: Record<string, string> = {
  'entwurf': 'text-white/40 bg-white/4 border-white/10',
  'offen': 'text-yellow-400 bg-yellow-400/8 border-yellow-400/20',
  'bezahlt': 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20',
  'überfällig': 'text-red-400 bg-red-400/8 border-red-400/20',
  'storniert': 'text-white/25 bg-white/3 border-white/8',
};

const emptyInv = {
  invoice_number: '', customer_id: '', order_id: '', status: 'entwurf',
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  tax_rate: 8.1, notes: '',
};
const emptyItem = { description: '', quantity: 1, unit_price: 0 };
const INPUT = 'w-full bg-[#12122a] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors';

function calcTotals(items: typeof emptyItem[], taxRate: number) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const tax_amount = subtotal * (taxRate / 100);
  return { subtotal, tax_amount, total: subtotal + tax_amount };
}

function getDueInfo(inv: Invoice): { label: string; cls: string } | null {
  if (inv.status === 'bezahlt' || inv.status === 'storniert') return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(inv.due_date); due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return { label: `${Math.abs(diffDays)} Tag${Math.abs(diffDays) === 1 ? '' : 'e'} überfällig`, cls: 'text-red-400 bg-red-400/8 border-red-400/20' };
  if (diffDays === 0) return { label: 'Heute fällig', cls: 'text-orange-400 bg-orange-400/8 border-orange-400/20' };
  if (diffDays <= 7) return { label: `in ${diffDays} Tag${diffDays === 1 ? '' : 'en'} fällig`, cls: 'text-yellow-400 bg-yellow-400/8 border-yellow-400/20' };
  return { label: `fällig ${due.toLocaleDateString('de-CH')}`, cls: 'text-white/40 bg-white/4 border-white/10' };
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; data: typeof emptyInv; items: typeof emptyItem[]; id?: string }>({
    open: false, data: { ...emptyInv }, items: [{ ...emptyItem }],
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: inv }, { data: c }, { data: o }] = await Promise.all([
      supabase.from('admin_invoices').select('*, admin_customers(name, company), admin_invoice_items(*)').order('created_at', { ascending: false }),
      supabase.from('admin_customers').select('id, name, company').order('name'),
      supabase.from('admin_orders').select('id, title, customer_id').order('created_at', { ascending: false }),
    ]);
    setInvoices(inv ?? []);
    setCustomers((c ?? []) as Customer[]);
    setOrders((o ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    const nextNum = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    setModal({ open: true, data: { ...emptyInv, invoice_number: nextNum }, items: [{ ...emptyItem }] });
  };

  const openEdit = async (inv: Invoice) => {
    const { data: items } = await supabase.from('admin_invoice_items').select('*').eq('invoice_id', inv.id);
    setModal({
      open: true, id: inv.id,
      data: {
        invoice_number: inv.invoice_number, customer_id: inv.customer_id,
        order_id: inv.order_id ?? '', status: inv.status,
        issue_date: inv.issue_date, due_date: inv.due_date,
        tax_rate: inv.tax_rate, notes: inv.notes,
      },
      items: (items ?? []).map(it => ({ description: it.description, quantity: it.quantity, unit_price: it.unit_price })),
    });
  };

  const closeModal = () => setModal({ open: false, data: { ...emptyInv }, items: [{ ...emptyItem }] });

  const save = async () => {
    if (!modal.data.customer_id || !modal.data.invoice_number) return;
    setSaving(true);
    const { subtotal, tax_amount, total } = calcTotals(modal.items, modal.data.tax_rate);
    const payload = { ...modal.data, order_id: modal.data.order_id || null, subtotal, tax_amount, total };
    let invoiceId = modal.id;
    if (invoiceId) {
      await supabase.from('admin_invoices').update(payload).eq('id', invoiceId);
      await supabase.from('admin_invoice_items').delete().eq('invoice_id', invoiceId);
    } else {
      const { data } = await supabase.from('admin_invoices').insert(payload).select().maybeSingle();
      invoiceId = data?.id;
    }
    if (invoiceId && modal.items.length > 0) {
      await supabase.from('admin_invoice_items').insert(
        modal.items.filter(it => it.description).map(it => ({ invoice_id: invoiceId!, ...it }))
      );
    }
    setSaving(false);
    closeModal();
    load();
  };

  const del = async (id: string) => {
    await supabase.from('admin_invoices').delete().eq('id', id);
    setDeleteId(null);
    load();
  };

  const downloadPdf = async (inv: Invoice) => {
    const { data: items } = await supabase.from('admin_invoice_items').select('*').eq('invoice_id', inv.id);
    const { data: customer } = await supabase.from('admin_customers').select('*').eq('id', inv.customer_id).maybeSingle();
    openInvoicePdf({ ...inv, admin_customers: customer ?? undefined, admin_invoice_items: items ?? [] }, items ?? []);
  };

  const setItem = (i: number, field: keyof typeof emptyItem, val: string | number) => {
    setModal(m => ({ ...m, items: m.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) }));
  };

  const addItem = () => setModal(m => ({ ...m, items: [...m.items, { ...emptyItem }] }));
  const removeItem = (i: number) => setModal(m => ({ ...m, items: m.items.filter((_, idx) => idx !== i) }));

  const { subtotal, tax_amount, total } = calcTotals(modal.items, modal.data.tax_rate);
  const filteredOrders = orders.filter(o => !modal.data.customer_id || o.customer_id === modal.data.customer_id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Rechnungen</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-[#05050f] font-mono font-bold text-xs rounded-lg hover:bg-cyan-300 transition-colors">
          <Plus size={14} /> Neue Rechnung
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 font-mono text-sm">Laden...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 text-white/20 font-mono text-sm">Noch keine Rechnungen vorhanden.</div>
      ) : (
        <div className="grid gap-3">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-[#0f0f1a] border border-white/8 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-white/14 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-cyan-400/8 border border-cyan-400/15 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm font-mono">{inv.invoice_number}</p>
                  <p className="text-white/35 text-xs font-mono truncate">
                    {(inv.admin_customers as any)?.name || '—'} · {new Date(inv.issue_date).toLocaleDateString('de-CH')}
                  </p>
                  {getDueInfo(inv) && (
                    <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono border ${getDueInfo(inv)!.cls}`}>
                      <CalendarClock size={10} /> {getDueInfo(inv)!.label}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4 text-xs font-mono">
                <span className="text-cyan-400 font-bold">CHF {Number(inv.total).toFixed(2)}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${STATUS_COLORS[inv.status] ?? 'text-white/40'}`}>{inv.status}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => downloadPdf(inv)} title="PDF herunterladen" className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors">
                  <Download size={13} />
                </button>
                <button onClick={() => openEdit(inv)} className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteId(inv.id)} className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-red-400 hover:border-red-400/30 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">{modal.id ? 'Rechnung bearbeiten' : 'Neue Rechnung'}</h3>
              <button onClick={closeModal} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Rechnungsnummer *</label>
                  <input type="text" value={modal.data.invoice_number} onChange={e => setModal(m => ({ ...m, data: { ...m.data, invoice_number: e.target.value } }))} className={`${INPUT} font-mono`} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Status</label>
                  <select value={modal.data.status} onChange={e => setModal(m => ({ ...m, data: { ...m.data, status: e.target.value } }))} className={INPUT}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Kunde *</label>
                <select value={modal.data.customer_id} onChange={e => setModal(m => ({ ...m, data: { ...m.data, customer_id: e.target.value, order_id: '' } }))} className={INPUT}>
                  <option value="">Bitte wählen...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` – ${c.company}` : ''}</option>)}
                </select>
              </div>

              {filteredOrders.length > 0 && (
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Auftrag (optional)</label>
                  <select value={modal.data.order_id} onChange={e => setModal(m => ({ ...m, data: { ...m.data, order_id: e.target.value } }))} className={INPUT}>
                    <option value="">Kein Auftrag</option>
                    {filteredOrders.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Ausstelldatum</label>
                  <input type="date" value={modal.data.issue_date} onChange={e => setModal(m => ({ ...m, data: { ...m.data, issue_date: e.target.value } }))} className={INPUT} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Fälligkeitsdatum</label>
                  <input type="date" value={modal.data.due_date} onChange={e => setModal(m => ({ ...m, data: { ...m.data, due_date: e.target.value } }))} className={INPUT} />
                </div>
                <div>
                  <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">MwSt. %</label>
                  <input type="number" step="0.1" value={modal.data.tax_rate} onChange={e => setModal(m => ({ ...m, data: { ...m.data, tax_rate: parseFloat(e.target.value) || 0 } }))} className={`${INPUT} font-mono`} />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-mono text-xs text-white/35 tracking-wider uppercase">Positionen</label>
                <button onClick={addItem} className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                  <Plus size={12} /> Position hinzufügen
                </button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 px-1">
                  {['BESCHREIBUNG', 'MENGE', 'EINZELPREIS', ''].map(h => (
                    <span key={h} className="font-mono text-[10px] text-white/25 tracking-wider uppercase">{h}</span>
                  ))}
                </div>
                {modal.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center">
                    <input type="text" placeholder="Dienstleistung / Produkt" value={item.description} onChange={e => setItem(i, 'description', e.target.value)}
                      className="bg-[#12122a] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors" />
                    <input type="number" min="0" step="0.5" value={item.quantity} onChange={e => setItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                      className="bg-[#12122a] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors font-mono text-right" />
                    <input type="number" min="0" step="0.01" value={item.unit_price} onChange={e => setItem(i, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="bg-[#12122a] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors font-mono text-right" />
                    <button onClick={() => removeItem(i)} disabled={modal.items.length === 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-colors disabled:opacity-20">
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <div className="bg-white/3 border border-white/6 rounded-xl p-4 min-w-[220px] space-y-2">
                  <div className="flex justify-between text-xs text-white/40 font-mono">
                    <span>Zwischensumme</span><span>CHF {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/40 font-mono">
                    <span>MwSt. {modal.data.tax_rate}%</span><span>CHF {tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold font-mono border-t border-white/8 pt-2">
                    <span className="text-white">Total</span><span className="text-cyan-400">CHF {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Notizen</label>
              <textarea value={modal.data.notes} onChange={e => setModal(m => ({ ...m, data: { ...m.data, notes: e.target.value } }))} rows={2} className={`${INPUT} resize-none`} />
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
            <h3 className="font-bold text-white mb-2">Rechnung löschen?</h3>
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
