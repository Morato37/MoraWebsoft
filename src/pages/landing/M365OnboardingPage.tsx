import LandingPage from '../../components/public/LandingPage';

export default function M365OnboardingPage() {
  return (
    <LandingPage
      slug="m365-onboarding"
      label="// M365-Onboarding-Automatik"
      h1="Neue Mitarbeitende haben am ersten Tag alles. Automatisch. CHF 1'500 fix."
      subline="Ein Formular von HR, und Microsoft 365 legt Konto, Lizenzen, Gruppen, Teams-Kanäle, Signatur und Willkommensmail an. Beim Austritt umgekehrt."
      painPoints={[
        { icon: 'users', question: 'Die IT erfährt vom neuen Mitarbeiter am ersten Arbeitstag?' },
        { icon: 'license', question: 'Lizenzen bleiben nach Austritten monatelang aktiv?' },
        { icon: 'click', question: 'Jeder Eintritt ist eine Stunde Klickarbeit?' },
      ]}
      offerItems={[
        'HR-Formular (Microsoft Forms oder Lists)',
        'Power-Automate-Flow mit Genehmigung',
        'Konto, Lizenz, Gruppen, Teams, Signatur',
        'Austritts-Flow mit Datensicherung',
        'Protokoll jeder Aktion',
        'Übergabe an Ihre IT',
      ]}
      price="CHF 1'500 fix"
      duration="10 Arbeitstage"
      buttonText="Onboarding-Flow besprechen"
      screenshotSlug="m365-onboarding"
      exampleText="20 Ein-/Austritte × 1,5 h = 30 h/Jahr, plus vergessene Lizenzen à CHF 15/Monat. Amortisiert im ersten Jahr."
      testimonial={{
        quote: 'Neue Mitarbeiter haben am ersten Tag alles. Der IT-Aufwand ist von einer Stunde auf null gesunken.',
        name: 'S. Keller',
        company: 'Keller Bau GmbH',
      }}
      aboutText="Ich bin Matteo Mora, Informatiker EFZ und Entwickler mit IT-Leitungs-Erfahrung. Ich verwalte M365 in der Praxis und kenne die Stolpersteine bei Lizenzen, Gruppen und Prozessen aus erster Hand."
      faq={[
        { question: 'Brauchen wir Power Automate?', answer: 'Ja, der Flow läuft in Ihrem M365-Tenant. Eine Lizenz reicht meist.' },
        { question: 'Wer gibt die Daten ein?', answer: 'HR füllt das Formular aus, die Genehmigung läuft über die IT.' },
        { question: 'Was passiert beim Austritt?', answer: 'Ein separater Flow sichert die Daten, entzieht Lizenzen und entfernt den Zugang.' },
        { question: 'Laufende Kosten?', answer: 'Keine. Der Flow läuft in Ihrem Tenant. Anpassungen nach dem ersten Jahr CHF 40/Std.' },
        { question: 'Dauer?', answer: '10 Arbeitstage ab M365-Zugang.' },
      ]}
      leistung="Automatisierung"
      quelle="landingpage-m365-onboarding"
      showForm
      title="Neue Mitarbeitende haben am ersten Tag alles automatisch | Morawebsoft"
      metaDescription="Ein Formular von HR, und Microsoft 365 legt Konto, Lizenzen, Gruppen, Teams-Kanäle, Signatur und Willkommensmail an. Beim Austritt umgekehrt."
      path="/m365-onboarding"
    />
  );
}
