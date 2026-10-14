import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <section className="border-t border-[#374151] py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="rounded-2xl border border-[#2DD4BF]/40 bg-[#1F2937] px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-[#E5E7EB] sm:text-4xl">
            Erzählen Sie mir in 20 Minuten, wo es hängt.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#9CA3AF]">
            Kostenlos, per Video, ohne Verkaufsdruck. Sie bekommen eine ehrliche Einschätzung und, wenn es passt, eine Offerte bis am nächsten Abend.
          </p>
          <Link to="/kontakt" className="mt-8 inline-flex rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white">
            Termin wählen
          </Link>
          <p className="mt-6 text-sm text-[#9CA3AF]">
            <a href="tel:0767764965" className="hover:text-[#2DD4BF]">076 776 49 65</a>
            {' · '}
            <a href="mailto:matteo@morawebsoft.com" className="hover:text-[#2DD4BF]">matteo@morawebsoft.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}
