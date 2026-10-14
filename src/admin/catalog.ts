export type CatalogPriceType = 'fix' | 'ab' | 'monat' | 'jahr' | 'stunde' | 'tag' | 'stueck';

export interface DefaultCatalogItem {
  key: string;
  name: string;
  description: string;
  category: string;
  unit_price: number;
  price_type: CatalogPriceType;
  sort_order: number;
  active: boolean;
}

export const CATALOG_VERSION = 3;

export const CATALOG_CATEGORIES = [
  'Website', 'Onlineshop', 'Webengineering', 'Automatisierung', 'Schnittstellen',
  'Online-CV', 'Betreuung', 'Hosting & Domain', 'Design & Inhalte', 'Stundensätze',
] as const;

const BASE_CATALOG: DefaultCatalogItem[] = [
  { key: 'web-start', name: 'Website Start', unit_price: 2900, price_type: 'fix', sort_order: 10, category: 'Website', active: true, description: 'One-Pager oder bis 5 Seiten, responsive für Handy, Tablet und Desktop. Kontakt- oder Offertformular mit Spam-Schutz und Bestätigungsmail. Google Business Profile eingerichtet und verknüpft. Impressum und Datenschutzerklärung nach revDSG, SSL-Zertifikat, Ladezeit unter 2 Sekunden. SEO-Grundlagen: Seitentitel, Beschreibungen, Sitemap, Anmeldung bei Google. 1 Korrekturrunde, Schulung per Video. Online in 3 Wochen ab Erhalt der Inhalte (Logo, Texte oder Stichworte, Fotos).' },
  { key: 'web-start-gruender', name: 'Website Start (Gründer-Angebot)', unit_price: 2400, price_type: 'fix', sort_order: 11, category: 'Website', active: true, description: 'Gleicher Umfang wie Website Start, für Firmen im ersten Jahr nach der Gründung (Handelsregister-Eintrag).' },
  { key: 'web-business', name: 'Website Business', unit_price: 5900, price_type: 'ab', sort_order: 20, category: 'Website', active: true, description: 'Bis 10 Seiten, im Admin selbst bearbeitbar (Texte, Bilder, Seiten). Blog oder News-Bereich, Referenz- oder Projektgalerie. SEO-Grundlagen inklusive strukturierter Daten und Bildoptimierung. Kontakt- oder Offertformular mit Bestätigungsmail, Google Business Profile, Impressum und Datenschutz nach revDSG, SSL. 2 Korrekturrunden, Schulung per Video (aufgezeichnet). Online in 5 Wochen ab Freigabe der Inhalte. Richtpreis CHF 5\'900–8\'500 je nach Umfang.' },
  { key: 'web-landingpage', name: 'Landingpage', unit_price: 1200, price_type: 'fix', sort_order: 30, category: 'Website', active: true, description: 'Eine Angebotsseite ohne Navigation für Google Ads oder Kampagnen: Headline mit Nutzen, Angebot, Referenz, FAQ, Anfrageformular. Conversion-Tracking für Google Ads und Plausible eingerichtet.' },
  { key: 'web-zusatzseite', name: 'Zusätzliche Unterseite', unit_price: 290, price_type: 'stueck', sort_order: 40, category: 'Website', active: true, description: 'Weitere Unterseite im bestehenden Design, inklusive Einbau von Text und Bildern, Seitentitel und Beschreibung für Google.' },
  { key: 'web-sprache', name: 'Zweite Sprache', unit_price: 900, price_type: 'fix', sort_order: 50, category: 'Website', active: true, description: 'Mehrsprachige Struktur mit Sprachumschalter, Übernahme der gelieferten Übersetzungen auf allen Seiten, Sprach-Tags für Google. Übersetzung selbst nicht enthalten.' },
  { key: 'web-refresh', name: 'Website-Refresh', unit_price: 1500, price_type: 'ab', sort_order: 60, category: 'Website', active: true, description: 'Überarbeitung einer bestehenden Website ohne Neuentwicklung: modernes Erscheinungsbild, Handy-Darstellung, Ladezeit, Kontaktweg, Rechtliches. Umfang nach Website-Check.' },
  { key: 'shop', name: 'Onlineshop', unit_price: 9500, price_type: 'ab', sort_order: 10, category: 'Onlineshop', active: true, description: 'Website Business plus Shop: Produktkatalog mit Varianten und Lagerbestand, Zahlung mit Twint, Karte und auf Rechnung (Stripe), Abo-Modelle, Versandregeln Schweiz, Bestell- und Versandmails, Shop-Verwaltung im Admin. Rechtliches (AGB-Vorlage, Datenschutz, Impressum). Online in 8 Wochen ab Freigabe. Anbindung an Abacus oder Bexio separat.' },
  { key: 'shop-import', name: 'Produktimport (pro 100 Produkte)', unit_price: 290, price_type: 'stueck', sort_order: 20, category: 'Onlineshop', active: true, description: 'Übernahme von Produktdaten und Bildern aus Excel, CSV oder bestehendem Shop, inklusive Prüfung und Bereinigung.' },
  { key: 'app-mvp', name: 'Web-App MVP', unit_price: 9500, price_type: 'ab', sort_order: 10, category: 'Webengineering', active: true, description: 'Individuelle Web-Applikation in 6 Wochen: Konzept-Workshop (2 Stunden), Datenmodell, Login mit Rollen, 3–5 Kernfunktionen, responsive Oberfläche, Hosting in der Schweiz oder EU, Übergabe mit Schulung und Dokumentation. Code und Repository gehören dem Kunden.' },
  { key: 'app-sprint', name: 'Entwicklungs-Sprint (2 Wochen)', unit_price: 4800, price_type: 'fix', sort_order: 20, category: 'Webengineering', active: true, description: 'Weiterentwicklung im Sprint-Modell: fixer Umfang, festgelegt zu Beginn, Demo am Ende, jederzeit pausierbar.' },
  { key: 'auto-check', name: 'Prozess-Check remote', unit_price: 490, price_type: 'fix', sort_order: 10, category: 'Automatisierung', active: true, description: 'Vorbereitungs-Fragebogen, 2 Stunden Video-Call mit Bildschirmfreigabe, Bericht mit 3–5 Automatisierungen (je Ersparnis in Stunden pro Monat, Festpreis, Priorität), 30 Minuten Besprechung. Der Betrag wird beim ersten Auftrag aus dem Bericht vollständig angerechnet.' },
  { key: 'auto-offertformular', name: 'Offertformular ins ERP', unit_price: 1900, price_type: 'fix', sort_order: 20, category: 'Automatisierung', active: true, description: 'Webformular (neu oder bestehendes) wird an Abacus oder Bexio angebunden: Pflichtfelder und Prüfung, Adressabgleich gegen bestehende Kunden, Offerte oder Auftrag im ERP angelegt, automatische Bestätigungsmail, Fehlermeldung bei Störung, Dokumentation. Umsetzung in 10 Arbeitstagen ab ERP-Zugang.' },
  { key: 'auto-m365-onboarding', name: 'M365-Onboarding-Automatik', unit_price: 1500, price_type: 'fix', sort_order: 30, category: 'Automatisierung', active: true, description: 'HR-Formular (Microsoft Forms oder Lists) und Power-Automate-Flow mit Genehmigung: Konto, Lizenz, Gruppen, Teams-Kanäle, Signatur und Willkommensmail werden automatisch angelegt. Austritts-Flow mit Datensicherung, Protokoll jeder Aktion, Übergabe an die IT.' },
  { key: 'auto-rechnungslauf', name: 'Rechnungs- und Mahnlauf', unit_price: 2400, price_type: 'fix', sort_order: 40, category: 'Automatisierung', active: true, description: 'Automatische Erstellung und Versand von Rechnungen nach festgelegten Regeln, Zahlungsabgleich, Zahlungserinnerung und Mahnstufen, Übersicht offener Posten, Dokumentation.' },
  { key: 'auto-flow', name: 'Power-Automate-Flow', unit_price: 900, price_type: 'ab', sort_order: 50, category: 'Automatisierung', active: true, description: 'Einzelner Workflow in Microsoft 365 (z. B. Mail-Ablage, Freigabe, Benachrichtigung, Datenübertrag zwischen Listen), inklusive Fehlermeldung und Dokumentation. Umsetzung in 5 Arbeitstagen.' },
  { key: 'api-anbindung', name: 'Schnittstelle / Anbindung', unit_price: 3900, price_type: 'ab', sort_order: 10, category: 'Schnittstellen', active: true, description: 'Verbindung zwischen zwei Systemen (z. B. Shop, Formular oder CRM mit Abacus, Bexio, Microsoft 365, Stripe oder Shopify): Analyse der Datenfelder (1 Tag), Umsetzung mit Testumgebung, Abnahme mit echten Daten, Zwischenspeicher bei Ausfall, Monitoring mit Alarm, Dokumentation. Umsetzung in 3–6 Wochen.' },
  { key: 'api-shop-abacus', name: 'Shop-Bestellungen nach Abacus', unit_price: 3900, price_type: 'ab', sort_order: 20, category: 'Schnittstellen', active: true, description: 'Shopify oder WooCommerce an die Abacus-Auftragsbearbeitung: Kunde, Auftrag, Zahlungsstatus (Stripe, Twint, Rechnung), Lieferschein, Bestandsabgleich zurück in den Shop. Testlauf mit echten Bestellungen, Alarm bei Fehlern, Dokumentation.' },
  { key: 'api-tag', name: 'API-Entwicklung Tagespauschale', unit_price: 1050, price_type: 'tag', sort_order: 30, category: 'Schnittstellen', active: true, description: 'Entwicklung eigener REST- oder GraphQL-Schnittstellen, Authentifizierung, Dokumentation (OpenAPI) und Tests. Auch als White-Label für Agenturen und Softwarefirmen.' },
  { key: 'cv-standard', name: 'Digitales CV', unit_price: 490, price_type: 'fix', sort_order: 10, category: 'Online-CV', active: true, description: 'Lebenslauf als persönliche Website: Design hell oder dunkel mit Akzentfarbe nach Wahl, eigene Domain (auf den Namen des Kunden registriert), 1 Jahr Hosting, PDF-Export im gleichen Design, LinkedIn-Verknüpfung, 1 Korrekturrunde. Online in 5 Arbeitstagen ab vollständigen Unterlagen.' },
  { key: 'cv-student', name: 'Digitales CV (Lernende und Studierende)', unit_price: 290, price_type: 'fix', sort_order: 20, category: 'Online-CV', active: true, description: 'Gleicher Umfang wie Digitales CV, gegen Vorlage eines gültigen Lernenden- oder Studierendenausweises.' },
  { key: 'cv-sprache', name: 'CV in zweiter Sprache', unit_price: 150, price_type: 'fix', sort_order: 30, category: 'Online-CV', active: true, description: 'Zweite Sprachversion des Online-CV mit Sprachumschalter und eigenem PDF-Export. Übersetzung durch den Kunden oder nach Absprache.' },
  { key: 'cv-hosting', name: 'CV Hosting und Domain', unit_price: 60, price_type: 'jahr', sort_order: 40, category: 'Online-CV', active: true, description: 'Verlängerung von Hosting und Domain des Online-CV um ein Jahr, inklusive SSL.' },
  { key: 'cv-aenderung', name: 'CV-Änderungen', unit_price: 40, price_type: 'stunde', sort_order: 50, category: 'Online-CV', active: true, description: 'Inhaltliche Änderungen am Online-CV nach dem ersten Jahr (im ersten Jahr sind kleine Textänderungen kostenlos).' },
  { key: 'care-basis', name: 'Betreuung Basis', unit_price: 49, price_type: 'monat', sort_order: 10, category: 'Betreuung', active: true, description: 'Hosting, Sicherheits-Updates, tägliche Backups, SSL, bis 30 Minuten Änderungen pro Monat. Monatlich kündbar auf Monatsende.' },
  { key: 'care-plus', name: 'Betreuung Plus', unit_price: 99, price_type: 'monat', sort_order: 20, category: 'Betreuung', active: true, description: 'Wie Basis, zusätzlich Uptime-Monitoring mit Alarm, bis 1 Stunde Änderungen pro Monat, Reaktion innert 24 Stunden an Werktagen. Monatlich kündbar auf Monatsende.' },
  { key: 'care-pro', name: 'Betreuung Pro', unit_price: 149, price_type: 'monat', sort_order: 30, category: 'Betreuung', active: true, description: 'Wie Plus, zusätzlich Überwachung von Schnittstellen und Automatisierungen, bis 2 Stunden Änderungen pro Monat, Reaktion innert 4 Stunden an Werktagen. Monatlich kündbar auf Monatsende.' },
  { key: 'domain', name: 'Domain (.ch, .swiss, .com)', unit_price: 30, price_type: 'jahr', sort_order: 10, category: 'Hosting & Domain', active: true, description: 'Registrierung oder Verlängerung einer Domain auf den Namen des Kunden, DNS-Verwaltung.' },
  { key: 'hosting-only', name: 'Hosting ohne Betreuung', unit_price: 240, price_type: 'jahr', sort_order: 20, category: 'Hosting & Domain', active: true, description: 'Hosting der Website mit SSL und täglichen Backups, ohne Updates und ohne Änderungen.' },
  { key: 'hosting-app', name: 'Hosting Web-App / Datenbank', unit_price: 20, price_type: 'ab', sort_order: 30, category: 'Hosting & Domain', active: true, description: 'Server- und Datenbankkosten (Schweiz oder EU) für Web-Applikationen, transparent weiterverrechnet nach tatsächlicher Nutzung, pro Monat.' },
  { key: 'logo', name: 'Logo und Basis-CI', unit_price: 890, price_type: 'fix', sort_order: 10, category: 'Design & Inhalte', active: true, description: '3 Entwurfsansätze, 2 Korrekturrunden, Logo als Wort-, Bild- oder Kombinationsmarke (SVG, PNG, PDF), Farben und Schriften als Kurz-Styleguide, Visitenkarte und E-Mail-Signatur.' },
  { key: 'texte', name: 'Texterstellung pro Seite', unit_price: 150, price_type: 'stueck', sort_order: 20, category: 'Design & Inhalte', active: true, description: 'Texte für eine Webseite auf Basis eines kurzen Gesprächs oder Stichworten, für Google optimiert, 1 Korrekturrunde.' },
  { key: 'seo', name: 'SEO-Grundpaket', unit_price: 690, price_type: 'fix', sort_order: 30, category: 'Design & Inhalte', active: true, description: 'Technisches Audit, Keyword-Recherche für Region und Branche, Optimierung von Seitentiteln, Beschreibungen und Überschriften, Google Search Console und Plausible eingerichtet, Ausgangsbericht.' },
  { key: 'seo-ortsseite', name: 'Ortsseite für Google', unit_price: 390, price_type: 'stueck', sort_order: 40, category: 'Design & Inhalte', active: true, description: 'Eigene Seite für einen Ort oder eine Region (z. B. Webdesign Rapperswil-Jona) mit eigenständigem Text, lokaler Referenz und strukturierten Daten.' },
  { key: 'gbp', name: 'Google Business Profile einrichten', unit_price: 290, price_type: 'fix', sort_order: 50, category: 'Design & Inhalte', active: true, description: 'Profil anlegen oder übernehmen, Kategorien, Leistungen mit Preisen, Fotos, Öffnungszeiten, Verknüpfung mit der Website, Bewertungs-Link und QR-Aufsteller für den Empfang. In Website Start und Business bereits enthalten.' },
  { key: 'std-entwicklung', name: 'Entwicklung / Beratung', unit_price: 140, price_type: 'stunde', sort_order: 10, category: 'Stundensätze', active: true, description: 'Entwicklung, Beratung und Projektarbeit nach Aufwand, Abrechnung in 15-Minuten-Schritten.' },
  { key: 'std-schulung', name: 'Schulung', unit_price: 140, price_type: 'stunde', sort_order: 20, category: 'Stundensätze', active: true, description: 'Schulung per Video oder vor Ort, auf Wunsch aufgezeichnet. Vor Ort im Zürcher Oberland ohne Reisekosten.' },
];

const CATEGORY_DETAILS: Record<string, string> = {
  Website: 'Enthalten sind eine kurze gemeinsame Klärung der Ziele, die responsive Umsetzung für alle Bildschirmgrössen sowie eine verständliche Übergabe nach der Veröffentlichung.',
  Onlineshop: 'Dabei werden die wichtigsten Abläufe von Produktpflege bis Bestellung berücksichtigt und die Lösung so aufgebaut, dass sie später sauber erweitert werden kann.',
  Webengineering: 'Die Umsetzung erfolgt nachvollziehbar, wartbar und mit sauberer Trennung der wichtigsten Funktionen. Vor der Übergabe werden die zentralen Abläufe gemeinsam geprüft.',
  Automatisierung: 'Vor der Umsetzung werden die betroffenen Abläufe und Ausnahmen abgestimmt. Nach dem Test erhalten Sie eine kurze Dokumentation für den laufenden Betrieb.',
  Schnittstellen: 'Datenfelder, Fehlerfälle und Zuständigkeiten werden vorab geklärt. Die Verbindung wird mit realistischen Beispieldaten getestet und nachvollziehbar dokumentiert.',
  'Online-CV': 'Das Ergebnis ist für Mobilgeräte optimiert, leicht zu aktualisieren und auf einen professionellen Auftritt bei Bewerbungen, Kundenkontakten und Netzwerkgesprächen ausgelegt.',
  Betreuung: 'Die Leistungen werden transparent abgestimmt und nachvollziehbar dokumentiert. Nicht genutzte Zeit wird nicht stillschweigend durch zusätzliche Arbeiten ersetzt.',
  'Hosting & Domain': 'Die Einrichtung wird sauber dokumentiert, damit Zuständigkeiten, Laufzeiten und wichtige Zugangsinformationen auch später klar nachvollziehbar bleiben.',
  'Design & Inhalte': 'Die Inhalte werden auf Zielgruppe, Angebot und gewünschte Wirkung abgestimmt. Änderungen und Freigaben erfolgen in klaren, überschaubaren Schritten.',
  Stundensätze: 'Die Arbeit wird transparent in 15-Minuten-Schritten erfasst. Sie erhalten auf Wunsch eine kurze Zusammenfassung der erledigten Arbeiten und der nächsten sinnvollen Schritte.',
};

export const DEFAULT_CATALOG: DefaultCatalogItem[] = BASE_CATALOG.map(item => ({
  ...item,
  description: `${item.description} ${CATEGORY_DETAILS[item.category]}`,
}));

export function formatCatalogPrice(item: Pick<DefaultCatalogItem, 'unit_price' | 'price_type'>): string {
  const amount = `CHF ${String(item.unit_price).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
  return { fix: amount, ab: `ab ${amount}`, monat: `${amount} / Monat`, jahr: `${amount} / Jahr`, stunde: `${amount} / Std.`, tag: `${amount} / Tag`, stueck: `${amount} / Stück` }[item.price_type];
}
