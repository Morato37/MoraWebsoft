import LandingPage from '../../components/public/LandingPage';

export default function ShopAbacusPage() {
  return (
    <LandingPage
      slug="shop-abacus"
      label="// Shop zu Abacus"
      h1="Shop-Bestellungen landen automatisch in Abacus. Ab CHF 3'900."
      subline="Shopify oder WooCommerce zu Abacus Auftragsbearbeitung: Kunde, Auftrag, Zahlung, Lieferschein. Lagerbestand zurück in den Shop. Mit Monitoring."
      painPoints={[
        { icon: 'copy', question: 'Jede Bestellung wird von Hand in Abacus übertragen?' },
        { icon: 'stock', question: 'Lagerbestände stimmen im Shop nie?' },
        { icon: 'csv', question: 'Monatsabschluss heisst CSV-Importe?' },
      ]}
      offerItems={[
        'Analyse der Felder (1 Tag)',
        'Anbindung Shop zu Abacus',
        'Kundenabgleich',
        'Zahlungsstatus (Stripe, Twint, Rechnung)',
        'Bestandsabgleich zurück in den Shop',
        'Testlauf mit echten Bestellungen',
        'Alarm bei Fehlern',
        'Dokumentation',
      ]}
      price="ab CHF 3'900"
      duration="3–6 Wochen"
      buttonText="Shop-Anbindung besprechen"
      screenshotSlug="shop-abacus"
      exampleText="30 Bestellungen/Woche × 5 Min. × 48 Wochen = 120 h/Jahr × CHF 60 = CHF 7'200. Ab CHF 3'900 einmalig."
      testimonial={{
        quote: 'Endlich stimmt der Lagerbestand im Shop. Der Monatsabschluss ist keine CSV-Schlacht mehr.',
        name: 'C. Berger',
        company: 'Berger Food Trading GmbH',
      }}
      aboutText="Ich bin Matteo Mora, Informatiker EFZ und Entwickler mit IT-Leitungs-Erfahrung. Ich kenne Abacus aus der Praxis und baue Shop-Schnittstellen, die im Alltag funktionieren – mit Monitoring und Dokumentation."
      faq={[
        { question: 'Welche Shops?', answer: 'Shopify und WooCommerce. Andere auf Anfrage.' },
        { question: 'Welche Abacus-Module?', answer: 'AbaBau Auftragsbearbeitung, je nach Version und Modul.' },
        { question: 'Was passiert bei Fehlern?', answer: 'Sie bekommen eine Meldung. Daten werden zwischengespeichert und nachgeliefert.' },
        { question: 'Laufende Kosten?', answer: 'Monitoring und kleine Anpassungen ab CHF 99 pro Monat.' },
        { question: 'Dauer?', answer: '3–6 Wochen je nach Komplexität und Modulen.' },
      ]}
      leistung="Schnittstellen"
      quelle="landingpage-shop-abacus"
      showForm
      title="Shop-Bestellungen landen automatisch in Abacus | Morawebsoft"
      metaDescription="Shopify oder WooCommerce zu Abacus Auftragsbearbeitung: Kunde, Auftrag, Zahlung, Lieferschein. Lagerbestand zurück in den Shop. Mit Monitoring."
      path="/shop-abacus"
    />
  );
}
