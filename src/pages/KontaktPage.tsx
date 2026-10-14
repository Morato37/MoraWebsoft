import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, ExternalLink, Linkedin, Mail, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Seo from '../components/public/Seo';
import { trackEvent } from '../lib/analytics';

const LEISTUNGEN = [
  'Webengineering',
  'Webdesign',
  'Automatisierung',
  'Schnittstellen',
  'Online-CV',
  'Weiss ich noch nicht',
] as const;

function MetaTags() { return null; }

export default function KontaktPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectLeistung = searchParams.get('leistung') ?? '';

  const [name, setName] = useState('');
  const [firma, setFirma] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [leistung, setLeistung] = useState(
    LEISTUNGEN.find(l => l.toLowerCase().replace(/[^a-z]/g, '-') === preselectLeistung) ?? ''
  );
  const [nachricht, setNachricht] = useState('');
  const [datenschutz, setDatenschutz] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [serviceOpen, setServiceOpen] = useState(false);

  useEffect(() => {
    if (preselectLeistung) {
      const match = LEISTUNGEN.find(
        l => l.toLowerCase() === preselectLeistung.replace(/-/g, ' ')
      );
      if (match) setLeistung(match);
    }
  }, [preselectLeistung]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (honeypot) return;
    if (!name.trim() || !email.trim() || !nachricht.trim()) {
      setError('Bitte füllen Sie Name, E-Mail und Nachricht aus.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (!datenschutz) {
      setError('Bitte bestätigen Sie die Datenschutzerklärung.');
      return;
    }

    setSubmitting(true);

    const leadRow = {
      name,
      firma,
      email,
      telefon,
      leistung,
      nachricht,
      quelle: 'kontaktformular',
      status: 'neu',
      notizen: '',
    };

    const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

    try {
      const { error: dbError } = await supabase.from('admin_leads').insert(leadRow);
      if (dbError) throw new Error('contact-submit-failed');

      if (web3formsKey) {
        try {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: web3formsKey,
              subject: `Anfrage morawebsoft.com: ${leistung || 'Allgemein'}`,
              from_name: 'morawebsoft.com Kontaktformular',
              name,
              firma,
              email,
              telefon,
              leistung,
              nachricht,
            }),
          });
        } catch {
          // Mail send failed, but DB insert succeeded — still redirect
        }
      }

      navigate('/danke');
    } catch (err) {
      console.error('contact form submit failed', err);
      setError('Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie direkt an matteo@morawebsoft.com.');
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[#374151] bg-[#1F2937] px-4 py-3 text-sm text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF]';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-[#E5E7EB]';

  return (
    <>
      <MetaTags />
      <Seo
        title="Kontakt | Anfrage senden | Morawebsoft"
        description="Senden Sie Ihre Projektanfrage, rufen Sie an oder schreiben Sie. Antwort innert 24 Stunden an Werktagen. Für konkrete Projekte nutzen Sie am besten das Formular."
        path="/kontakt"
      />

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 py-12 sm:px-8 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Kontakt</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-[#E5E7EB] sm:text-5xl">
          Ihre Anfrage, direkt bei mir.
        </h1>
      </section>

      {/* Drei Karten */}
      <section className="border-t border-[#374151] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Anrufen */}
            <div className="flex flex-col rounded-xl border border-[#374151] bg-[#1F2937] p-6">
              <div className="flex items-center gap-3">
                <Phone size={22} className="text-[#2DD4BF]" />
                <h3 className="text-lg font-bold text-[#E5E7EB]">Anrufen</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">
                Mo–Fr 8–18 Uhr. Wenn ich nicht abnehme, rufe ich am selben Tag zurück.
              </p>
              <a
                href="tel:0767764965"
                onClick={() => trackEvent('phone_click', { source: 'kontakt' })}
                className="mt-4 font-mono text-2xl font-bold text-[#2DD4BF] transition-colors hover:text-[#0F766E]"
              >
                076 776 49 65
              </a>
            </div>

            {/* Schreiben */}
            <div className="flex flex-col rounded-xl border border-[#374151] bg-[#1F2937] p-6">
              <div className="flex items-center gap-3">
                <Mail size={22} className="text-[#2DD4BF]" />
                <h3 className="text-lg font-bold text-[#E5E7EB]">Schreiben</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">
                Antwort innert 24 Stunden an Werktagen. Für konkrete Projekte nutzen Sie am besten das Formular.
              </p>
              <a
                href="mailto:matteo@morawebsoft.com"
                className="mt-4 font-mono text-base font-bold text-[#2DD4BF] transition-colors hover:text-[#0F766E]"
              >
                matteo@morawebsoft.com
              </a>
              <p className="mt-3 text-sm text-[#9CA3AF]">oder das Formular unten.</p>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col rounded-xl border border-[#374151] bg-[#1F2937] p-6">
              <div className="flex items-center gap-3">
                <Linkedin size={22} className="text-[#2DD4BF]" />
                <h3 className="text-lg font-bold text-[#E5E7EB]">LinkedIn</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">
                Vernetzen Sie sich mit mir.
              </p>
              <a
                href="https://www.linkedin.com/in/matteo-mora-13a639204/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#2DD4BF] transition-colors hover:text-[#0F766E]"
              >
                Matteo Mora <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formular */}
      <section className="border-t border-[#374151] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Formular</p>
          <form onSubmit={handleSubmit} noValidate className="mt-8 max-w-3xl space-y-5">
            {/* Honeypot */}
            <input
              type="text"
              name="company_website"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Ihr Name"
                />
              </div>
              <div>
                <label htmlFor="firma" className={labelClass}>Firma</label>
                <input
                  id="firma"
                  type="text"
                  value={firma}
                  onChange={e => setFirma(e.target.value)}
                  className={inputClass}
                  placeholder="Firmenname"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>E-Mail *</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="ihre@email.ch"
                />
              </div>
              <div>
                <label htmlFor="telefon" className={labelClass}>Telefon</label>
                <input
                  id="telefon"
                  type="tel"
                  value={telefon}
                  onChange={e => setTelefon(e.target.value)}
                  className={inputClass}
                  placeholder="+41 76 ..."
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="leistung" className={labelClass}>Leistung</label>
              <button
                id="leistung"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={serviceOpen}
                onClick={() => setServiceOpen(open => !open)}
                className={`${inputClass} flex items-center justify-between text-left ${leistung ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}`}
              >
                <span>{leistung || 'Bitte wählen'}</span>
                <ChevronDown size={17} className={`text-[#2DD4BF] transition-transform ${serviceOpen ? 'rotate-180' : ''}`} />
              </button>
              {serviceOpen && (
                <div role="listbox" aria-label="Leistung auswählen" className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-[#2DD4BF]/60 bg-[#111827] p-1 shadow-2xl shadow-black/40">
                  <button type="button" role="option" aria-selected={!leistung} onClick={() => { setLeistung(''); setServiceOpen(false); }} className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-[#9CA3AF] transition-colors hover:bg-[#1F2937] hover:text-white">Bitte wählen</button>
                  {LEISTUNGEN.map(item => (
                    <button type="button" role="option" aria-selected={leistung === item} key={item} onClick={() => { setLeistung(item); setServiceOpen(false); }} className={`block w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-[#1F2937] hover:text-white ${leistung === item ? 'bg-[#2DD4BF]/15 font-semibold text-[#5EEAD4]' : 'text-[#E5E7EB]'}`}>{item}</button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="nachricht" className={labelClass}>Nachricht *</label>
              <textarea
                id="nachricht"
                required
                rows={5}
                value={nachricht}
                onChange={e => setNachricht(e.target.value)}
                className={inputClass}
                placeholder="Worum geht es?"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="datenschutz"
                type="checkbox"
                checked={datenschutz}
                onChange={e => setDatenschutz(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#374151] bg-[#1F2937] text-[#2DD4BF] focus:ring-[#2DD4BF]"
              />
              <label htmlFor="datenschutz" className="text-sm leading-6 text-[#9CA3AF]">
                Ich habe die{' '}
                <Link to="/datenschutz" className="font-semibold text-[#2DD4BF] hover:text-[#0F766E]">
                  Datenschutzerklärung
                </Link>{' '}
                gelesen.
              </label>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Wird gesendet…' : 'Anfrage senden'}
            </button>

            <p className="text-sm text-[#9CA3AF]">
              Ich antworte persönlich, keine Verkaufsabteilung, kein Newsletter ohne Ihre Zustimmung.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
