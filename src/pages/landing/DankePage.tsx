import { Link } from 'react-router-dom';
import Seo from '../../components/public/Seo';
import { trackEvent } from '../../lib/analytics';

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL ?? 'https://cal.com/morawebsoft';

export default function DankePage() {
  return (
    <>
      <Seo
        title="Danke | Morawebsoft"
        description="Danke für Ihre Anfrage. Ich melde mich innert 24 Stunden."
        path="/danke"
        noindex
      />

      <section className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Danke</p>
        <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-[#E5E7EB] sm:text-5xl">
          Danke, ich melde mich innert 24 Stunden.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#9CA3AF]">
          In der Zwischenzeit: drei Referenzen ansehen oder direkt einen Termin wählen, dann geht es schneller.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/#referenzen"
            className="rounded-lg border border-[#2DD4BF] px-6 py-3 text-center font-semibold text-[#2DD4BF] transition-colors hover:bg-[#0F766E] hover:text-white"
          >
            Referenzen
          </Link>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('booking_click', { source: 'danke' })}
            className="rounded-lg bg-[#2DD4BF] px-6 py-3 text-center font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white"
          >
            Termin wählen
          </a>
        </div>
      </section>

      {/* Fires form_submit event on load — Plausible custom event */}
      <script
        dangerouslySetInnerHTML={{
          __html: 'if(window.plausible){window.plausible("form_submit");}',
        }}
      />
    </>
  );
}
