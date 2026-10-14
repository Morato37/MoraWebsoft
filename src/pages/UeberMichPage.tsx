import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, ExternalLink, Linkedin } from 'lucide-react';
import { cvExperiences, cvEducation, cvTechGroups, cvLanguages } from '../data/cv';
import Seo from '../components/public/Seo';

export default function UeberMichPage() {
  return (
    <>
      <Seo
        title="Über Matteo Mora | Entwickler und ehem. IT-Leiter | Morawebsoft"
        description="Informatiker EFZ, seit 2019 in der Entwicklung, seit 2023 IT-Infrastruktur und Projektleitung mit Abacus, M365 und Budgetverantwortung."
        path="/ueber-mich"
      />

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 py-12 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_300px] md:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Über mich</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-[#E5E7EB] sm:text-5xl">
              Matteo Mora. Entwickler mit IT-Leitungs-Erfahrung.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#9CA3AF] sm:text-lg">
              Informatiker EFZ Applikationsentwicklung (Jahrgangsdritter), seit 2019 in der Entwicklung, seit 2023 IT-Infrastruktur und Projektleitung in einem KMU mit Abacus, M365 und Budgetverantwortung. Ich habe interne Tools gebaut, Intranet und Academy eingeführt, Lieferanten gesteuert und Cybersecurity verantwortet. Diese Erfahrung bringe ich in jedes Projekt: Ich frage zuerst nach dem Prozess, dann nach der Technik.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link to="/#referenzen" className="rounded-lg border border-[#2DD4BF] px-6 py-3 text-center font-semibold text-[#2DD4BF] transition-colors hover:bg-[#0F766E] hover:text-white">
                Referenzen ansehen
              </Link>
              <Link to="/kontakt" className="rounded-lg bg-[#2DD4BF] px-6 py-3 text-center font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white">
                Termin wählen
              </Link>
              <a
                href="https://www.linkedin.com/in/matteo-mora-13a639204/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#374151] px-6 py-3 text-center font-semibold text-[#9CA3AF] transition-colors hover:border-[#2DD4BF] hover:text-[#2DD4BF]"
              >
                <Linkedin size={18} /> LinkedIn <ExternalLink size={14} />
              </a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[300px]">
            <div className="overflow-hidden rounded-2xl border border-[#374151] bg-[#1F2937]">
              <img
                src="/pb_cut.jpg"
                alt="Matteo Mora, Informatiker EFZ und Entwickler"
                width={300}
                height={400}
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.img-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'img-fallback flex aspect-[3/4] w-full items-center justify-center text-sm text-[#9CA3AF]';
                    fallback.textContent = 'Matteo Mora';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Berufserfahrung */}
      <section className="border-t border-[#374151] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Berufserfahrung</p>
          <div className="mt-8 space-y-8">
            {cvExperiences.map(exp => (
              <div key={exp.period + exp.title} className="grid gap-4 md:grid-cols-[160px_1fr] md:gap-8">
                <p className="font-mono text-sm text-[#2DD4BF]">{exp.period}</p>
                <div className="border-l border-[#374151] pl-6">
                  <h3 className="text-lg font-bold text-[#E5E7EB]">{exp.title}</h3>
                  <p className="mt-1 text-sm text-[#9CA3AF]">{exp.company}</p>
                  <ul className="mt-4 space-y-2.5">
                    {exp.points.map(point => (
                      <li key={point} className="flex items-start gap-2 text-sm leading-6 text-[#9CA3AF]">
                        <ChevronRight size={16} className="mt-0.5 shrink-0 text-[#2DD4BF]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ausbildung */}
      <section className="border-t border-[#374151] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Ausbildung und Zertifikate</p>
          <div className="mt-8 space-y-6">
            {cvEducation.map(edu => (
              <div key={edu.year + edu.title} className="grid gap-4 md:grid-cols-[160px_1fr] md:gap-8">
                <p className="font-mono text-sm text-[#2DD4BF]">{edu.year}</p>
                <div className="border-l border-[#374151] pl-6">
                  <h3 className="text-base font-bold text-[#E5E7EB]">{edu.title}</h3>
                  <p className="mt-1 text-sm text-[#9CA3AF]">{edu.school}</p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">{edu.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech-Stack */}
      <section className="border-t border-[#374151] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Tech-Stack</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {cvTechGroups.map(group => (
              <div key={group.label}>
                <p className="text-sm font-bold text-[#E5E7EB]">{group.label}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <span key={item} className="rounded-md border border-[#374151] bg-[#1F2937] px-3 py-1.5 font-mono text-xs text-[#9CA3AF]">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sprachen */}
      <section className="border-t border-[#374151] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Sprachen</p>
          <div className="mt-8 flex flex-wrap gap-6">
            {cvLanguages.map(lang => (
              <div key={lang.language} className="rounded-xl border border-[#374151] bg-[#1F2937] px-6 py-4">
                <p className="text-base font-bold text-[#E5E7EB]">{lang.language}</p>
                <p className="mt-1 text-sm text-[#9CA3AF]">{lang.level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss */}
      <section className="border-t border-[#374151] py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <div className="rounded-2xl border border-[#2DD4BF]/40 bg-[#1F2937] px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="mx-auto max-w-2xl text-lg leading-7 text-[#E5E7EB]">
              Ich arbeite aus Rüti ZH, remote für die ganze Deutschschweiz. Zum Kickoff und zur Abnahme komme ich gerne vorbei.
            </p>
            <Link to="/kontakt" className="mt-8 inline-flex rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white">
              <Calendar size={20} className="mr-2" />
              Termin wählen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
