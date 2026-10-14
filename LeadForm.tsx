import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface LeadFormProps {
  leistung: string;
  quelle?: string;
}

export default function LeadForm({ leistung, quelle = 'landingpage' }: LeadFormProps) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [firma, setFirma] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [nachricht, setNachricht] = useState('');
  const [datenschutz, setDatenschutz] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (honeypot) return;
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
      quelle,
    };

    const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

    try {
      const { error: dbError } = await supabase.from('admin_leads').insert(leadRow);
      if (dbError) throw new Error(dbError.message);

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
      setError(
        err instanceof Error
          ? `Beim Senden ist ein Fehler aufgetreten: ${err.message}. Bitte versuchen Sie es erneut oder schreiben Sie direkt an matteo@morawebsoft.com.`
          : 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[#374151] bg-[#1F2937] px-4 py-3 text-sm text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#2DD4BF] focus:outline-none focus:ring-1 focus:ring-[#2DD4BF]';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-[#E5E7EB]';

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-5">
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
          <label htmlFor="lf-name" className={labelClass}>Name *</label>
          <input
            id="lf-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
            placeholder="Ihr Name"
          />
        </div>
        <div>
          <label htmlFor="lf-firma" className={labelClass}>Firma</label>
          <input
            id="lf-firma"
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
          <label htmlFor="lf-email" className={labelClass}>E-Mail *</label>
          <input
            id="lf-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
            placeholder="ihre@email.ch"
          />
        </div>
        <div>
          <label htmlFor="lf-telefon" className={labelClass}>Telefon</label>
          <input
            id="lf-telefon"
            type="tel"
            value={telefon}
            onChange={e => setTelefon(e.target.value)}
            className={inputClass}
            placeholder="+41 76 ..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="lf-nachricht" className={labelClass}>Nachricht *</label>
        <textarea
          id="lf-nachricht"
          required
          rows={4}
          value={nachricht}
          onChange={e => setNachricht(e.target.value)}
          className={inputClass}
          placeholder="Worum geht es?"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="lf-datenschutz"
          type="checkbox"
          checked={datenschutz}
          onChange={e => setDatenschutz(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[#374151] bg-[#1F2937] text-[#2DD4BF] focus:ring-[#2DD4BF]"
        />
        <label htmlFor="lf-datenschutz" className="text-sm leading-6 text-[#9CA3AF]">
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
        className="rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Wird gesendet…' : 'Anfrage senden'}
      </button>

      <p className="text-sm text-[#9CA3AF]">
        Ich antworte persönlich, keine Verkaufsabteilung, kein Newsletter ohne Ihre Zustimmung.
      </p>
    </form>
  );
}
