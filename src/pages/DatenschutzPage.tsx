import Seo from '../components/public/Seo';

export default function DatenschutzPage() {
  return (
    <>
      <Seo
        title="Datenschutzerklärungklärung | Morawebsoft"
        description="Datenschutzerklärungklärung nach Schweizer revDSG: Verantwortlicher, erhobene Daten, Hosting, Analytics, Rechte der betroffenen Personen."
        path="/datenschutz"
        noindex
      />
      <section className="mx-auto max-w-[800px] px-6 py-12 sm:px-8 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Datenschutz</p>
        <h1 className="mt-5 text-3xl font-bold text-[#E5E7EB] sm:text-4xl">Datenschutzerklärungklärung</h1>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#9CA3AF]">
          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">1. Verantwortlicher</h2>
            <p className="mt-2">
              Morawebsoft, Matteo Mora, [Strasse], 8630 Rüti ZH, Schweiz.<br />
              E-Mail: matteo@morawebsoft.com · Telefon: 076 776 49 65
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">2. Daten im Kontaktformular</h2>
            <p className="mt-2">
              Wenn Sie das Kontaktformular verwenden, werden Name, Firma, E-Mail, Telefon, gewählte Leistung und Ihre Nachricht erfasst. Diese Daten werden in einer Datenbank bei Supabase (EU-Hosting) gespeichert. Zusätzlich wird eine E-Mail-Benachrichtigung über den Dienst Web3Forms an matteo@morawebsoft.com gesendet. Die Daten dienen ausschliesslich der Bearbeitung Ihrer Anfrage. Es erfolgt keine Weitergabe an Dritte ausser zum Zweck der E-Mail-Zustellung.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">3. Hosting-Anbieter und Server-Logs</h2>
            <p className="mt-2">
              Diese Website wird bei Bolt (Bolt.new) gehostet. Beim Aufruf der Website werden technisch bedingt Server-Logdaten (IP-Adresse, Datum, Uhrzeit, angeforderte Seite, Referrer) erfasst. Diese Daten dienen ausschliesslich der Sicherstellung des Betriebs und der Sicherheit und werden nicht mit anderen Datenquellen verknüpft.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">4. Analytics</h2>
            <p className="mt-2">
              Diese Website nutzt Plausible Analytics, eine datenschutzfreundliche Web-Analyse ohne Cookies und ohne personenbeziehbare Daten. Es wird kein Cookie-Banner benötigt, da Plausible gemäss DSGVO und revDSG ohne Einwilligung arbeitet.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">5. Google Ads Conversion-Tracking</h2>
            <p className="mt-2">
              Wenn Google Ads Conversion-Tracking aktiv ist, wird beim Besuch der Dankesseite ein Conversion-Snippet geladen. Sie können dies ablehnen, indem Sie das Tracking in Ihren Browser-Einstellungen deaktivieren oder einen Werbeblocker verwenden. Es wird kein Cookie-Banner eingeblendet; stattdessen gilt ein schlichter Hinweis: Durch die Nutzung dieser Website stimmen Sie dem Conversion-Tracking zu, sofern es aktiv ist. Sie können es jederzeit ablehnen.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">6. Rechte der betroffenen Personen</h2>
            <p className="mt-2">
              Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten, auf Berichtigung, Löschung und Einschränkung der Verarbeitung. Zur Ausübung dieser Rechte kontaktieren Sie mich unter matteo@morawebsoft.com.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#E5E7EB]">7. Kontakt</h2>
            <p className="mt-2">
              Für Fragen zum Datenschutz wenden Sie sich an: Matteo Mora, matteo@morawebsoft.com, 076 776 49 65.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
