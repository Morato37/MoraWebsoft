import LandingPage from '../../components/public/LandingPage';

export default function ProzessCheckPage() {
  return (
    <LandingPage
      slug="prozess-check"
      label="// Prozess-Check"
      h1="In zwei Stunden wissen Sie, welche drei Prozesse Sie zuerst automatisieren sollten. CHF 490."
      subline="Video-Call mit Bildschirmfreigabe. Sie zeigen mir Ihren Alltag, ich notiere, wo Zeit verloren geht. Drei Tage später haben Sie einen Bericht mit Aufwand, Nutzen und Festpreis je Massnahme."
      trustLine="Wird vollständig angerechnet. Kein Auftrag, kein Problem: der Bericht gehört Ihnen."
      painPoints={[
        { icon: 'clock', question: 'Sie wissen, dass viel Handarbeit ist, aber nicht wo anfangen?' },
        { icon: 'mail', question: 'Abläufe zwischen Mail, Excel und ERP sind unübersichtlich?' },
        { icon: 'missing', question: 'Keine Zeit, sich mit Automatisierung zu befassen?' },
      ]}
      offerItems={[
        'Vorbereitungs-Fragebogen (10 Min.)',
        '2 Stunden Video',
        'Bericht mit 3–5 Massnahmen, je Stunden pro Monat gespart, Festpreis, Priorität',
        '30 Minuten Besprechung des Berichts',
        'Betrag wird bei Auftrag angerechnet',
      ]}
      price="CHF 490"
      duration="2 h Video + Bericht"
      buttonText="Prozess-Check buchen"
      screenshotSlug="prozess-check"
      exampleText="4 Stunden pro Woche Doppelerfassung × 48 Wochen × CHF 60 Vollkosten = CHF 11'520 pro Jahr. Eine Schnittstelle für CHF 3'900 rechnet sich in vier Monaten."
      testimonial={{
        quote: 'Der Bericht war pragmatisch: drei Massnahmen, je mit Festpreis und Sparpotenzial. Wir haben zwei davon direkt beauftragt.',
        name: 'M. Frei',
        company: 'Frei Transporte AG',
      }}
      aboutText="Ich bin Matteo Mora, Informatiker EFZ und Entwickler mit IT-Leitungs-Erfahrung. Ich schaue nicht auf Tools, sondern auf Abläufe – und sage Ihnen ehrlich, was sich lohnt und was nicht."
      faq={[
        { question: 'Brauche ich Microsoft 365?', answer: 'Für Power Automate ja. Sonst arbeite ich mit Skripten und Schnittstellen, unabhängig vom System.' },
        { question: 'Wird der Prozess-Check wirklich angerechnet?', answer: 'Ja, vollständig, beim ersten Auftrag aus dem Bericht.' },
        { question: 'Wie läuft die Zahlung?', answer: 'Per Terminbuchung mit Zahlung oder Rechnung nach Buchung.' },
        { question: 'Was, wenn ich keinen Auftrag will?', answer: 'Kein Problem. Der Bericht gehört Ihnen.' },
      ]}
      leistung="Automatisierung"
      quelle="landingpage-prozess-check"
      showForm={false}
      title="Prozess-Check: welche drei Prozesse Sie zuerst automatisieren sollten | Morawebsoft"
      metaDescription="Video-Call mit Bildschirmfreigabe. Sie zeigen mir Ihren Alltag, ich notiere, wo Zeit verloren geht. Drei Tage später haben Sie einen Bericht mit Aufwand, Nutzen und Festpreis je Massnahme."
      path="/prozess-check"
    />
  );
}
