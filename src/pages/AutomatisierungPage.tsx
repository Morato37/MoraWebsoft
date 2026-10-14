import ServicePage from '../components/public/ServicePage';

export default function AutomatisierungPage() {
  return (
    <ServicePage
      title="Prozessautomatisierung für KMU | Power Automate, Workflows, Skripte | Morawebsoft"
      metaDescription="Repetitive Arbeit im Büro automatisieren: Offerten, Rechnungen, Onboarding, Mails, Datenabgleich. Prozess-Check für CHF 490, Mini-Produkte zum Festpreis."
      label="// Automatisierung"
      h1="Was Ihr Team jede Woche von Hand macht, läuft ab jetzt von allein."
      subline="Ich automatisiere die Abläufe zwischen Mail, Excel, ERP und M365, mit Power Automate, Skripten und Schnittstellen. Sie behalten die Kontrolle, verlieren aber die Handarbeit."
      problems={[
        'Offertanfrage vom Webformular wird von Hand ins ERP getippt',
        'Neue Mitarbeitende warten Tage auf Konto und Lizenzen',
        'Rechnungen und Mahnungen werden einzeln erstellt und verschickt',
        'Lieferanten-PDFs werden abgetippt und verbucht',
      ]}
      packages={[
        {
          name: 'Prozess-Check remote',
          price: 'CHF 490',
          duration: '2 h Video + Bericht',
          featured: true,
          items: [
            'Vorbereitungs-Fragebogen',
            '2 Stunden Video mit Bildschirmfreigabe',
            'Bericht mit 3–5 Automatisierungen je mit Stunden pro Monat, Festpreis und Priorität',
            '30 Minuten Besprechung',
            'Betrag wird bei Auftrag angerechnet',
          ],
          link: '/prozess-check',
          buttonText: 'Prozess-Check buchen',
        },
      ]}
      miniProducts={[
        { name: 'Offertformular ins ERP', price: 'CHF 1\'900 fix', duration: '10 Arbeitstage', link: '/offertformular-erp' },
        { name: 'M365-Onboarding-Automatik', price: 'CHF 1\'500 fix', duration: '10 Arbeitstage', link: '/m365-onboarding' },
        { name: 'Rechnungs- und Mahnlauf', price: 'CHF 2\'400 fix', duration: '15 Arbeitstage' },
        { name: 'Power-Automate-Flow', price: 'ab CHF 900', duration: '5 Arbeitstage' },
      ]}
      includes={[
        'Dokumentation jedes Flows',
        'Fehlermeldung an Sie, wenn etwas hängt',
        'Läuft in Ihrem M365-Tenant, keine Fremd-Abos',
        'Monitoring im Betreuungsvertrag',
      ]}
      exampleText="4 Stunden pro Woche Doppelerfassung × 48 Wochen × CHF 60 Vollkosten = CHF 11'520 pro Jahr. Eine Schnittstelle für CHF 3'900 rechnet sich in vier Monaten."
      tech={['Power Automate', 'Microsoft Graph', 'Node.js', 'Python', 'Supabase', 'Webhooks']}
      faq={[
        {
          question: 'Brauche ich Microsoft 365?',
          answer: 'Für Power Automate ja. Sonst arbeite ich mit Skripten und Schnittstellen, unabhängig vom System.',
        },
        {
          question: 'Was, wenn sich mein Prozess ändert?',
          answer: 'Flows sind dokumentiert und anpassbar. Kleine Änderungen sind im Betreuungsvertrag enthalten.',
        },
        {
          question: 'Wie sicher sind meine Daten?',
          answer: 'Alles läuft in Ihren Systemen. Ich speichere keine Kundendaten bei mir.',
        },
        {
          question: 'Wird der Prozess-Check wirklich angerechnet?',
          answer: 'Ja, vollständig, beim ersten Auftrag aus dem Bericht.',
        },
      ]}
      ctaText="In zwei Stunden wissen Sie, welche drei Prozesse Sie zuerst automatisieren sollten."
      ctaButton="Prozess-Check buchen"
      ctaLink="/prozess-check"
      path="/automatisierung"
      serviceName="Prozessautomatisierung"
      servicePrice="490"
    />
  );
}
