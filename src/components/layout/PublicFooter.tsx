import { ArrowUpRight, Linkedin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../../lib/analytics';

const services = [
  ['/webengineering', 'Webengineering'],
  ['/webdesign', 'Webdesign'],
  ['/automatisierung', 'Automatisierung'],
  ['/schnittstellen', 'Schnittstellen'],
  ['/online-cv', 'Online-CV'],
] as const;

export default function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(45,212,191,0.10),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-6 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">Morawebsoft</Link>
          <p className="mt-4 max-w-sm leading-7 text-[#A8B1C2]">Web-Apps, Websites und Automatisierung für KMU. Entwickelt in Rüti ZH, remote für die ganze Deutschschweiz.</p>
          <p className="mt-5 font-mono text-xs text-[#6B7280]">Morawebsoft · Matteo Mora · 8630 Rüti ZH</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]">Leistungen</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {services.map(([path, label]) => <Link key={path} to={path} className="group inline-flex items-center gap-1 text-[#A8B1C2] transition-colors hover:text-white">{label}<ArrowUpRight size={13} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" /></Link>)}
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]">Kontakt</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <a href="tel:0767764965" onClick={() => trackEvent('phone_click', { source: 'footer' })} className="flex items-center gap-3 text-[#A8B1C2] transition-colors hover:text-white"><Phone size={16} className="text-[#2DD4BF]" />076 776 49 65</a>
            <a href="mailto:matteo@morawebsoft.com" className="flex items-center gap-3 text-[#A8B1C2] transition-colors hover:text-white"><Mail size={16} className="text-[#2DD4BF]" />matteo@morawebsoft.com</a>
            <a href="https://www.linkedin.com/in/matteo-mora-13a639204/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#A8B1C2] transition-colors hover:text-white"><Linkedin size={16} className="text-[#2DD4BF]" />LinkedIn</a>
            <Link to="/kontakt" className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#2DD4BF]/50 px-5 py-2.5 font-semibold text-[#2DD4BF] transition-all hover:bg-[#2DD4BF] hover:text-[#06101A] hover:shadow-[0_0_30px_-6px_rgba(45,212,191,0.8)]">Anfrage senden</Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-6 py-5 text-sm text-[#6B7280] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 Morawebsoft</span>
          <span><Link to="/impressum" className="hover:text-[#2DD4BF]">Impressum</Link> · <Link to="/datenschutz" className="hover:text-[#2DD4BF]">Datenschutz</Link></span>
        </div>
      </div>
    </footer>
  );
}
