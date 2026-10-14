import LandingPage from '../../components/public/LandingPage';

export default function OffertformularErpPage() {
  return (
    <LandingPage
      slug="offertformular-erp"
      label="// Offertformular ins ERP"
      h1="Jede Offertanfrage landet direkt in Abacus oder Bexio. Ohne Abtippen. CHF 1'900 fix."
      subline="Ihr Webformular wird zur Auftragsquelle: Anfrage rein, Adresse und Auftrag im ERP angelegt, Bestätigung an den Kunden raus. In zwei Wochen umgesetzt."
      painPoints={[
        { icon: 'mail', question: 'Anfragen kommen per Mail und werden abgetippt?' },
        { icon: 'copy', question: 'Adressen sind doppelt und falsch erfasst?' },
        { icon: 'clock', question: 'Kunden warten Tage auf eine Bestätigung?' },
      ]}
      offerItems={[
        'Formular auf Ihrer Website oder bestehendes anbinden',
        'Pflichtfelder und Prüfung',
        'Adress-Abgleich gegen bestehende Kunden',
        'Auftrag oder Offerte im ERP angelegt',
        'automatische Bestätigungsmail',
        'Fehlermeldung an Sie, wenn etwas hängt',
        'Dokumentation',
      ]}
      price="CHF 1'900 fix"
      duration="10 Arbeitstage"
      buttonText="Umsetzung besprechen (20 Min.)"
      screenshotSlug="offertformular-erp"
      exampleText="15 Anfragen/Woche × 8 Min. × 48 Wochen = 96 h/Jahr × CHF 60 = CHF 5'760. Einmalig CHF 1'900."
      testimonial={{
        quote: 'Wir tippen keine Offertanfragen mehr ab. Der Fehler bei der Adresserfassung ist weg.',
        name: 'R. Steiner',
        company: 'Steiner Sanitär AG',
      }}
      aboutText="Ich bin Matteo Mora, Informatiker EFZ und Entwickler mit IT-Leitungs-Erfahrung. Ich baue Schnittstellen und Automatisierungen für KMU – nicht von der Stange, sondern passend auf Ihre Prozesse."
      faq={[
        { question: 'Welche ERP?', answer: 'Abacus Abea/AbaBau, Bexio; andere auf Anfrage.' },
        { question: 'Neue Website nötig?', answer: 'Nein, das Formular lässt sich in jede bestehende Website einbetten.' },
        { question: 'ERP nicht erreichbar?', answer: 'Daten werden zwischengespeichert und automatisch nachgeliefert.' },
        { question: 'Laufende Kosten?', answer: 'Monitoring ab CHF 49 pro Monat.' },
        { question: 'Dauer?', answer: '10 Arbeitstage ab ERP-Zugang.' },
      ]}
      leistung="Schnittstellen"
      quelle="landingpage-offertformular-erp"
      showForm
      title="Jede Offertanfrage landet direkt in Abacus oder Bexio | Morawebsoft"
      metaDescription="Ihr Webformular wird zur Auftragsquelle: Anfrage rein, Adresse und Auftrag im ERP angelegt, Bestätigung an den Kunden raus. In zwei Wochen umgesetzt."
      path="/offertformular-erp"
    />
  );
}
