import ServicePage from '../components/public/ServicePage';

export default function WebengineeringPage() {
  return (
    <ServicePage
      title="Web-App entwickeln lassen | Individualsoftware für KMU | Morawebsoft"
      metaDescription="Web-Applikationen, Portale und interne Tools für KMU. MVP in 6 Wochen ab CHF 9'500, danach Weiterentwicklung im Sprint-Modell. Entwickelt in der Schweiz."
      label="// Webengineering"
      h1="Das Tool, das Ihre Excel-Liste ablöst. In sechs Wochen."
      subline="Rapportierung, Offertverwaltung, Kundenportal, Lagerverwaltung, Planungstool: Ich entwickle Web-Applikationen, die genau Ihren Prozess abbilden, statt ihn zu verbiegen."
      problems={[
        'Daten in zehn Excel-Dateien, die drei Leute gleichzeitig bearbeiten',
        'Standardsoftware, die 80 % kann und 20 % verhindert',
        'Zettelwirtschaft zwischen Büro und Baustelle',
        'Kundenanfragen, die per Mail verloren gehen',
      ]}
      packages={[
        {
          name: 'MVP',
          price: 'ab CHF 9\'500',
          duration: '6 Wochen',
          featured: true,
          items: [
            'Konzept-Workshop (2 h)',
            'Datenmodell',
            'Login mit Rollen',
            '3–5 Kernfunktionen',
            'responsive Oberfläche',
            'Hosting in der Schweiz oder EU',
            'Übergabe mit Schulung',
          ],
        },
        {
          name: 'Sprint',
          price: 'CHF 4\'800',
          duration: '2 Wochen',
          items: [
            'fixer Umfang pro Sprint',
            'Demo am Ende',
            'jederzeit pausierbar',
            'für Weiterentwicklung nach dem MVP',
          ],
        },
      ]}
      includes={[
        'Code und Repository gehören Ihnen',
        'Dokumentation, von jedem Entwickler übernehmbar',
        'Zwischenstände online einsehbar',
        'Hosting-Kosten transparent, ab CHF 20 pro Monat',
        'Betreuung ab CHF 99 pro Monat',
      ]}
      tech={['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Docker']}
      faq={[
        {
          question: 'Gehört mir der Code?',
          answer: 'Ja, vollständig, inklusive Repository und Dokumentation.',
        },
        {
          question: 'Was, wenn Sie ausfallen?',
          answer: 'Standard-Stack und Dokumentation: Jeder Entwickler kann übernehmen. Das ist Teil der Übergabe.',
        },
        {
          question: 'Was kostet das Hosting?',
          answer: 'Ab CHF 20 pro Monat, je nach Nutzung, transparent weiterverrechnet.',
        },
        {
          question: 'Wie lange dauert ein MVP?',
          answer: 'Sechs Wochen ab Konzept-Workshop, bei klarem Umfang.',
        },
        {
          question: 'Können Sie an bestehende Systeme anbinden?',
          answer: 'Ja: Abacus, Bexio, Microsoft 365, Shopify, Stripe und andere mit API.',
        },
      ]}
      ctaText="Beschreiben Sie mir Ihren Prozess in 20 Minuten. Ich sage Ihnen, ob eine Web-App die richtige Lösung ist und was sie kostet."
      ctaButton="Prozess in 20 Minuten besprechen"
      path="/webengineering"
      serviceName="Web-App Entwicklung"
      servicePrice="9500"
      referencesTag="webengineering"
      referencesTitle="Referenzen aus der Web-App-Entwicklung."
    />
  );
}
