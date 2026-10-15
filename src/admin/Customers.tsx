import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer } from './types';
import { Plus, Pencil, Trash2, X, Check, User, Building, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const empty: Omit<Customer, 'id' | 'created_at'> = {
  name: '', company: '', email: '', phone: '', address: '', street: '', house_number: '', postal_code: '', town: '', country: 'CH', notes: '',
};

const COUNTRIES = [
  ['CH', 'Schweiz'], ['LI', 'Liechtenstein'], ['DE', 'Deutschland'], ['AT', 'Österreich'], ['FR', 'Frankreich'], ['IT', 'Italien'],
] as const;

const INPUT = 'w-full bg-[#12122a] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/40 transition-colors';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; data: Omit<Customer, 'id' | 'created_at'>; id?: string }>({
    open: false, data: { ...empty },
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_customers').select('*').order('created_at', { ascending: false });
    setCustomers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setFormError(''); setModal({ open: true, data: { ...empty } }); };
  const openEdit = (c: Customer) => {
    setFormError('');
    setModal({ open: true, data: { name: c.name, company: c.company, email: c.email, phone: c.phone, address: c.address, street: c.street, house_number: c.house_number, postal_code: c.postal_code, town: c.town, country: c.country || 'CH', notes: c.notes }, id: c.id });
  };
  const closeModal = () => { setFormError(''); setModal({ open: false, data: { ...empty } }); };

  const suggestStructuredAddress = () => {
    const parts = modal.data.address.split(/[\n,]+/).map(part => part.trim()).filter(Boolean);
    const postalIndex = parts.findIndex(part => /^(\d{4,5})\s+(.+)$/.test(part));
    const postalMatch = postalIndex >= 0 ? parts[postalIndex].match(/^(\d{4,5})\s+(.+)$/) : null;
    const streetPart = parts.find(part => /^Postfach\s+\d+/i.test(part)) ?? parts.find(part => /^(.+?)\s+\d+[a-zA-Z]?(?:[-\/]\d+[a-zA-Z]?)?$/.test(part));
    const streetMatch = streetPart && !/^Postfach\s+\d+/i.test(streetPart) ? streetPart.match(/^(.+?)\s+(\d+[a-zA-Z]?(?:[-\/]\d+[a-zA-Z]?)?)$/) : null;
    setModal(current => ({ ...current, data: {
      ...current.data,
      street: streetPart && /^Postfach\s+\d+/i.test(streetPart) ? streetPart : streetMatch?.[1] ?? current.data.street,
      house_number: streetMatch?.[2] ?? (streetPart && /^Postfach\s+\d+/i.test(streetPart) ? '' : current.data.house_number),
      postal_code: postalMatch?.[1] ?? current.data.postal_code,
      town: postalMatch?.[2] ?? current.data.town,
    } }));
    setFormError(postalMatch || streetPart ? 'Adresse vorgeschlagen. Bitte prüfen und speichern.' : 'Die Freitext-Adresse konnte nicht automatisch erkannt werden.');
  };

  const save = async () => {
    if (modal.data.street && (!modal.data.postal_code || !modal.data.town)) {
      setFormError('Wenn eine Strasse eingetragen ist, müssen PLZ und Ort ebenfalls ausgefüllt sein.');
      return;
    }
    setSaving(true);
    if (modal.id) {
      await supabase.from('admin_customers').update(modal.data).eq('id', modal.id);
    } else {
      await supabase.from('admin_customers').insert(modal.data);
    }
    setSaving(false);
    closeModal();
    load();
  };

  const del = async (id: string) => {
    await supabase.from('admin_customers').delete().eq('id', id);
    setDeleteId(null);
    load();
  };

  const field = (key: keyof typeof empty, label: string, icon: React.ReactNode, type = 'text') => (
    <div>
      <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">{icon}</span>
        <input
          type={type}
          value={modal.data[key]}
          onChange={e => setModal(m => ({ ...m, data: { ...m.data, [key]: e.target.value } }))}
          className={`${INPUT} pl-9`}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Kunden</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-[#05050f] font-mono font-bold text-xs rounded-lg hover:bg-cyan-300 transition-colors">
          <Plus size={14} /> Neuer Kunde
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 font-mono text-sm">Laden...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 text-white/20 font-mono text-sm">Noch keine Kunden vorhanden.</div>
      ) : (
        <div className="grid gap-3">
          {customers.map(c => (
            <div key={c.id} className="bg-[#0f0f1a] border border-white/8 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-white/14 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-cyan-400/8 border border-cyan-400/15 flex items-center justify-center shrink-0">
                  <User size={14} className="text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{c.name}</p>
                  <p className="text-white/35 text-xs font-mono truncate">{c.company || c.email}</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs text-white/30 font-mono">
                {c.email && <span>{c.email}</span>}
                {c.phone && <span>{c.phone}</span>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteId(c.id)} className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-white/35 hover:text-red-400 hover:border-red-400/30 transition-colors">
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
              <h3 className="font-bold text-white">{modal.id ? 'Kunde bearbeiten' : 'Neuer Kunde'}</h3>
              <button onClick={closeModal} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {formError && <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">{formError}</p>}
              {field('name', 'Name', <User size={13} />)}
              {field('company', 'Firma', <Building size={13} />)}
              {field('email', 'E-Mail', <Mail size={13} />, 'email')}
              {field('phone', 'Telefon', <Phone size={13} />)}
              {field('address', 'Adresse (Freitext)', <MapPin size={13} />)}
              <button type="button" onClick={suggestStructuredAddress} className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
                <Sparkles size={13} /> Adresse aus Freitext übernehmen
              </button>
              <div className="grid grid-cols-[1fr_110px] gap-3">
                {field('street', 'Strasse / Postfach', <MapPin size={13} />)}
                {field('house_number', 'Hausnummer', <MapPin size={13} />)}
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3">
                {field('postal_code', 'PLZ', <MapPin size={13} />)}
                {field('town', 'Ort', <MapPin size={13} />)}
              </div>
              <div>
                <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Land</label>
                <select value={modal.data.country} onChange={e => setModal(m => ({ ...m, data: { ...m.data, country: e.target.value } }))} className={INPUT}>
                  {COUNTRIES.map(([code, label]) => <option key={code} value={code}>{code} — {label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-white/35 mb-1.5 tracking-wider uppercase">Notizen</label>
                <textarea
                  value={modal.data.notes}
                  onChange={e => setModal(m => ({ ...m, data: { ...m.data, notes: e.target.value } }))}
                  rows={3}
                  className={`${INPUT} resize-none`}
                />
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
            <h3 className="font-bold text-white mb-2">Kunde löschen?</h3>
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
