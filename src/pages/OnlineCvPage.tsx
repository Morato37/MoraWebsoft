import ServicePage from '../components/public/ServicePage';

export default function OnlineCvPage() {
  return (
    <ServicePage
      title="Online-Lebenslauf als eigene Website | Digitales CV CHF 490 | Morawebsoft"
      metaDescription="Ihr Lebenslauf als persönliche Website mit eigener Domain, PDF-Export und modernem Design. In 5 Tagen online. CHF 490, für Lernende und Studierende CHF 290."
      label="// Online-CV"
      h1="Der Lebenslauf, den Personaler weiterklicken statt wegklicken."
      subline="Eine persönliche Website mit Ihrem Werdegang, Ihren Projekten und Ihrem Foto. Eigene Domain, auf jedem Gerät, als PDF exportierbar."
      problems={[
        'Ihr PDF-Lebenslauf sieht auf dem Handy aus wie eine Tabelle',
        'LinkedIn zeigt alle gleich, Sie wollen auffallen',
        'Projekte und Arbeitsproben passen auf keine zwei Seiten',
      ]}
      packages={[
        {
          name: 'Digitales CV',
          price: 'CHF 490',
          duration: '5 Arbeitstage',
          featured: true,
          items: [
            'Design in Hell oder Dunkel',
            'eigene Domain (vorname-nachname.ch)',
            '1 Jahr Hosting',
            'PDF-Export',
            'LinkedIn-Verknüpfung',
            '1 Korrekturrunde',
          ],
          link: '/online-cv/bestellen',
          buttonText: 'Anfrage senden',
        },
        {
          name: 'Lernende und Studierende',
          price: 'CHF 290',
          duration: '5 Arbeitstage',
          items: [
            'gleicher Umfang',
            'mit Ausweis',
          ],
          link: '/online-cv/bestellen',
          buttonText: 'Anfrage senden',
        },
      ]}
      includes={[
        'Verlängerung Hosting CHF 60 pro Jahr',
        'Datenschutz: keine Tracker, kein Verkauf von Daten',
        'Änderungen nach dem ersten Jahr CHF 40 pro Stunde',
      ]}
      examples={[
        { image: 'https://image.thum.io/get/width/1200/https://it-professional-port-0nre.bolt.host/', title: 'IT Professional, Dark Mode', externalUrl: 'https://it-professional-port-0nre.bolt.host/', linkText: 'Ansehen' },
        { image: '/images/cv-2.jpg', title: 'Mein eigenes CV', link: '/ueber-mich', linkText: 'Ansehen' },
        { title: 'Weiteres Beispiel folgt', placeholder: true },
      ]}
      steps={[
        { num: '01', title: 'Formular ausfüllen (15 Min.)' },
        { num: '02', title: 'Entwurf nach 3 Tagen' },
        { num: '03', title: 'Eine Korrekturrunde' },
        { num: '04', title: 'Online unter Ihrer Domain' },
      ]}
      faq={[
        {
          question: 'Brauche ich Technik-Wissen?',
          answer: 'Nein. Sie füllen ein Formular aus und geben den Entwurf frei.',
        },
        {
          question: 'Kann ich später selbst ändern?',
          answer: 'Kleine Textänderungen mache ich im ersten Jahr kostenlos, danach CHF 40 pro Stunde.',
        },
        {
          question: 'Wem gehört die Domain?',
          answer: 'Ihnen. Sie wird auf Ihren Namen registriert.',
        },
        {
          question: 'Kann ich das CV als PDF verschicken?',
          answer: 'Ja, der Export ist eingebaut und sieht aus wie die Website.',
        },
      ]}
      ctaText="In 15 Minuten angefragt, in 5 Tagen erhalten Sie den ersten Entwurf."
      ctaButton="Anfrage senden"
      ctaLink="/online-cv/bestellen"
      path="/online-cv"
      serviceName="Online-Lebenslauf"
      servicePrice="490"
      referencesTag="online-cv"
      referencesTitle="Referenzen aus dem Online-CV."
    />
  );
}
