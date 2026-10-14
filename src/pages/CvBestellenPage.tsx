import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, UploadCloud, FileText, Globe, Image as ImageIcon, Loader2, Palette, ShieldCheck, Trash2, User } from 'lucide-react';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/public/Seo';
import Aurora from '../components/motion/Aurora';
import { supabase } from '../lib/supabase';

type Paket = 'standard' | 'student';
type Design = 'dunkel' | 'hell';
type Sprache = 'de' | 'en' | 'beide';

interface FileSlot { key: 'cv' | 'foto' | 'zeugnisse' | 'ausweis'; label: string; hint: string; accept: string; multiple?: boolean; required?: boolean; icon: typeof FileText }

const slots: FileSlot[] = [
  { key: 'cv', label: 'Aktueller Lebenslauf', hint: 'PDF oder Word, max. 15 MB', accept: '.pdf,.doc,.docx', required: true, icon: FileText },
  { key: 'foto', label: 'Portraitfoto', hint: 'JPG oder PNG, gern in hoher Auflösung', accept: '.jpg,.jpeg,.png,.webp', icon: ImageIcon },
  { key: 'zeugnisse', label: 'Zeugnisse, Diplome, Zertifikate', hint: 'Mehrere Dateien möglich', accept: '.pdf,.jpg,.jpeg,.png', multiple: true, icon: ShieldCheck },
  { key: 'ausweis', label: 'Studierenden- oder Lernendenausweis', hint: 'Nur für das Paket CHF 290', accept: '.pdf,.jpg,.jpeg,.png', icon: ShieldCheck },
];

const accents = [
  { name: 'Türkis', hex: '#2DD4BF' }, { name: 'Blau', hex: '#3B82F6' }, { name: 'Gelb', hex: '#EAB308' },
  { name: 'Grün', hex: '#22C55E' }, { name: 'Orange', hex: '#F97316' }, { name: 'Rot', hex: '#EF4444' },
];

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

const inputCls = 'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[#E5E7EB] outline-none transition-colors placeholder:text-[#4B5563] focus:border-[#2DD4BF]/70 focus:bg-white/[0.05]';
const labelCls = 'mb-1.5 block text-sm font-medium text-[#A8B1C2]';

export default function CvBestellenPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    vorname: '', nachname: '', email: '', telefon: '', beruf: '', zielposition: '', linkedin: '', bemerkung: '',
    sprache: 'de' as Sprache, design: 'dunkel' as Design, akzent: '#2DD4BF', paket: 'standard' as Paket, domain: '', domainAlt: '',
  });
  const [files, setFiles] = useState<Record<string, File[]>>({ cv: [], foto: [], zeugnisse: [], ausweis: [] });
  const [datenschutz, setDatenschutz] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const suggestedDomain = useMemo(() => {
    const s = slugify(`${form.vorname} ${form.nachname}`);
    return s ? `${s}.ch` : '';
  }, [form.vorname, form.nachname]);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onFiles = (key: string, multiple?: boolean) => (e: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    const tooBig = list.find(f => f.size > 15 * 1024 * 1024);
    if (tooBig) { setError(`${tooBig.name} ist grösser als 15 MB.`); return; }
    const invalidType = list.find(f => !allowedMimeTypes.has(f.type));
    if (invalidType) { setError(`${invalidType.name} hat kein unterstütztes Dateiformat.`); return; }
    setError('');
    setFiles(f => ({ ...f, [key]: multiple ? [...f[key], ...list] : list.slice(0, 1) }));
    e.target.value = '';
  };
  const removeFile = (key: string, i: number) => setFiles(f => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const validStep0 = form.vorname && form.nachname && /\S+@\S+\.\S+/.test(form.email) && form.beruf;
  const validStep1 = form.domain || suggestedDomain;
  const validStep2 = files.cv.length > 0 && datenschutz && (form.paket !== 'student' || files.ausweis.length > 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot || !validStep2) return;
    setSubmitting(true); setError('');
    const id = crypto.randomUUID();
    const uploaded: { slot: string; name: string; path: string; size: number }[] = [];
    try {
      const all = Object.entries(files).flatMap(([slot, fs]) => fs.map(f => ({ slot, f })));
      for (let i = 0; i < all.length; i++) {
        const { slot, f } = all[i];
        setProgress(`Lade ${f.name} hoch (${i + 1}/${all.length})`);
        const extension = f.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
        const path = `${id}/${slot}/${Date.now()}-${slugify(f.name.replace(/\.[^.]+$/, ''))}.${extension}`;
        const { error: upErr } = await supabase.storage.from('cv-uploads').upload(path, f, { upsert: false });
        if (upErr) throw new Error('Upload fehlgeschlagen');
        uploaded.push({ slot, name: f.name, path, size: f.size });
      }
      setProgress('Speichere Bestellung');
      const domain = form.domain || suggestedDomain;
      const { error: dbErr } = await supabase.from('admin_cv_requests').insert({
        id, vorname: form.vorname, nachname: form.nachname, email: form.email, telefon: form.telefon, beruf: form.beruf,
        zielposition: form.zielposition, sprache: form.sprache, design: form.design, akzentfarbe: form.akzent,
        wunschdomain: domain, domain_alt: form.domainAlt, paket: form.paket, linkedin: form.linkedin, bemerkung: form.bemerkung, dateien: uploaded,
      });
      if (dbErr) throw new Error('Anfrage konnte nicht gespeichert werden');
      const key = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
      if (key) {
        try {
          await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            access_key: key, subject: `Online-CV Anfrage: ${form.vorname} ${form.nachname} (${form.paket === 'student' ? 'CHF 290' : 'CHF 490'})`,
            from_name: 'morawebsoft.com CV-Formular', name: `${form.vorname} ${form.nachname}`, email: form.email, telefon: form.telefon,
            beruf: form.beruf, zielposition: form.zielposition, sprache: form.sprache, design: form.design, akzent: form.akzent, domain, domain_alt: form.domainAlt,
            linkedin: form.linkedin, bemerkung: form.bemerkung, dateien: uploaded.map(u => `${u.slot}: ${u.name}`).join(', '), bestell_id: id,
          }) });
        } catch { /* Mail ist optional */ }
      }
      navigate('/danke?cv=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Die Anfrage konnte nicht gesendet werden. Bitte nochmals versuchen.');
      setSubmitting(false); setProgress('');
    }
  }

  const steps = [
    { title: 'Über Sie', icon: User },
    { title: 'Design & Domain', icon: Palette },
    { title: 'Dokumente', icon: UploadCloud },
  ];

  return (
    <>
      <Seo title="Online-CV anfragen | Digitales CV in 5 Tagen | Morawebsoft" description="Senden Sie Ihre Anfrage für einen Online-Lebenslauf: Angaben, Wunschdomain, Design und Dokumente in 10 Minuten. CHF 490, Studierende CHF 290." path="/online-cv/bestellen" />
      <section data-no-reveal className="noise relative isolate -mt-20 overflow-hidden pt-32 sm:-mt-24 sm:pt-36">
        <Aurora density={35} />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-10 sm:px-8">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Online-CV anfragen</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">In 10 Minuten angefragt, in 5 Arbeitstagen erhalten Sie den ersten Entwurf.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#A8B1C2]">Drei Schritte: Wer Sie sind, wie es aussehen soll und welche Unterlagen ich bekomme. Danach melde ich mich innert 24 Stunden mit dem nächsten Schritt.</p>
        </div>
      </section>

      <section data-no-reveal className="relative pb-24">
        <div className="mx-auto grid max-w-[1100px] gap-8 px-6 sm:px-8 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-[#0c1220]/80 p-6 backdrop-blur sm:p-8">
            <ol className="mb-8 grid grid-cols-3 gap-2">
              {steps.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-2">
                  <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-[#2DD4BF]' : 'bg-white/10'}`} />
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${i === step ? 'text-white' : 'text-[#6B7280]'}`}><s.icon size={13} />{s.title}</span>
                </li>
              ))}
            </ol>

            <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="grid gap-5 sm:grid-cols-2">
                  <div><label className={labelCls}>Vorname *</label><input className={inputCls} value={form.vorname} onChange={set('vorname')} required /></div>
                  <div><label className={labelCls}>Nachname *</label><input className={inputCls} value={form.nachname} onChange={set('nachname')} required /></div>
                  <div><label className={labelCls}>E-Mail *</label><input type="email" className={inputCls} value={form.email} onChange={set('email')} required /></div>
                  <div><label className={labelCls}>Telefon</label><input type="tel" className={inputCls} value={form.telefon} onChange={set('telefon')} placeholder="076 …" /></div>
                  <div><label className={labelCls}>Aktueller Beruf / Titel *</label><input className={inputCls} value={form.beruf} onChange={set('beruf')} placeholder="z. B. Polymechaniker EFZ, Projektleiterin Marketing" required /></div>
                  <div><label className={labelCls}>Zielposition oder Branche</label><input className={inputCls} value={form.zielposition} onChange={set('zielposition')} placeholder="z. B. Teamleitung Logistik, Pflege, IT-Support" /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>LinkedIn-Profil (optional)</label><input type="url" className={inputCls} value={form.linkedin} onChange={set('linkedin')} placeholder="https://www.linkedin.com/in/…" /></div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Sprache des CV</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([['de', 'Deutsch'], ['en', 'Englisch'], ['beide', 'Beide']] as const).map(([v, l]) => (
                        <button type="button" key={v} onClick={() => setForm(f => ({ ...f, sprache: v }))} className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${form.sprache === v ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 text-white' : 'border-white/10 text-[#A8B1C2] hover:border-white/25'}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="grid gap-6">
                  <div>
                    <label className={labelCls}>Paket</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {([['standard', 'Digitales CV', 'CHF 490', 'Eigene Domain, 1 Jahr Hosting, PDF-Export, 1 Korrekturrunde'], ['student', 'Lernende & Studierende', 'CHF 290', 'Gleicher Umfang, Ausweis im Schritt 3 hochladen']] as const).map(([v, t, p, d]) => (
                        <button type="button" key={v} onClick={() => setForm(f => ({ ...f, paket: v }))} className={`rounded-2xl border p-4 text-left transition-colors ${form.paket === v ? 'border-[#2DD4BF] bg-[#2DD4BF]/10' : 'border-white/10 hover:border-white/25'}`}>
                          <div className="flex items-center justify-between"><span className="font-semibold text-white">{t}</span><span className="font-mono text-[#2DD4BF]">{p}</span></div>
                          <p className="mt-1 text-xs text-[#9CA3AF]">{d}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Design</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {([['dunkel', 'Dunkel', 'bg-[#0B0F1A]', 'text-white'], ['hell', 'Hell', 'bg-[#F8FAFC]', 'text-[#111827]']] as const).map(([v, t, bg, tx]) => (
                        <button type="button" key={v} onClick={() => setForm(f => ({ ...f, design: v }))} className={`overflow-hidden rounded-2xl border transition-colors ${form.design === v ? 'border-[#2DD4BF]' : 'border-white/10 hover:border-white/25'}`}>
                          <div className={`${bg} ${tx} p-4`}>
                            <div className="h-2 w-16 rounded" style={{ background: form.akzent }} />
                            <div className="mt-3 h-3 w-32 rounded bg-current opacity-80" />
                            <div className="mt-2 h-2 w-40 rounded bg-current opacity-30" />
                            <div className="mt-1 h-2 w-28 rounded bg-current opacity-30" />
                          </div>
                          <div className="px-4 py-2 text-sm font-medium text-[#E5E7EB]">{t}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Akzentfarbe</label>
                    <div className="flex flex-wrap gap-2">
                      {accents.map(a => (
                        <button type="button" key={a.hex} title={a.name} onClick={() => setForm(f => ({ ...f, akzent: a.hex }))} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${form.akzent === a.hex ? 'border-white' : 'border-transparent'}`} style={{ background: a.hex }}>
                          {form.akzent === a.hex && <Check size={16} className="text-[#06101A]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Wunschdomain *</label>
                      <div className="relative"><Globe size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2DD4BF]" /><input className={`${inputCls} pl-11`} value={form.domain} onChange={set('domain')} placeholder={suggestedDomain || 'vorname-nachname.ch'} /></div>
                      <p className="mt-1.5 text-xs text-[#6B7280]">Vorschlag: <button type="button" className="text-[#2DD4BF] underline-offset-2 hover:underline" onClick={() => setForm(f => ({ ...f, domain: suggestedDomain }))}>{suggestedDomain || '–'}</button>. Ich prüfe die Verfügbarkeit und registriere die Domain auf Ihren Namen.</p>
                    </div>
                    <div>
                      <label className={labelCls}>Alternative, falls vergeben</label>
                      <input className={inputCls} value={form.domainAlt} onChange={set('domainAlt')} placeholder="z. B. vorname-nachname.swiss oder .com" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="grid gap-5">
                  {slots.filter(s => s.key !== 'ausweis' || form.paket === 'student').map(s => (
                    <div key={s.key} className="rounded-2xl border border-dashed border-white/15 p-4 transition-colors hover:border-[#2DD4BF]/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]"><s.icon size={18} /></div>
                          <div><p className="text-sm font-semibold text-white">{s.label}{(s.required || (s.key === 'ausweis')) && ' *'}</p><p className="text-xs text-[#6B7280]">{s.hint}</p></div>
                        </div>
                        <label className="shrink-0 cursor-pointer rounded-full border border-[#2DD4BF]/50 px-4 py-2 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF] hover:text-[#06101A]">
                          Datei wählen<input type="file" className="hidden" accept={s.accept} multiple={s.multiple} onChange={onFiles(s.key, s.multiple)} />
                        </label>
                      </div>
                      {files[s.key].length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {files[s.key].map((f, i) => (
                            <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-[#E5E7EB]">
                              <span className="truncate">{f.name} <span className="text-[#6B7280]">({(f.size / 1024 / 1024).toFixed(1)} MB)</span></span>
                              <button type="button" onClick={() => removeFile(s.key, i)} className="ml-3 text-[#9CA3AF] hover:text-red-400" aria-label="Entfernen"><Trash2 size={14} /></button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  <div><label className={labelCls}>Besondere Wünsche</label><textarea rows={4} className={inputCls} value={form.bemerkung} onChange={set('bemerkung')} placeholder="Projekte, die hervorgehoben werden sollen, Vorbilder, was auf keinen Fall drauf soll …" /></div>
                  <label className="flex items-start gap-3 text-sm text-[#A8B1C2]">
                    <input type="checkbox" checked={datenschutz} onChange={e => setDatenschutz(e.target.checked)} className="mt-1 h-4 w-4 accent-[#2DD4BF]" />
                    <span>Ich habe die <Link to="/datenschutz" className="text-[#2DD4BF] underline-offset-2 hover:underline">Datenschutzerklärung</Link> gelesen. Meine Dokumente werden verschlüsselt gespeichert und nur für die Erstellung des CV verwendet. *</span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0 || submitting} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-[#E5E7EB] transition-colors hover:border-white/40 disabled:opacity-30"><ArrowLeft size={16} /> Zurück</button>
              {step < 2 ? (
                <button type="button" onClick={() => setStep(s => s + 1)} disabled={step === 0 ? !validStep0 : !validStep1} className="inline-flex items-center gap-2 rounded-full bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#06101A] transition-shadow hover:shadow-[0_0_30px_-6px_rgba(45,212,191,0.8)] disabled:opacity-40 disabled:hover:shadow-none">Weiter <ArrowRight size={16} /></button>
              ) : (
                <button type="submit" disabled={!validStep2 || submitting} className="inline-flex items-center gap-2 rounded-full bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#06101A] transition-shadow hover:shadow-[0_0_30px_-6px_rgba(45,212,191,0.8)] disabled:opacity-40">
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> {progress || 'Sende …'}</> : <>Anfrage senden <ArrowRight size={16} /></>}
                </button>
              )}
            </div>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2DD4BF]">Ihre Anfrage</p>
              <p className="mt-3 text-2xl font-extrabold text-white">{form.paket === 'student' ? 'CHF 290' : 'CHF 490'}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-[#A8B1C2]">
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#2DD4BF]" />Domain: <span className="text-white">{form.domain || suggestedDomain || '–'}</span></li>
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#2DD4BF]" />Design {form.design}, Akzent <span className="inline-block h-3 w-3 rounded-full align-middle" style={{ background: form.akzent }} /></li>
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#2DD4BF]" />Sprache: {form.sprache === 'beide' ? 'Deutsch & Englisch' : form.sprache === 'en' ? 'Englisch' : 'Deutsch'}</li>
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#2DD4BF]" />1 Jahr Hosting, PDF-Export, 1 Korrekturrunde</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-[#A8B1C2]">
              <p className="font-semibold text-white">So geht es weiter</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>Rückmeldung mit Offerte innert 24 h</li>
                <li>Entwurf nach 3 Arbeitstagen per Link</li>
                <li>Eine Korrekturrunde</li>
                <li>Online unter Ihrer Domain</li>
              </ol>
              <p className="mt-3 text-xs text-[#6B7280]">Zahlung per Rechnung oder Twint nach Erhalt des Entwurfs.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
