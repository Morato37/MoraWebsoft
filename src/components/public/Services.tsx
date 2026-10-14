import { Code2, Monitor, Plug, User, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { icon: Code2, title: 'Webengineering', text: 'Web-Applikationen, Portale und interne Tools, die skalieren.', price: 'MVP in 6 Wochen ab CHF 9\'500', path: '/webengineering' },
  { icon: Monitor, title: 'Webdesign', text: 'Websites und Shops, die konvertieren und sich selbst pflegen lassen.', price: 'ab CHF 2\'900', path: '/webdesign' },
  { icon: Workflow, title: 'Automatisierung', text: 'Repetitive Arbeit eliminieren mit Power Automate, Skripten und Workflows.', price: 'Prozess-Check CHF 490', path: '/automatisierung' },
  { icon: Plug, title: 'Schnittstellen', text: 'Shop, Formular oder CRM mit Abacus, Bexio, M365, Stripe oder Shopify verbinden.', price: 'ab CHF 3\'900', path: '/schnittstellen' },
  { icon: User, title: 'Online-CV', text: 'Ihr Lebenslauf als eigene Website, die im Bewerbungsprozess auffällt.', price: 'CHF 490', path: '/online-cv' },
];

export default function Services() {
  return (
    <section id="leistungen" className="border-t border-[#374151] py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Leistungen</p>
        <h2 className="mt-5 text-3xl font-bold leading-tight text-[#E5E7EB] sm:text-4xl">Fünf Leistungen, ein Ansprechpartner.</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text, price, path }) => (
            <Link
              key={path}
              to={path}
              className="group flex flex-col rounded-xl border border-[#374151] bg-[#1F2937] p-6 transition-colors hover:border-[#2DD4BF]/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2DD4BF]/30 text-[#2DD4BF]">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#E5E7EB]">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#9CA3AF]">{text}</p>
              <p className="mt-4 font-mono text-sm text-[#2DD4BF]">{price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
