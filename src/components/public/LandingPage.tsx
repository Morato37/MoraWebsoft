import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import LeadForm from './LeadForm';
import Seo from './Seo';

export interface LandingPainPoint {
  icon: string;
  question: string;
}

export interface LandingFaqItem {
  question: string;
  answer: string;
}

export interface LandingTestimonial {
  quote: string;
  name: string;
  company: string;
}

interface LandingPageProps {
  slug: string;
  label: string;
  h1: string;
  subline: string;
  trustLine?: string;
  painPoints: LandingPainPoint[];
  offerItems: string[];
  price: string;
  duration: string;
  buttonText: string;
  screenshotSlug?: string;
  youtubeId?: string;
  exampleText: string;
  testimonial: LandingTestimonial;
  aboutText: string;
  faq: LandingFaqItem[];
  leistung: string;
  quelle: string;
  showForm: boolean;
  title: string;
  metaDescription: string;
  path: string;
  children?: ReactNode;
}



const painIcons: Record<string, typeof Check> = {
  mail: Check,
  copy: Check,
  clock: Check,
  users: Check,
  license: Check,
  csv: Check,
  stock: Check,
  click: Check,
  form: Check,
  missing: Check,
};

export default function LandingPage({
  slug,
  label,
  h1,
  subline,
  trustLine,
  painPoints,
  offerItems,
  price,
  duration,
  buttonText,
  screenshotSlug,
  youtubeId,
  exampleText,
  testimonial,
  aboutText,
  faq,
  leistung,
  quelle,
  showForm,
  title,
  metaDescription,
  path,
  children,
}: LandingPageProps) {
  const PrimaryButton = ({ className }: { className?: string }) => {
    return (
      <Link
        to="/kontakt"
        className={`inline-flex justify-center rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white ${className ?? ''}`}
      >
        {buttonText}
      </Link>
    );
  };

  return (
    <>
      <Seo title={title} description={metaDescription} path={path} faq={faq} />

      {/* Logo */}
      <a href="/" className="flex items-center gap-3 py-7 text-lg font-bold tracking-tight text-[#E5E7EB]" aria-label="Morawebsoft Startseite">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2DD4BF]/40 text-[#2DD4BF]">M</span>
        Morawebsoft
      </a>

      {/* Hero */}
      <section data-no-reveal className="relative py-12 sm:py-16"><div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(45,212,191,0.14),transparent_60%)] blur-2xl" />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">{label}</p>
        <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">{h1}</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#9CA3AF] sm:text-lg">{subline}</p>
        <div className="mt-8">
          <PrimaryButton />
        </div>
        {trustLine && (
          <p className="mt-4 text-sm text-[#9CA3AF]">{trustLine}</p>
        )}
      </section>

      {/* Schmerzpunkte */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Schmerzpunkte</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {painPoints.map(pp => {
            const Icon = painIcons[pp.icon] ?? Check;
            return (
              <div key={pp.question} className="flex flex-col gap-3 rounded-xl border border-[#374151] bg-[#1F2937] p-5">
                <Icon size={22} className="shrink-0 text-[#2DD4BF]" />
                <p className="text-sm leading-6 text-[#E5E7EB]">{pp.question}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Angebot */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Angebot</p>
        <div className="mt-8 max-w-2xl rounded-xl border border-[#2DD4BF]/60 bg-[#1F2937] p-6 sm:p-8">
          <ul className="space-y-3">
            {offerItems.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#E5E7EB]">
                <Check size={18} className="mt-0.5 shrink-0 text-[#2DD4BF]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-[#374151] pt-6">
            <p className="font-mono text-3xl font-bold text-[#2DD4BF]">{price}</p>
            <p className="mt-1 text-sm text-[#9CA3AF]">{duration}</p>
          </div>
          <div className="mt-6">
            <PrimaryButton />
          </div>
        </div>
      </section>

      {/* Screenshot / Video */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Vorschau</p>
        <div className="mt-8 overflow-hidden rounded-xl border border-[#374151] bg-[#1F2937]">
          {youtubeId ? (
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full border-0"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Vorschau"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full">
              <img
                src={`/images/${screenshotSlug ?? slug}.jpg`}
                alt="Vorschau"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.img-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'img-fallback flex aspect-video w-full items-center justify-center text-sm text-[#9CA3AF]';
                    fallback.textContent = 'Screenshot folgt';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Rechenbeispiel */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Rechenbeispiel</p>
        <div className="mt-6 max-w-2xl rounded-xl border border-[#374151] bg-[#1F2937] p-6">
          <p className="font-mono text-sm leading-7 text-[#E5E7EB]">{exampleText}</p>
        </div>
      </section>

      {/* Referenz */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Referenz</p>
        <figure className="mt-8 max-w-2xl rounded-xl border border-[#374151] bg-[#1F2937] p-6 sm:p-8">
          <blockquote className="text-lg leading-8 text-[#E5E7EB]">«{testimonial.quote}»</blockquote>
          <figcaption className="mt-5 text-sm text-[#9CA3AF]">
            <span className="font-semibold text-[#E5E7EB]">{testimonial.name}</span>
            <span className="mx-2 text-[#374151]">·</span>
            {testimonial.company}
          </figcaption>
        </figure>
      </section>

      {/* Über mich */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Über mich</p>
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="shrink-0">
            <div className="overflow-hidden rounded-xl border border-[#374151] bg-[#1F2937]">
              <img
                src="/pb_cut.jpg"
                alt="Matteo Mora"
                className="h-32 w-32 object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.img-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'img-fallback flex h-32 w-32 items-center justify-center text-xs text-[#9CA3AF]';
                    fallback.textContent = 'Matteo Mora';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm leading-7 text-[#9CA3AF]">{aboutText}</p>
            <Link to="/ueber-mich" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2DD4BF] transition-colors hover:text-[#0F766E]">
              Mehr über mich <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Fragen</p>
        <div className="mt-8 max-w-3xl space-y-3">
          {faq.map(item => (
            <details key={item.question} className="group rounded-xl border border-[#374151] bg-[#1F2937]">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-base font-semibold text-[#E5E7EB] [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown size={18} className="shrink-0 text-[#2DD4BF] transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-sm leading-7 text-[#9CA3AF]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {children}

      {/* Abschluss + Formular / Booking */}
      <section className="border-t border-white/[0.06] py-14 sm:py-16">
        <div className="mx-auto max-w-[800px] px-0">
          <div className="rounded-2xl border border-[#2DD4BF]/40 bg-[#1F2937] px-6 py-10 text-center sm:px-12 sm:py-14">
            <p className="mx-auto max-w-xl text-lg leading-7 text-[#E5E7EB]">
              {showForm ? 'Bereit zum Start? Schreiben Sie mir, ich melde mich innert 24 Stunden.' : 'Bereit zum Start? Wählen Sie Ihren Termin.'}
            </p>
            <div className="mt-6 flex justify-center">
              <PrimaryButton />
            </div>
          </div>

          {showForm && (
            <div className="mt-10">
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Formular</p>
              <LeadForm leistung={leistung} quelle={quelle} />
            </div>
          )}
        </div>
      </section>

      {/* Reduzierter Footer */}
      <div className="mt-auto border-t border-[#374151] py-6 text-sm text-[#9CA3AF]">
        Morawebsoft · Matteo Mora · 8630 Rüti ZH ·{' '}
        <Link to="/impressum" className="hover:text-[#2DD4BF]">Impressum</Link> ·{' '}
        <Link to="/datenschutz" className="hover:text-[#2DD4BF]">Datenschutz</Link>
      </div>
    </>
  );
}
