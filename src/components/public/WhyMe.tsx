import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '6+ Jahre', label: 'Entwicklung' },
  { value: '3 Jahre', label: 'IT-Leitung' },
  { value: '7', label: 'Referenzen online' },
];

export default function WhyMe() {
  return (
    <section className="border-t border-[#374151] py-12 sm:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 sm:px-8 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-[#E5E7EB] sm:text-4xl">
            Drei Jahre IT-Leitung in einem KMU. Ich kenne beide Seiten des Bildschirms.
          </h2>
          <p className="mt-6 text-base leading-7 text-[#9CA3AF]">
            Als Entwickler baue ich seit 2019 Web-Apps und Websites. Als IT-Verantwortlicher eines 100-Personen-Betriebs habe ich Abacus, M365, Budgets und Lieferanten gesteuert. Deshalb weiss ich, welche Lösung im Alltag hält, und welche nur in der Präsentation gut aussieht.
          </p>
          <Link to="/ueber-mich" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-[#2DD4BF] transition-colors hover:text-[#0F766E]">
            Mehr über mich <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="flex items-center justify-between rounded-xl border border-[#374151] bg-[#1F2937] px-6 py-5">
              <span className="text-2xl font-bold text-[#2DD4BF] sm:text-3xl">{stat.value}</span>
              <span className="text-sm text-[#9CA3AF]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
