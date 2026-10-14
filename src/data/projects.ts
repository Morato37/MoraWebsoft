export type ProjectTag = 'webengineering' | 'webdesign' | 'schnittstellen' | 'online-cv';

export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  projectTags: ProjectTag[];
  url?: string;
  image: string;
  nda?: boolean;
}

export const projects: Project[] = [
  {
    id: 'sammelkartenmesse',
    category: 'Website',
    title: 'Schweizer Sammelkartenmesse',
    description: 'Konzeption und Entwicklung der offiziellen Webpräsenz der Schweizer Sammelkartenmesse.',
    tags: ['React', 'Tailwind', 'Vite'],
    projectTags: ['webdesign'],
    url: 'https://schweizer-sammelkartenmesse.ch/',
    image: 'https://image.thum.io/get/width/1200/https://schweizer-sammelkartenmesse.ch/',
  },
  {
    id: 'landschaftsarchitekt',
    category: 'Website',
    title: 'Portfolio Landschaftsarchitekt',
    description: 'Moderne Portfolio-Website für einen Landschaftsarchitekten.',
    tags: ['React', 'Framer Motion', 'Vite'],
    projectTags: ['webdesign'],
    url: 'https://interactive-landscap-hz71.bolt.host/',
    image: 'https://image.thum.io/get/width/1200/https://interactive-landscap-hz71.bolt.host/',
  },
  {
    id: 'hotelplan',
    category: 'Android-App',
    title: 'Hotelplan Messe-App',
    description: 'Mobile Android-App für Messeeinsätze, inklusive Datenauswertung und Lead-Generierung.',
    tags: ['Android', 'Kotlin', 'Firebase'],
    projectTags: ['webengineering'],
    image: '/images/ref-hotelplan.jpg',
  },
  {
    id: 'b2b',
    category: 'B2B Web-Apps',
    title: 'Interne Business-Apps (NDA)',
    description: 'Firmeninterne Webapplikationen zur Prozessoptimierung. Unter Verschluss.',
    tags: ['React', 'Node.js', 'Supabase'],
    projectTags: ['webengineering', 'schnittstellen'],
    image: '/images/ref-b2b.jpg',
    nda: true,
  },
  {
    id: 'shop',
    category: 'Website & Shop',
    title: 'Firmenwebsite & Shop',
    description: 'Firmenwebsite mit integriertem Einzelhandels- und Abo-Shop. Vollständige E-Commerce-Lösung.',
    tags: ['Next.js', 'Stripe', 'Supabase'],
    projectTags: ['webdesign', 'schnittstellen'],
    url: 'https://kaleidoscopic-kitten-e2ec36.netlify.app/',
    image: 'https://image.thum.io/get/width/1200/https://kaleidoscopic-kitten-e2ec36.netlify.app/',
  },
  {
    id: 'it-dienstleister',
    category: 'Website',
    title: 'IT-Dienstleister-Website',
    description: 'Modular aufgebaut, vollständig im Admin bearbeitbar, Fokus auf Lead-Generierung.',
    tags: ['React', 'Tailwind', 'Supabase'],
    projectTags: ['webdesign', 'webengineering'],
    url: 'https://it-company.bolt.host/',
    image: 'https://image.thum.io/get/width/1200/https://it-company.bolt.host/',
  },
  {
    id: 'cv',
    category: 'Digitales CV',
    title: 'Digitales CV – IT Professional',
    description: 'Interaktives Online-Lebenslauf-Portfolio im Dark-Mode-Design.',
    tags: ['React', 'Framer Motion', 'Tailwind'],
    projectTags: ['online-cv'],
    url: 'https://it-professional-port-0nre.bolt.host/',
    image: 'https://image.thum.io/get/width/1200/https://it-professional-port-0nre.bolt.host/',
  },
];
