import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ExternalLink, Mail, MessageSquare, Plus, RefreshCw, Search, UserRound, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeadRecord {
  id: string;
  source: 'kontakt';
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  origin: string;
  createdAt: string;
  status: string;
  notes: string;
}

interface CvRecord {
  id: string;
  source: 'cv';
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  origin: string;
  createdAt: string;
  status: string;
  notes: string;
  details: Record<string, string>;
  files: { slot: string; name: string; path: string; size: number }[];
}

type CrmRecord = LeadRecord | CvRecord;

type ManualLeadForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  notes: string;
};

const EMPTY_MANUAL_LEAD: ManualLeadForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  notes: '',
};

const STATUS_OPTIONS = ['neu', 'in_bearbeitung', 'qualifiziert', 'gewonnen', 'abgeschlossen', 'verloren'];
const statusLabels: Record<string, string> = {
  neu: 'Neu',
  in_bearbeitung: 'In Bearbeitung',
  qualifiziert: 'Qualifiziert',
  gewonnen: 'Gewonnen',
  abgeschlossen: 'Abgeschlossen',
  verloren: 'Verloren',
};
const statusStyles: Record<string, string> = {
  neu: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  in_bearbeitung: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  qualifiziert: 'border-blue-400/30 bg-blue-400/10 text-blue-200',
  gewonnen: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  abgeschlossen: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  verloren: 'border-red-400/30 bg-red-400/10 text-red-200',
};

function normalizeFiles(value: unknown): CvRecord['files'] {
  if (!Array.isArray(value)) return [];
  return value.filter((file): file is CvRecord['files'][number] => (
    typeof file === 'object' && file !== null &&
    typeof (file as { path?: unknown }).path === 'string' &&
    typeof (file as { name?: unknown }).name === 'string'
  ));
}

export default function Crm() {
  const [records, setRecords] = useState<CrmRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'alle' | 'kontakt' | 'cv'>('alle');
  const [selected, setSelected] = useState<CrmRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [customerSaved, setCustomerSaved] = useState(false);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState<ManualLeadForm>({ ...EMPTY_MANUAL_LEAD });

  const load = async () => {
    setLoading(true);
    setError('');
    const [{ data: leads, error: leadsError }, { data: cvRequests, error: cvError }] = await Promise.all([
      supabase.from('admin_leads').select('*').order('erstellt_am', { ascending: false }),
      supabase.from('admin_cv_requests').select('*').order('erstellt_am', { ascending: false }),
    ]);

    if (leadsError || cvError) {
      setError('Die CRM-Einträge konnten nicht geladen werden.');
      setLoading(false);
      return;
    }

    const contactRecords: LeadRecord[] = (leads ?? []).map(lead => ({
      id: lead.id,
      source: 'kontakt',
      name: lead.name,
      company: lead.firma,
      email: lead.email,
      phone: lead.telefon,
      service: lead.leistung,
      message: lead.nachricht,
      origin: lead.quelle,
      createdAt: lead.erstellt_am,
      status: lead.status,
      notes: lead.notizen,
    }));
    const cvRecords: CvRecord[] = (cvRequests ?? []).map(request => ({
      id: request.id,
      source: 'cv',
      name: `${request.vorname} ${request.nachname}`.trim(),
      company: request.beruf,
      email: request.email,
      phone: request.telefon,
      service: `Online-CV · ${request.paket === 'student' ? 'CHF 290' : 'CHF 490'}`,
      message: request.bemerkung,
      origin: 'online-cv',
      createdAt: request.erstellt_am,
      status: request.status,
      notes: '',
      details: {
        Zielposition: request.zielposition,
        Sprache: request.sprache,
        Design: request.design,
        Akzentfarbe: request.akzentfarbe,
        Wunschdomain: request.wunschdomain,
        Alternative: request.domain_alt,
        LinkedIn: request.linkedin,
      },
      files: normalizeFiles(request.dateien),
    }));

    setRecords([...contactRecords, ...cvRecords].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return records.filter(record => {
      const matchesSource = sourceFilter === 'alle' || record.source === sourceFilter;
      const matchesQuery = !normalizedQuery || [record.name, record.company, record.email, record.service, record.message]
        .join(' ').toLowerCase().includes(normalizedQuery);
      return matchesSource && matchesQuery;
    });
  }, [query, records, sourceFilter]);

  const updateStatus = async (record: CrmRecord, status: string) => {
    setSaving(true);
    const table = record.source === 'kontakt' ? 'admin_leads' : 'admin_cv_requests';
    const { error: updateError } = await supabase.from(table).update({ status }).eq('id', record.id);
    if (updateError) {
      setError('Der Status konnte nicht gespeichert werden.');
    } else {
      const updated = { ...record, status } as CrmRecord;
      setRecords(current => current.map(item => item.id === record.id && item.source === record.source ? updated : item));
      setSelected(updated);
    }
    setSaving(false);
  };

  const createLead = async () => {
    if (!newLead.name.trim() || !newLead.email.trim()) {
      setError('Bitte mindestens Name und E-Mail ausfüllen.');
      return;
    }

    setSaving(true);
    setError('');
    const { error: insertError } = await supabase.from('admin_leads').insert({
      name: newLead.name.trim(),
      firma: newLead.company.trim(),
      email: newLead.email.trim(),
      telefon: newLead.phone.trim(),
      leistung: newLead.service.trim(),
      nachricht: newLead.message.trim(),
      quelle: 'manuell',
      notizen: newLead.notes.trim(),
      status: 'neu',
    });

    if (insertError) {
      setError('Der neue Lead konnte nicht gespeichert werden.');
      setSaving(false);
      return;
    }

    setNewLead({ ...EMPTY_MANUAL_LEAD });
    setNewLeadOpen(false);
    setSaving(false);
    await load();
  };

  const saveAsCustomer = async (record: CrmRecord) => {
    setSaving(true);
    setCustomerSaved(false);
    const { error: insertError } = await supabase.from('admin_customers').insert({
      name: record.name,
      company: record.company,
      email: record.email,
      phone: record.phone,
      notes: record.source === 'cv' ? `Online-CV Anfrage. ${record.message}` : record.message,
    });
    if (insertError) {
      setError('Der Kontakt konnte nicht als Kunde gespeichert werden.');
    } else {
      setCustomerSaved(true);
      if (record.source === 'kontakt') {
        const { error: statusError } = await supabase.from('admin_leads').update({ status: 'gewonnen' }).eq('id', record.id);
        if (statusError) {
          setError('Der Kunde wurde angelegt, aber der Lead-Status konnte nicht aktualisiert werden.');
        } else {
          const updated = { ...record, status: 'gewonnen' } as CrmRecord;
          setRecords(current => current.map(item => item.id === record.id && item.source === record.source ? updated : item));
          setSelected(updated);
        }
      }
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">CRM</h2>
          <p className="mt-1 text-sm text-slate-400">Alle Kontakt- und CV-Anfragen an einem Ort.</p>
        </div>
        <div className="flex flex-wrap gap-2 self-start lg:self-auto">
          <button onClick={() => { setError(''); setNewLeadOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan-300"><Plus size={13} /> Neuer Lead</button>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-200 transition-colors hover:border-cyan-400 hover:text-cyan-300"><RefreshCw size={13} /> Aktualisieren</button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="relative block"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, E-Mail, Firma oder Leistung suchen" className="w-full rounded-lg border border-slate-600 bg-slate-900 px-10 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" /></label>
        <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1">
          {(['alle', 'kontakt', 'cv'] as const).map(filter => <button key={filter} onClick={() => setSourceFilter(filter)} className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${sourceFilter === filter ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>{filter === 'alle' ? 'Alle' : filter === 'kontakt' ? 'Kontakt' : 'Online-CV'}</button>)}
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      {loading ? <p className="text-sm text-slate-400">CRM wird geladen...</p> : filtered.length === 0 ? <div className="rounded-xl border border-slate-700 bg-slate-900 py-16 text-center text-sm text-slate-400">Keine passenden Einträge vorhanden.</div> : (
        <div className="grid gap-3">
          {filtered.map(record => <button key={`${record.source}-${record.id}`} onClick={() => { setSelected(record); setCustomerSaved(false); }} className="group w-full rounded-xl border border-slate-700 bg-slate-900 p-5 text-left transition-colors hover:border-cyan-400/60 hover:bg-slate-800/80">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div className="flex min-w-0 items-start gap-3"><div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${record.source === 'cv' ? 'bg-blue-400/15 text-blue-300' : 'bg-cyan-400/15 text-cyan-300'}`}>{record.source === 'cv' ? <UserRound size={16} /> : <MessageSquare size={16} />}</div><div className="min-w-0"><p className="truncate font-semibold text-white">{record.name}</p><p className="mt-1 truncate text-sm text-slate-300">{record.company || record.email}</p></div></div>
              <span className={`self-start rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status] ?? statusStyles.neu}`}>{statusLabels[record.status] ?? record.status}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-700 pt-3 text-xs text-slate-400"><span>{record.service || 'Allgemeine Anfrage'}</span><span>{new Date(record.createdAt).toLocaleDateString('de-CH')}</span><span className="text-cyan-300 group-hover:text-cyan-200">Details öffnen</span></div>
          </button>)}
        </div>
      )}

      {newLeadOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Neuen Lead erfassen">
        <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><p className="font-mono text-xs uppercase tracking-widest text-cyan-300">CRM</p><h3 className="mt-2 text-2xl font-bold text-white">Neuen Lead erfassen</h3><p className="mt-1 text-sm text-slate-400">Lege einen Kontakt manuell in deiner Pipeline an.</p></div>
            <button onClick={() => setNewLeadOpen(false)} className="rounded-lg border border-slate-600 p-2 text-slate-300 hover:border-cyan-400 hover:text-white" aria-label="Dialog schliessen"><X size={18} /></button>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Name *</span><input value={newLead.name} onChange={e => setNewLead(current => ({ ...current, name: e.target.value }))} autoFocus className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" placeholder="Vor- und Nachname" /></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Firma</span><input value={newLead.company} onChange={e => setNewLead(current => ({ ...current, company: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" placeholder="Unternehmen" /></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">E-Mail *</span><input type="email" value={newLead.email} onChange={e => setNewLead(current => ({ ...current, email: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" placeholder="name@firma.ch" /></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Telefon</span><input type="tel" value={newLead.phone} onChange={e => setNewLead(current => ({ ...current, phone: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" placeholder="+41 ..." /></label>
            <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Interessiert an</span><input value={newLead.service} onChange={e => setNewLead(current => ({ ...current, service: e.target.value }))} className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" placeholder="z. B. Webdesign oder Automatisierung" /></label>
            <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Nachricht</span><textarea value={newLead.message} onChange={e => setNewLead(current => ({ ...current, message: e.target.value }))} rows={4} className="w-full resize-y rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm leading-6 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" placeholder="Worum geht es bei der Anfrage?" /></label>
            <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Interne Notizen</span><textarea value={newLead.notes} onChange={e => setNewLead(current => ({ ...current, notes: e.target.value }))} rows={3} className="w-full resize-y rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm leading-6 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" placeholder="Nur für die interne Bearbeitung" /></label>
          </div>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={() => setNewLeadOpen(false)} className="rounded-lg border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-slate-400">Abbrechen</button><button onClick={createLead} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"><Plus size={16} />{saving ? 'Wird gespeichert...' : 'Lead speichern'}</button></div>
        </div>
      </div>}

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="CRM-Details">
        <div className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-cyan-300">{selected.source === 'cv' ? 'Online-CV Anfrage' : 'Kontaktanfrage'}</p><h3 className="mt-2 text-2xl font-bold text-white">{selected.name}</h3></div><button onClick={() => setSelected(null)} className="rounded-lg border border-slate-600 p-2 text-slate-300 hover:border-cyan-400 hover:text-white" aria-label="Details schliessen"><X size={18} /></button></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><a href={`mailto:${selected.email}`} className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-cyan-300 hover:border-cyan-400"><Mail size={15} className="mb-2" />{selected.email}</a><div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200"><p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Telefon</p>{selected.phone || 'Nicht angegeben'}</div><div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200"><p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Firma / Beruf</p>{selected.company || 'Nicht angegeben'}</div><div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200"><p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Leistung</p>{selected.service || 'Allgemein'}</div></div>
          <div className="mt-6"><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label><div className="relative"><select value={selected.status} onChange={e => updateStatus(selected, e.target.value)} disabled={saving} className="w-full appearance-none rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none">{STATUS_OPTIONS.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /></div></div>
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Nachricht</p><p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{selected.message || 'Keine Nachricht hinterlassen.'}</p></div>
          {selected.source === 'cv' && <div className="mt-4 space-y-3"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">CV-Angaben</p>{Object.entries(selected.details).filter(([, value]) => value).map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-slate-800 py-2 text-sm"><span className="text-slate-400">{label}</span><span className="text-right text-slate-100">{value}</span></div>)}{selected.files.length > 0 && <div className="pt-2"><p className="mb-2 text-xs text-slate-500">Dokumente über den Bereich „CV-Anfragen“ öffnen.</p></div>}</div>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={() => saveAsCustomer(selected)} disabled={saving || customerSaved} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60">{customerSaved ? <Check size={16} /> : <Plus size={16} />}{customerSaved ? 'Kunde erstellt' : 'In Kunden umwandeln'}</button><a href={`mailto:${selected.email}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-cyan-400 hover:text-cyan-300"><ExternalLink size={15} /> E-Mail schreiben</a></div>
        </div>
      </div>}
    </div>
  );
}
