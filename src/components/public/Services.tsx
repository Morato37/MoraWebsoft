import { ArrowUpRight, Code2, Monitor, Plug, User, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../motion/SectionHeading';
import SpotlightCard from '../motion/SpotlightCard';
import { Stagger, StaggerItem } from '../motion/Reveal';

const services = [
  { icon: Code2, num: '01', title: 'Webengineering', text: 'Web-Applikationen, Portale und interne Tools, die skalieren.', price: 'MVP in 6 Wochen ab CHF 9\'500', path: '/webengineering', span: 'lg:col-span-2' },
  { icon: Monitor, num: '02', title: 'Webdesign', text: 'Websites und Shops, die konvertieren und sich selbst pflegen lassen.', price: 'ab CHF 2\'900', path: '/webdesign', span: '' },
  { icon: Workflow, num: '03', title: 'Automatisierung', text: 'Repetitive Arbeit eliminieren mit Power Automate, Skripten und Workflows.', price: 'Prozess-Check CHF 490', path: '/automatisierung', span: '' },
  { icon: Plug, num: '04', title: 'Schnittstellen', text: 'Shop, Formular oder CRM mit Abacus, Bexio, M365, Stripe oder Shopify verbinden.', price: 'ab CHF 3\'900', path: '/schnittstellen', span: 'lg:col-span-2' },
  { icon: User, num: '05', title: 'Online-CV', text: 'Ihr Lebenslauf als eigene Website, die im Bewerbungsprozess auffällt.', price: 'CHF 490', path: '/online-cv', span: 'lg:col-span-3' },
];

export default function Services() {
  return (
    <section id="leistungen" className="relative py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent" />
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <SectionHeading label="Leistungen" title="Fünf Leistungen, ein Ansprechpartner." text="Keine Agentur-Zwischenstation. Sie sprechen mit dem, der baut." />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, num, title, text, price, path, span }) => (
            <StaggerItem key={path} className={`h-full ${span}`}>
              <Link to={path} className="block h-full">
                <SpotlightCard className="h-full">
                  <div className="flex h-full min-h-[220px] flex-col p-7">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/30 transition-all duration-500 group-hover:bg-[#2DD4BF] group-hover:text-[#06101A] group-hover:shadow-[0_0_30px_-6px_rgba(45,212,191,0.9)]">
                        <Icon size={22} strokeWidth={1.8} />
                      </div>
                      <span className="font-mono text-xs text-[#4B5563]">{num}</span>
                    </div>
                    <h3 className="mt-6 flex items-center gap-2 text-2xl font-bold text-white">{title}<ArrowUpRight size={18} className="text-[#2DD4BF] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" /></h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[#A8B1C2]">{text}</p>
                    <p className="mt-5 inline-flex w-fit rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/5 px-3 py-1 font-mono text-xs text-[#2DD4BF]">{price}</p>
                  </div>
                </SpotlightCard>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
