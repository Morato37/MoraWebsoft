export interface CvExperience {
  period: string;
  title: string;
  company: string;
  points: string[];
}

export interface CvEducation {
  year: string;
  title: string;
  school: string;
  note: string;
}

export interface CvTechGroup {
  label: string;
  items: string[];
}

export interface CvLanguage {
  language: string;
  level: string;
}

export const cvExperiences: CvExperience[] = [
  {
    period: '2023–heute',
    title: 'IT-Infrastruktur & Projektleitung',
    company: 'Enea GmbH, Rapperswil-Jona',
    points: [
      'Ganzheitliche M365-Administration, Hardware-Lifecycle und Abacus-ERP-Support',
      'Planung standortübergreifender Infrastruktur, Einführung von Intranet und Academy',
      'Cybersecurity-Strategie, Budgetverantwortung, Vendor Management (Salt, Abacus, Dropbox)',
    ],
  },
  {
    period: '2021–2023',
    title: 'Selbständiger Entwickler',
    company: 'Freiberuflich',
    points: [
      'Websites, Web-Apps und eine Android-App für Kunden aus Messe, Reisen und Handel',
    ],
  },
  {
    period: '2019–2021',
    title: 'Praktikant Entwicklung / Systemtest',
    company: 'dormakaba Schweiz AG, Wetzikon',
    points: [
      'C#/.NET-Entwicklung, Systemtests, Jira und Confluence',
    ],
  },
];

export const cvEducation: CvEducation[] = [
  {
    year: '2021',
    title: 'Informatiker EFZ Applikationsentwicklung',
    school: 'Bénédict Schule Zürich',
    note: 'Abschluss als Jahrgangsdritter',
  },
  {
    year: '2020',
    title: 'Cambridge Business English Certificate Higher (C2)',
    school: 'Cambridge Assessment',
    note: 'Note C',
  },
];

export const cvTechGroups: CvTechGroup[] = [
  {
    label: 'Entwicklung',
    items: ['React', 'TypeScript', 'Node.js', 'C#', 'ASP.NET', 'SQL', 'PostgreSQL', 'Supabase'],
  },
  {
    label: 'ERP & M365',
    items: ['Abacus AbaBau', 'Abea', 'AbaReport', 'DataAnalyzer', 'Microsoft 365', 'Power Automate'],
  },
  {
    label: 'Infrastruktur',
    items: ['VMware', 'Hardware-Lifecycle', 'Cybersecurity', 'Lizenzmanagement'],
  },
  {
    label: 'Tools',
    items: ['Jira', 'Confluence', 'AutoCAD', 'VectorWorks'],
  },
];

export const cvLanguages: CvLanguage[] = [
  { language: 'Deutsch', level: 'Muttersprache' },
  { language: 'Englisch', level: 'C2' },
];
