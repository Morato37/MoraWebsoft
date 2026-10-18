import ServicePage from '../components/public/ServicePage';

export default function WebdesignPage() {
  return (
    <ServicePage
      title="Website erstellen lassen für KMU | Festpreis ab CHF 2'900 | Morawebsoft"
      metaDescription="Websites und Onlineshops für KMU im Zürcher Oberland, am Obersee und in Zürich. Festpreis, mobil, bei Google gefunden, selbst bearbeitbar. In drei Wochen online."
      label="// Webdesign"
      h1="Eine Website, die Anfragen bringt. Zum Festpreis, in drei Wochen."
      subline="Mobil, schnell, bei Google sichtbar, von Ihnen selbst bearbeitbar. Ohne Abo-Falle und ohne Baukasten-Grenzen."
      problems={[
        'Website von 2017, auf dem Handy nicht bedienbar',
        'Bei Google auf Seite drei, Mitbewerber auf Seite eins',
        'Kontaktformular, das ins Leere geht',
        'Baukasten-Abo, das jedes Jahr teurer wird',
      ]}
      packages={[
        {
          name: 'Start',
          price: 'CHF 2\'900 fix',
          duration: '3 Wochen',
          items: [
            'One-Pager oder 5 Seiten',
            'mobil',
            'Kontaktformular',
            'Google Business Profil verknüpft',
            '1 Korrekturrunde',
          ],
        },
        {
          name: 'Business',
          price: 'CHF 5\'900–8\'500',
          duration: '5 Wochen',
          featured: true,
          items: [
            'bis 10 Seiten',
            'selbst bearbeitbar (Admin)',
            'Blog oder News',
            'SEO-Grundlagen',
            'Fotos einbinden',
            '2 Korrekturrunden',
          ],
        },
        {
          name: 'Shop',
          price: 'ab CHF 9\'500',
          duration: '8 Wochen',
          items: [
            'Business plus Produktkatalog',
            'Zahlung (Stripe, Twint, Rechnung)',
            'Abo-Modelle',
            'Versand',
            'optional ERP-Anbindung',
          ],
        },
      ]}
      includes={[
        'Google Business Profile eingerichtet',
        'Impressum und Datenschutz nach revDSG',
        'SSL und Ladezeit unter 2 Sekunden',
        'Schulung per Video, aufgezeichnet',
        'Betreuung ab CHF 49 pro Monat',
      ]}
      note="Was Sie liefern: Logo, Texte oder Stichworte, Fotos. Keine Fotos? Ich vermittle einen Fotografen aus der Region."
      faq={[
        {
          question: 'Wie lange dauert es?',
          answer: 'Start 3 Wochen, Business 5 Wochen, Shop 8 Wochen ab Freigabe der Inhalte.',
        },
        {
          question: 'Kann ich selbst ändern?',
          answer: 'Ja, Texte, Bilder und Seiten im Admin, ohne Technik-Wissen.',
        },
        {
          question: 'Was kostet Hosting?',
          answer: 'Ab CHF 49 pro Monat inklusive Updates, Backups und kleinen Änderungen.',
        },
        {
          question: 'Muss ich die Texte selbst schreiben?',
          answer: 'Stichworte reichen. Ich formuliere aus, Sie geben frei.',
        },
        {
          question: 'Was ist mit meiner alten Domain?',
          answer: 'Bleibt. Ich übernehme den Umzug und richte Weiterleitungen ein.',
        },
      ]}
      ctaText="Zeigen Sie mir Ihre heutige Website. In 20 Minuten wissen Sie, welches Paket passt und wann sie online ist."
      ctaButton="Website in 20 Minuten besprechen"
      path="/webdesign"
      serviceName="Webdesign"
      servicePrice="2900"
      referencesTag="webdesign"
      referencesTitle="Referenzen aus dem Webdesign."
    />
  );
}
