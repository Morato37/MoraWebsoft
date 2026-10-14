import { useEffect, useMemo, useState } from 'react';
import { Check, FileText, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CatalogItem, Customer, Quote, QuoteItem } from './types';
import { openQuotePdf } from './quotePdf';

const STATUS_OPTIONS = ['entwurf', 'gesendet', 'angenommen', 'abgelehnt'];
const STATUS_LABELS: Record<string, string> = { entwurf: 'Entwurf', gesendet: 'Gesendet', angenommen: 'Angenommen', abgelehnt: 'Abgelehnt' };
const STATUS_STYLES: Record<string, string> = {
  entwurf: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  gesendet: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  angenommen: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  abgelehnt: 'border-red-400/30 bg-red-400/10 text-red-200',
};
const INPUT = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-400';
const blankItem = (): QuoteItem => ({ id: crypto.randomUUID(), description: '', note: '', quantity: 1, unit_price: 0 });

function formatCHF(value: number) {
  return `CHF ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
}

function totals(items: QuoteItem[], discount: number, taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const discountAmount = subtotal * discount / 100;
  const taxAmount = (subtotal - discountAmount) * taxRate / 100;
  return { subtotal, discountAmount, taxAmount, total: subtotal - discountAmount + taxAmount };
}

const emptyForm = {
  customer_id: '', title: '', status: 'entwurf', valid_until: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  payment_terms: '30 Tage netto', discount: 0, tax_rate: 7.7, notes: '', items: [blankItem()],
};
type QuoteForm = typeof emptyForm;

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<{ open: boolean; form: QuoteForm; id?: string }>({ open: false, form: emptyForm });
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogForm, setCatalogForm] = useState({ name: '', description: '', category: '', unit_price: 0 });
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    const [{ data: quoteData, error: quoteError }, { data: customerData }, { data: catalogData }] = await Promise.all([
      supabase.from('admin_quotes').select('*, admin_customers(name, company, email, address, phone)').order('created_at', { ascending: false }),
      supabase.from('admin_customers').select('*').order('name'),
      supabase.from('admin_catalog_items').select('*').order('category').order('name'),
    ]);
    if (quoteError) setError('Die Offerten konnten nicht geladen werden.');
    setQuotes((quoteData ?? []) as Quote[]);
    setCustomers((customerData ?? []) as Customer[]);
    setCatalog((catalogData ?? []) as CatalogItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filteredQuotes = useMemo(() => {
    const search = query.trim().toLowerCase();
    return quotes.filter(quote => !search || [quote.quote_number, quote.title, quote.admin_customers?.name, quote.admin_customers?.company].join(' ').toLowerCase().includes(search));
  }, [query, quotes]);

  const openCreate = () => setModal({ open: true, form: { ...emptyForm, items: [blankItem()] } });
  const openEdit = (quote: Quote) => setModal({ open: true, id: quote.id, form: {
    customer_id: quote.customer_id, title: quote.title, status: quote.status, valid_until: quote.valid_until,
    payment_terms: quote.payment_terms, discount: Number(quote.discount), tax_rate: Number(quote.tax_rate), notes: quote.notes,
    items: quote.items?.length ? quote.items : [blankItem()],
  } });
  const closeModal = () => setModal({ open: false, form: { ...emptyForm, items: [blankItem()] } });
  const updateForm = <K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) => setModal(current => ({ ...current, form: { ...current.form, [key]: value } }));

  const saveCatalogItem = async () => {
    if (!catalogForm.name.trim()) return;
    const { error: insertError } = await supabase.from('admin_catalog_items').insert({ ...catalogForm, name: catalogForm.name.trim() });
    if (insertError) setError('Der Katalogeintrag konnte nicht gespeichert werden.');
    else { setCatalogForm({ name: '', description: '', category: '', unit_price: 0 }); load(); }
  };

  const addCatalogItem = (item: CatalogItem) => updateForm('items', [...modal.form.items, { id: crypto.randomUUID(), description: item.name, note: item.description, quantity: 1, unit_price: Number(item.unit_price) }]);
  const updateItem = (index: number, key: keyof QuoteItem, value: string | number) => updateForm('items', modal.form.items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  const quoteTotals = totals(modal.form.items, Number(modal.form.discount), Number(modal.form.tax_rate));

  const saveQuote = async () => {
    if (!modal.form.customer_id || !modal.form.title.trim()) return;
    setSaving(true);
    const number = modal.id ? undefined : `OF-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`;
    const payload = { ...modal.form, ...(number ? { quote_number: number } : {}), ...quoteTotals, items: modal.form.items.filter(item => item.description.trim()) };
    const result = modal.id
      ? await supabase.from('admin_quotes').update(payload).eq('id', modal.id)
      : await supabase.from('admin_quotes').insert(payload);
    if (result.error) setError('Die Offerte konnte nicht gespeichert werden.');
    else { closeModal(); load(); }
    setSaving(false);
  };

  const deleteQuote = async (id: string) => {
    const { error: deleteError } = await supabase.from('admin_quotes').delete().eq('id', id);
    if (deleteError) setError('Die Offerte konnte nicht gelöscht werden.'); else load();
  };

  const convertToInvoice = async (quote: Quote) => {
    if (quote.status !== 'angenommen' || converting) return;
    setConverting(quote.id);
    const { count } = await supabase.from('admin_invoices').select('*', { count: 'exact', head: true });
    const invoiceNumber = `RE-${new Date().getFullYear()}-${String((count ?? 0) + 1).padStart(3, '0')}`;
    const invoiceResult = await supabase.from('admin_invoices').insert({
      invoice_number: invoiceNumber, customer_id: quote.customer_id, quote_id: quote.id, status: 'entwurf',
      issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      subtotal: quote.subtotal, tax_rate: quote.tax_rate, tax_amount: quote.tax_amount, total: quote.total, notes: quote.notes,
    }).select('id').maybeSingle();
    if (invoiceResult.error || !invoiceResult.data) { setError('Die Rechnung konnte nicht aus der Offerte erstellt werden.'); setConverting(null); return; }
    const itemsResult = await supabase.from('admin_invoice_items').insert((quote.items ?? []).map(item => ({ invoice_id: invoiceResult.data.id, description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    if (itemsResult.error) setError('Die Rechnung wurde angelegt, aber die Positionen konnten nicht übernommen werden.');
    else setError('');
    setConverting(null);
  };

  return <div>
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div><h2 className="text-xl font-bold text-white">Offerten</h2><p className="mt-1 text-sm text-slate-400">Erstellen, verwalten und angenommene Offerten in Rechnungen umwandeln.</p></div>
      <div className="flex gap-2"><button onClick={() => setCatalogOpen(value => !value)} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-xs font-mono text-slate-200 hover:border-cyan-400 hover:text-cyan-300"><FileText size={14} /> Leistungskatalog</button><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300"><Plus size={14} /> Neue Offerte</button></div>
    </div>

    {catalogOpen && <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold text-white">Leistungskatalog</h3><p className="mt-1 text-xs text-slate-400">Positionen später mit einem Klick in Offerten übernehmen.</p></div><button onClick={() => setCatalogOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button></div><div className="grid gap-2 md:grid-cols-[1.2fr_1.4fr_1fr_120px_auto]"><input className={INPUT} placeholder="Leistung" value={catalogForm.name} onChange={event => setCatalogForm({ ...catalogForm, name: event.target.value })} /><input className={INPUT} placeholder="Beschreibung" value={catalogForm.description} onChange={event => setCatalogForm({ ...catalogForm, description: event.target.value })} /><input className={INPUT} placeholder="Kategorie" value={catalogForm.category} onChange={event => setCatalogForm({ ...catalogForm, category: event.target.value })} /><input className={INPUT} type="number" min="0" step="0.01" placeholder="CHF" value={catalogForm.unit_price} onChange={event => setCatalogForm({ ...catalogForm, unit_price: Number(event.target.value) || 0 })} /><button onClick={saveCatalogItem} className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold text-white hover:bg-slate-600">Speichern</button></div><div className="mt-4 grid gap-2 md:grid-cols-2">{catalog.map(item => <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"><div><span className="font-semibold text-white">{item.name}</span><span className="ml-2 text-xs text-slate-500">{item.category || 'Allgemein'}</span></div><span className="font-mono text-cyan-300">{formatCHF(Number(item.unit_price))}</span></div>)}</div></div>}

    <label className="relative mb-5 block max-w-xl"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input className={`${INPUT} pl-10`} placeholder="Offerte, Kunde oder Firma suchen" value={query} onChange={event => setQuery(event.target.value)} /></label>
    {error && <p className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
    {loading ? <p className="text-sm text-slate-400">Offerten werden geladen...</p> : filteredQuotes.length === 0 ? <div className="rounded-xl border border-slate-700 bg-slate-900 py-16 text-center text-sm text-slate-400">Noch keine Offerten vorhanden.</div> : <div className="grid gap-3">{filteredQuotes.map(quote => <article key={quote.id} className="rounded-xl border border-slate-700 bg-slate-900 p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><div className="flex flex-wrap items-center gap-3"><span className="font-mono text-cyan-300">{quote.quote_number}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[quote.status] ?? STATUS_STYLES.entwurf}`}>{STATUS_LABELS[quote.status] ?? quote.status}</span></div><h3 className="mt-2 font-semibold text-white">{quote.title}</h3><p className="mt-1 text-sm text-slate-400">{quote.admin_customers?.name}{quote.admin_customers?.company ? ` · ${quote.admin_customers.company}` : ''}</p></div><div className="text-left md:text-right"><p className="font-mono text-lg font-bold text-cyan-300">{formatCHF(Number(quote.total))}</p><p className="mt-1 text-xs text-slate-500">Gültig bis {new Date(quote.valid_until).toLocaleDateString('de-CH')}</p></div></div><div className="mt-4 flex flex-wrap gap-2 border-t border-slate-700 pt-4"><button onClick={() => openQuotePdf(quote)} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-200 hover:border-cyan-400 hover:text-cyan-300"><FileText size={13} /> PDF</button><button onClick={() => openEdit(quote)} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-200 hover:border-cyan-400 hover:text-cyan-300"><Pencil size={13} /> Bearbeiten</button>{quote.status === 'angenommen' && <button onClick={() => convertToInvoice(quote)} disabled={converting === quote.id} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-60"><FileText size={13} /> {converting === quote.id ? 'Wird erstellt...' : 'Rechnung erstellen'}</button>}<button onClick={() => deleteQuote(quote.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-200 hover:bg-red-400/10"><Trash2 size={13} /> Löschen</button></div></article>)}</div>}

    {modal.open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"><div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><h3 className="text-xl font-bold text-white">{modal.id ? 'Offerte bearbeiten' : 'Neue Offerte'}</h3><p className="mt-1 text-xs text-slate-400">Positionen, Konditionen und Gültigkeit festlegen.</p></div><button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button></div><div className="grid gap-4 md:grid-cols-2"><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Kunde *</label><select className={INPUT} value={modal.form.customer_id} onChange={event => updateForm('customer_id', event.target.value)}><option value="">Bitte wählen...</option>{customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}{customer.company ? ` – ${customer.company}` : ''}</option>)}</select></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Betreff *</label><input className={INPUT} value={modal.form.title} onChange={event => updateForm('title', event.target.value)} placeholder="z. B. Website-Relaunch" /></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label><select className={INPUT} value={modal.form.status} onChange={event => updateForm('status', event.target.value)}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Gültig bis</label><input className={INPUT} type="date" value={modal.form.valid_until} onChange={event => updateForm('valid_until', event.target.value)} /></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Zahlungsbedingungen</label><select className={INPUT} value={modal.form.payment_terms} onChange={event => updateForm('payment_terms', event.target.value)}><option>30 Tage netto</option><option>50% bei Auftrag / 50% bei Abschluss</option><option>75% bei Auftrag / 25% bei Abschluss</option><option>Nach Aufwand</option></select></div><div className="grid grid-cols-2 gap-3"><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Rabatt %</label><input className={INPUT} type="number" min="0" max="100" step="0.1" value={modal.form.discount} onChange={event => updateForm('discount', Number(event.target.value) || 0)} /></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">MwSt. %</label><input className={INPUT} type="number" min="0" step="0.1" value={modal.form.tax_rate} onChange={event => updateForm('tax_rate', Number(event.target.value) || 0)} /></div></div></div><div className="mt-7"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Positionen</label><div className="flex flex-wrap gap-2">{catalog.map(item => <button key={item.id} onClick={() => addCatalogItem(item)} className="inline-flex items-center gap-1 rounded-md border border-cyan-400/20 px-2 py-1 text-xs text-cyan-300 hover:bg-cyan-400/10"><Plus size={11} /> {item.name}</button>)}<button onClick={() => updateForm('items', [...modal.form.items, blankItem()])} className="inline-flex items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:border-cyan-400"><Plus size={11} /> Manuell</button></div></div><div className="space-y-3">{modal.form.items.map((item, index) => <div key={item.id} className="rounded-xl border border-slate-700 bg-slate-950 p-3"><div className="grid gap-2 md:grid-cols-[1fr_110px_130px_32px]"><input className={INPUT} placeholder="Bezeichnung" value={item.description} onChange={event => updateItem(index, 'description', event.target.value)} /><input className={INPUT} type="number" min="0" step="0.5" value={item.quantity} onChange={event => updateItem(index, 'quantity', Number(event.target.value) || 0)} /><input className={INPUT} type="number" min="0" step="0.01" value={item.unit_price} onChange={event => updateItem(index, 'unit_price', Number(event.target.value) || 0)} /><button onClick={() => updateForm('items', modal.form.items.filter((_, i) => i !== index))} disabled={modal.form.items.length === 1} className="flex h-10 items-center justify-center text-slate-500 hover:text-red-300 disabled:opacity-30"><Trash2 size={15} /></button></div><textarea className={`${INPUT} mt-2 resize-none`} rows={2} placeholder="Beschreibung / Leistungsumfang" value={item.note} onChange={event => updateItem(index, 'note', event.target.value)} /></div>)}</div></div><div className="mt-5 flex justify-end"><div className="w-full max-w-xs space-y-2 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm"><div className="flex justify-between text-slate-400"><span>Zwischensumme</span><span>{formatCHF(quoteTotals.subtotal)}</span></div><div className="flex justify-between text-slate-400"><span>Rabatt</span><span>- {formatCHF(quoteTotals.discountAmount)}</span></div><div className="flex justify-between text-slate-400"><span>MwSt. {modal.form.tax_rate}%</span><span>{formatCHF(quoteTotals.taxAmount)}</span></div><div className="flex justify-between border-t border-slate-700 pt-2 font-bold text-white"><span>Gesamt</span><span className="text-cyan-300">{formatCHF(quoteTotals.total)}</span></div></div></div><textarea className={`${INPUT} mt-5 resize-none`} rows={3} placeholder="Bemerkungen" value={modal.form.notes} onChange={event => updateForm('notes', event.target.value)} /><div className="mt-6 flex gap-3"><button onClick={closeModal} className="flex-1 rounded-lg border border-slate-600 py-3 text-sm text-slate-300 hover:border-slate-400">Abbrechen</button><button onClick={saveQuote} disabled={saving || !modal.form.customer_id || !modal.form.title.trim()} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"><Check size={16} /> {saving ? 'Speichern...' : 'Offerte speichern'}</button></div></div></div>}
  </div>;
}
