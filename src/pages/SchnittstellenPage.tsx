import ServicePage from '../components/public/ServicePage';

export default function SchnittstellenPage() {
  return (
    <ServicePage
      title="Abacus Schnittstelle, Shop-ERP-Anbindung, API-Entwicklung | Morawebsoft"
      metaDescription="Schnittstellen zwischen Shop, CRM, Formularen und Abacus, Bexio, M365, Stripe oder Shopify. Entwickelt in der Schweiz, mit Monitoring. Ab CHF 3'900."
      label="// Schnittstellen"
      h1="Ihre Systeme reden endlich miteinander."
      subline="Shop zu Abacus, Formular zu CRM, Stripe zu Buchhaltung, Zeiterfassung zu Lohn: Ich baue die Verbindung, dokumentiere sie und überwache sie."
      problems={[
        'Jede Shop-Bestellung wird von Hand ins ERP übertragen',
        'Lagerbestände stimmen im Shop nie',
        'Monatsabschluss heisst CSV-Export und -Import',
        'Adressen existieren dreimal, dreimal anders',
      ]}
      integrations={[
        'Abacus (AbaBau, Abea, AbaReport, DataAnalyzer)',
        'Bexio',
        'Microsoft 365 / Graph API',
        'Shopify',
        'WooCommerce',
        'Stripe',
        'Twint',
        'HubSpot',
        'Supabase',
        'PostgreSQL',
      ]}
      packages={[
        {
          name: 'Anbindung',
          price: 'ab CHF 3\'900',
          duration: '3–6 Wochen',
          featured: true,
          items: [
            'Analyse der Datenfelder (1 Tag)',
            'Umsetzung mit Testumgebung',
            'Abnahme mit echten Daten',
            'Monitoring mit Alarm',
            'Dokumentation',
          ],
        },
        {
          name: 'API-Entwicklung',
          price: 'CHF 140 / h',
          duration: 'Tagespauschale CHF 1\'050',
          items: [
            'eigene REST- oder GraphQL-API',
            'Auth',
            'Dokumentation (OpenAPI)',
            'Tests',
          ],
        },
        {
          name: 'Für Agenturen und Softwarefirmen',
          price: 'Sprint CHF 4\'800',
          duration: '2 Wochen',
          items: [
            'White-Label',
            'NDA',
            'Sie behalten den Kunden, ich liefere die Integration',
          ],
        },
      ]}
      includes={[
        'Monitoring mit Alarm bei Fehlern',
        'Zwischenspeicher, wenn ein System nicht erreichbar ist',
        'Dokumentation der Felder und Regeln',
        'Betreuung ab CHF 99 pro Monat',
      ]}
      exampleText="30 Bestellungen pro Woche × 5 Minuten × 48 Wochen = 120 Stunden pro Jahr. Ab CHF 3'900 einmalig."
      faq={[
        {
          question: 'Welche Abacus-Schnittstelle nutzen Sie?',
          answer: 'AbaConnect und die REST-API, je nach Version und Modul.',
        },
        {
          question: 'Was passiert, wenn das ERP nicht erreichbar ist?',
          answer: 'Daten werden zwischengespeichert und nachgeliefert. Sie bekommen eine Meldung.',
        },
        {
          question: 'Können Sie mit unserem Abacus-Partner zusammenarbeiten?',
          answer: 'Ja, das ist der Normalfall. Ich stimme mich mit Ihrem Partner ab.',
        },
        {
          question: 'Was kostet der Betrieb?',
          answer: 'Monitoring und kleine Anpassungen ab CHF 99 pro Monat.',
        },
      ]}
      ctaText="Nennen Sie mir die zwei Systeme, die sich nicht verstehen. In 20 Minuten sage ich Ihnen, wie die Verbindung aussieht und was sie kostet."
      ctaButton="Schnittstelle in 20 Minuten besprechen"
      path="/schnittstellen"
      serviceName="Schnittstellenentwicklung"
      servicePrice="3900"
      referencesTag="schnittstellen"
      referencesTitle="Referenzen aus der Schnittstellenentwicklung."
    />
  );
}
