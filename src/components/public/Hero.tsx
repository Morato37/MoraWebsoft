import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeCard from './CodeCard';
import TypingLabel from './TypingLabel';

export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-77px)] max-w-[1200px] flex-col items-start px-6 py-12 sm:px-8 md:min-h-[calc(100vh-77px)] md:flex-row md:items-center md:gap-12 md:py-20">
      <div className="flex-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">
          <TypingLabel text="Web Engineering & Automation · Rüti ZH" />
        </p>
        <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-[#E5E7EB] sm:text-5xl lg:text-6xl">
          Software, die Ihrem Betrieb Stunden spart. Nicht Wochen kostet.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#9CA3AF] sm:text-lg">
          Ich entwickle Web-Apps, Websites, Automatisierungen und Schnittstellen für KMU. Remote umgesetzt, persönlich besprochen, zum Festpreis.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link to="/kontakt" className="rounded-lg bg-[#2DD4BF] px-6 py-3 text-center font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white">
            Erstgespräch buchen (20 Min., kostenlos)
          </Link>
          <a href="#leistungen" className="rounded-lg border border-[#2DD4BF] px-6 py-3 text-center font-semibold text-[#2DD4BF] transition-colors hover:bg-[#0F766E] hover:text-white">
            Leistungen ansehen
          </a>
        </div>
        <p className="mt-6 text-sm text-[#9CA3AF]">
          7 Referenzen online · Antwort innert 24 h · Abacus- und M365-Praxis aus eigener IT-Leitung
        </p>
      </div>

      <div className="mt-10 w-full max-w-sm md:mt-0 md:flex-1">
        <div className="overflow-hidden rounded-2xl border border-[#374151] bg-[#1F2937]">
          <img
            src="/images/matteo.jpg"
            alt="Matteo Mora"
            className="aspect-[4/5] w-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback flex aspect-[4/5] w-full items-center justify-center text-sm text-[#9CA3AF]';
                fallback.textContent = 'matteo.jpg';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
        <div className="mt-4">
          <CodeCard entries={[
            { key: 'name', value: 'Matteo Mora' },
            { key: 'role', value: 'Entwickler & ehem. IT-Leiter' },
            { key: 'stack', value: 'React, Node, Abacus, M365' },
            { key: 'status', value: 'Neue Projekte: offen' },
          ]} />
        </div>
      </div>
    </section>
  );
}
