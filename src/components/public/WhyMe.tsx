import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from '../motion/CountUp';
import Reveal from '../motion/Reveal';
import SectionHeading from '../motion/SectionHeading';

const stats = [
  { to: 6, suffix: '+', label: 'Jahre Entwicklung' },
  { to: 3, suffix: '', label: 'Jahre IT-Leitung' },
  { to: 7, suffix: '', label: 'Referenzen online' },
  { to: 24, suffix: ' h', label: 'bis zur Offerte' },
];

export default function WhyMe() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading label="Warum ich" title="Drei Jahre IT-Leitung in einem KMU. Ich kenne beide Seiten des Bildschirms." />
          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-8 text-[#A8B1C2]">
              Als Entwickler baue ich seit 2019 Web-Apps und Websites. Als IT-Verantwortlicher eines 100-Personen-Betriebs habe ich Abacus, M365, Budgets und Lieferanten gesteuert. Deshalb weiss ich, welche Lösung im Alltag hält, und welche nur in der Präsentation gut aussieht.
            </p>
            <Link to="/ueber-mich" className="group mt-7 inline-flex items-center gap-2 font-semibold text-[#2DD4BF]">
              Mehr über mich <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-[#2DD4BF]/40">
                <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#2DD4BF]/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                <p className="text-4xl font-extrabold tracking-tight text-gradient sm:text-5xl"><CountUp to={s.to} suffix={s.suffix} /></p>
                <p className="mt-2 text-sm text-[#9CA3AF]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
