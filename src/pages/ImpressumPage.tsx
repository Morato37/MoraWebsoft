import Seo from '../components/public/Seo';

export default function ImpressumPage() {
  return (
    <>
      <Seo
        title="Impressum | Morawebsoft"
        description="Impressum von Morawebsoft, Matteo Mora, Rüti ZH."
        path="/impressum"
        noindex
      />
      <section className="mx-auto max-w-[800px] px-6 py-12 sm:px-8 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Impressum</p>
        <h1 className="mt-5 text-3xl font-bold text-[#E5E7EB] sm:text-4xl">Impressum</h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[#9CA3AF]">
          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">Anbieter</h2>
            <p className="mt-2">
              Morawebsoft<br />
              Matteo Mora<br />
              [Strasse]<br />
              8630 Rüti ZH<br />
              Schweiz
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">Kontakt</h2>
            <p className="mt-2">
              E-Mail: <a href="mailto:matteo@morawebsoft.com" className="text-[#2DD4BF] hover:text-[#0F766E]">matteo@morawebsoft.com</a><br />
              Telefon: <a href="tel:0767764965" className="text-[#2DD4BF] hover:text-[#0F766E]">076 776 49 65</a>
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">UID</h2>
            <p className="mt-2">[UID]</p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">Haftungsausschluss</h2>
            <p className="mt-2">
              Die Inhalte dieser Website werden mit grösstmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewährleistung übernommen werden.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
