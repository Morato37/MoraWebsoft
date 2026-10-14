import { Linkedin, Mail, Phone } from 'lucide-react';
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
    <footer className="border-t border-[#374151] bg-[#0B0F1A]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <Link to="/" className="text-xl font-bold text-[#E5E7EB]">Morawebsoft</Link>
          <p className="mt-5 max-w-xs leading-7 text-[#9CA3AF]">Web-Apps, Websites und Automatisierung für KMU.</p>
          <p className="mt-5 text-sm text-[#9CA3AF]">Morawebsoft · Matteo Mora · 8630 Rüti ZH</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">Leistungen</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {services.map(([path, label]) => <Link key={path} to={path} className="text-[#9CA3AF] transition-colors hover:text-[#2DD4BF]">{label}</Link>)}
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">Kontakt</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <a href="tel:0767764965" onClick={() => trackEvent('phone_click', { source: 'footer' })} className="flex items-center gap-3 text-[#9CA3AF] hover:text-[#2DD4BF]"><Phone size={16} />076 776 49 65</a>
            <a href="mailto:matteo@morawebsoft.com" className="flex items-center gap-3 text-[#9CA3AF] hover:text-[#2DD4BF]"><Mail size={16} />matteo@morawebsoft.com</a>
            <a href="https://www.linkedin.com/in/matteo-mora-13a639204/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#9CA3AF] hover:text-[#2DD4BF]"><Linkedin size={16} />LinkedIn</a>
            <Link to="/kontakt" className="mt-3 inline-flex w-fit rounded-lg border border-[#2DD4BF] px-5 py-3 font-semibold text-[#2DD4BF] transition-colors hover:bg-[#0F766E] hover:text-white">Termin wählen</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#374151]">
        <div className="mx-auto max-w-[1200px] px-6 py-5 text-sm text-[#9CA3AF] sm:px-8">© 2026 Morawebsoft · <Link to="/impressum" className="hover:text-[#2DD4BF]">Impressum</Link> · <Link to="/datenschutz" className="hover:text-[#2DD4BF]">Datenschutz</Link></div>
      </div>
    </footer>
  );
}
