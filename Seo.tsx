import { useEffect } from 'react';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoOffer {
  name: string;
  price: string;
  priceCurrency?: string;
}

interface SeoProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  serviceJsonLd?: {
    name: string;
    description: string;
    offers: SeoOffer;
  };
  faq?: SeoFaqItem[];
}

const SITE_URL = 'https://morawebsoft.com';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

const DEFAULT_TITLE = 'Web-Apps, Websites & Automatisierung für KMU | Morawebsoft, Rüti ZH';
const DEFAULT_DESC = 'Morawebsoft entwickelt Web-Applikationen, Websites, Automatisierungen und Schnittstellen für KMU in der Deutschschweiz. Festpreise, direkter Draht zum Entwickler, Abacus- und M365-Praxis.';

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Morawebsoft',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Rüti',
    postalCode: '8630',
    addressCountry: 'CH',
  },
  telephone: '+41767764965',
  email: 'matteo@morawebsoft.com',
  url: SITE_URL,
  founder: { '@type': 'Person', name: 'Matteo Mora' },
  areaServed: 'Schweiz',
  priceRange: 'CHF 490–',
  openingHours: 'Mo-Fr 08:00-18:00',
  sameAs: ['https://www.linkedin.com/in/matteo-mora-13a639204/'],
};

export default function Seo({ title, description, path, noindex, serviceJsonLd, faq }: SeoProps) {
  const canonical = `${SITE_URL}${path}`;
  const ogImage = `${SITE_URL}/og-image.jpg`;

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setLink('canonical', canonical);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    if (serviceJsonLd) {
      setJsonLd('ld-service', {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: serviceJsonLd.name,
        description: serviceJsonLd.description,
        provider: { '@type': 'LocalBusiness', name: 'Morawebsoft' },
        offers: {
          '@type': 'Offer',
          price: serviceJsonLd.offers.price,
          priceCurrency: serviceJsonLd.offers.priceCurrency ?? 'CHF',
        },
      });
    } else {
      removeJsonLd('ld-service');
    }

    if (faq && faq.length > 0) {
      setJsonLd('ld-faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      });
    } else {
      removeJsonLd('ld-faq');
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('name', 'description', DEFAULT_DESC);
      removeJsonLd('ld-service');
      removeJsonLd('ld-faq');
    };
  }, [title, description, canonical, noindex, ogImage, serviceJsonLd, faq]);

  return null;
}
