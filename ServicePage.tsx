import { BadgeCheck, Check, ChevronDown, ExternalLink, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from './Seo';
import Aurora from '../motion/Aurora';
import MagneticButton from '../motion/MagneticButton';
import SplitText from '../motion/SplitText';
import SpotlightCard from '../motion/SpotlightCard';
import References from './References';
import type { ProjectTag } from '../../data/projects';

export interface ServicePackage {
  name: string;
  price: string;
  duration: string;
  featured?: boolean;
  items: string[];
  link?: string;
  buttonText?: string;
}

export interface MiniProduct {
  name: string;
  price: string;
  duration: string;
  link?: string;
}

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface ServiceExampleLine {
  label: string;
  value: string;
}

export interface ServiceExample {
  title?: string;
  lines: ServiceExampleLine[];
  total?: string;
}

export interface BeforeAfterPair {
  before: string;
  after: string;
  label?: string;
}

export interface ExampleCard {
  image?: string;
  title: string;
  link?: string;
  linkText?: string;
  externalUrl?: string;
  placeholder?: boolean;
}

export interface ProcessStep {
  num: string;
  title: string;
}

interface ServicePageProps {
  label: string;
  h1: string;
  subline: string;
  problems: string[];
  packages: ServicePackage[];
  includes: string[];
  example?: ServiceExample;
  exampleText?: string;
  note?: string;
  beforeAfter?: BeforeAfterPair[];
  miniProducts?: MiniProduct[];
  integrations?: string[];
  examples?: ExampleCard[];
  steps?: ProcessStep[];
  tech?: string[];
  faq: ServiceFaqItem[];
  ctaText: string;
  ctaButton: string;
  ctaLink?: string;
  title: string;
  metaDescription: string;
  path: string;
  serviceName?: string;
  servicePrice?: string;
  referencesTag?: ProjectTag;
  referencesTitle?: string;
}



export default function ServicePage({
  label,
  h1,
  subline,
  problems,
  packages,
  includes,
  example,
  exampleText,
  note,
  beforeAfter,
  miniProducts,
  integrations,
  examples,
  steps,
  tech,
  ctaLink = '/kontakt',
  faq,
  ctaText,
  ctaButton,
  title,
  metaDescription,
  path,
  serviceName,
  servicePrice,
  referencesTag,
  referencesTitle,
}: ServicePageProps) {
  return (
    <>
      <Seo
        title={title}
        description={metaDescription}
        path={path}
        serviceJsonLd={serviceName ? { name: serviceName, description: metaDescription, offers: { price: servicePrice ?? '', priceCurrency: 'CHF' } } : undefined}
        faq={faq}
      />

      {/* Hero */}
      <section data-no-reveal className="noise relative isolate -mt-20 overflow-hidden pt-32 sm:-mt-24 sm:pt-40">
        <Aurora density={45} />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 sm:px-8 sm:pb-24">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />{label}</p>
          <SplitText as="h1" text={h1} delay={0.15} className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl" />
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#A8B1C2] sm:text-lg">{subline}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <MagneticButton to={ctaLink}>{ctaButton}</MagneticButton>
            <MagneticButton href="/#referenzen" variant="ghost">Referenzen ansehen</MagneticButton>
          </div>
        </div>
      </section>

      {/* Probleme */}
      <section className="border-t border-white/[0.06] py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Probleme, die ich löse</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {problems.map(problem => (
              <div key={problem} className="flex items-start gap-3 rounded-xl border border-[#374151] bg-[#1F2937] p-5">
                <Check size={20} className="mt-0.5 shrink-0 text-[#2DD4BF]" />
                <p className="text-sm leading-6 text-[#E5E7EB]">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anbindungen */}
      {integrations && integrations.length > 0 && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Anbindungen, die ich kenne</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {integrations.map(item => (
                <span key={item} className="rounded-lg border border-[#374151] bg-[#1F2937] px-4 py-2 font-mono text-sm text-[#E5E7EB]">{item}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pakete */}
      <section className="border-t border-white/[0.06] py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Pakete</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map(pkg => (
              <SpotlightCard key={pkg.name} className={`h-full ${pkg.featured ? 'beam-border' : ''}`}>
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#E5E7EB]">{pkg.name}</h3>
                  {pkg.featured && (
                    <span className="rounded-md border border-[#2DD4BF]/40 px-2.5 py-1 font-mono text-xs text-[#2DD4BF]">Empfohlen</span>
                  )}
                </div>
                <p className="mt-4 font-mono text-3xl font-bold text-gradient">{pkg.price}</p>
                <p className="mt-1 text-sm text-[#9CA3AF]">{pkg.duration}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {pkg.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#9CA3AF]">
                      <Check size={16} className="mt-0.5 shrink-0 text-[#2DD4BF]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={pkg.link ?? '/kontakt'} className={`mt-6 inline-flex w-full justify-center rounded-full px-5 py-3 font-semibold transition-all ${pkg.featured ? 'bg-[#2DD4BF] text-[#06101A] hover:shadow-[0_0_30px_-6px_rgba(45,212,191,0.8)]' : 'border border-[#2DD4BF]/60 text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#06101A]'}`}>
                  {pkg.buttonText ?? 'Besprechen'}
                </Link>
              </div>
              </SpotlightCard>
            ))}
          </div>
          {miniProducts && miniProducts.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {miniProducts.map(mp => (
                <div key={mp.name} className="flex items-center justify-between gap-4 rounded-xl border border-[#374151] bg-[#1F2937] p-5">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-[#E5E7EB]">{mp.name}</h3>
                    <p className="mt-1 font-mono text-lg font-bold text-[#2DD4BF]">{mp.price}</p>
                    <p className="text-xs text-[#9CA3AF]">{mp.duration}</p>
                  </div>
                  <Link to={mp.link ?? '/kontakt'} className="shrink-0 rounded-lg border border-[#2DD4BF] px-4 py-2 text-sm font-semibold text-[#2DD4BF] transition-colors hover:bg-[#0F766E] hover:text-white">
                    Besprechen
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inklusive */}
      <section className="border-t border-white/[0.06] py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Inklusive</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {includes.map(item => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-[#374151] bg-[#1F2937] p-5">
                <BadgeCheck size={20} className="mt-0.5 shrink-0 text-[#2DD4BF]" />
                <p className="text-sm leading-6 text-[#E5E7EB]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rechenbeispiel Text */}
      {exampleText && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Rechenbeispiel</p>
            <div className="mt-6 max-w-2xl rounded-xl border border-[#374151] bg-[#1F2937] p-6">
              <p className="font-mono text-sm leading-7 text-[#E5E7EB]">{exampleText}</p>
            </div>
          </div>
        </section>
      )}

      {/* Rechenbeispiel Tabelle */}
      {example && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Rechenbeispiel</p>
            {example.title && <h3 className="mt-5 text-xl font-bold text-[#E5E7EB]">{example.title}</h3>}
            <div className="mt-6 max-w-md rounded-xl border border-[#374151] bg-[#1F2937] p-6 font-mono text-sm">
              {example.lines.map(line => (
                <div key={line.label} className="flex justify-between py-1">
                  <span className="text-[#9CA3AF]">{line.label}</span>
                  <span className="text-[#E5E7EB]">{line.value}</span>
                </div>
              ))}
              {example.total && (
                <div className="mt-3 flex justify-between border-t border-[#374151] pt-3 text-base font-bold">
                  <span className="text-[#9CA3AF]">Total</span>
                  <span className="text-[#2DD4BF]">{example.total}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Hinweis */}
      {note && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <div className="flex items-start gap-4 rounded-xl border border-[#374151] bg-[#1F2937] p-6">
              <Info size={22} className="mt-0.5 shrink-0 text-[#2DD4BF]" />
              <p className="text-sm leading-7 text-[#E5E7EB]">{note}</p>
            </div>
          </div>
        </section>
      )}

      {/* Vorher-Nachher */}
      {beforeAfter && beforeAfter.length > 0 && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Vorher-Nachher</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {beforeAfter.map((pair, index) => (
                <div key={index} className="space-y-3">
                  {pair.label && <p className="text-sm font-semibold text-[#E5E7EB]">{pair.label}</p>}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative overflow-hidden rounded-xl border border-[#374151] bg-[#1F2937]">
                      <img
                        src={pair.before}
                        alt="Vorher"
                        className="aspect-video w-full object-cover grayscale"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.img-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'img-fallback flex aspect-video w-full items-center justify-center text-xs text-[#9CA3AF]';
                            fallback.textContent = pair.before.split('/').pop() ?? '';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                      <span className="absolute left-2 top-2 rounded bg-[#0B0F1A]/80 px-2 py-0.5 font-mono text-xs text-[#9CA3AF]">Vorher</span>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-[#374151] bg-[#1F2937]">
                      <img
                        src={pair.after}
                        alt="Nachher"
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.img-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'img-fallback flex aspect-video w-full items-center justify-center text-xs text-[#9CA3AF]';
                            fallback.textContent = pair.after.split('/').pop() ?? '';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                      <span className="absolute left-2 top-2 rounded bg-[#2DD4BF]/20 px-2 py-0.5 font-mono text-xs text-[#2DD4BF]">Nachher</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technik */}
      {tech && tech.length > 0 && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Technik</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tech.map(t => (
                <span key={t} className="rounded-md border border-[#374151] px-3 py-1.5 font-mono text-xs text-[#9CA3AF]">{t}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Beispiele */}
      {examples && examples.length > 0 && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Beispiele</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {examples.map(ex => (
                <div key={ex.title} className="flex flex-col overflow-hidden rounded-xl border border-[#374151] bg-[#1F2937]">
                  <div className="relative aspect-video w-full overflow-hidden bg-[#1F2937]">
                    {ex.image && (
                      <img
                        src={ex.image}
                        alt={ex.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.img-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'img-fallback flex h-full w-full items-center justify-center text-xs text-[#9CA3AF]';
                            fallback.textContent = ex.image!.split('/').pop() ?? '';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-bold text-[#E5E7EB]">{ex.title}</h3>
                    {ex.placeholder && (
                      <p className="mt-3 text-sm text-[#9CA3AF]">{ex.linkText ?? 'Weiteres Beispiel folgt'}</p>
                    )}
                    {ex.link && !ex.placeholder && (
                      <Link to={ex.link} className="mt-3 text-sm font-semibold text-[#2DD4BF] transition-colors hover:text-[#0F766E]">
                        {ex.linkText ?? 'Ansehen'}
                      </Link>
                    )}
                    {ex.externalUrl && (
                      <a href={ex.externalUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2DD4BF] transition-colors hover:text-[#0F766E]">
                        {ex.linkText ?? 'Ansehen'} <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Referenzen */}
      {referencesTag && (
        <References filter={referencesTag} title={referencesTitle} />
      )}

      {/* Ablauf */}
      {steps && steps.length > 0 && (
        <section className="border-t border-white/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]"><span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />Ablauf</p>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              {steps.map(step => (
                <div key={step.num} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6">
                  <p className="font-mono text-2xl font-bold text-[#2DD4BF]">{step.num}</p>
                  <p className="mt-4 text-sm font-semibold text-[#E5E7EB]">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-white/[0.06] py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
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
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="border-t border-white/[0.06] py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <div className="rounded-2xl border border-[#2DD4BF]/40 bg-[#1F2937] px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="mx-auto max-w-2xl text-lg leading-7 text-[#E5E7EB]">{ctaText}</p>
            <Link to={ctaLink} className="mt-8 inline-flex rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white">
              {ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
