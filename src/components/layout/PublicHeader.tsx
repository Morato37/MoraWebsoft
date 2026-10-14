import { useState } from 'react';
import { ChevronDown, Code2, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const services = [
  ['/webengineering', 'Webengineering'],
  ['/webdesign', 'Webdesign'],
  ['/automatisierung', 'Automatisierung'],
  ['/schnittstellen', 'Schnittstellen'],
  ['/online-cv', 'Online-CV'],
] as const;

const navClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-[#2DD4BF] ${isActive ? 'text-[#2DD4BF]' : 'text-[#9CA3AF]'}`;

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeMenu = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="relative border-b border-[#374151] bg-[#0B0F1A]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 sm:px-8">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 text-lg font-bold tracking-tight text-[#E5E7EB]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2DD4BF]/40 text-[#2DD4BF]" aria-hidden="true">
            <Code2 size={18} strokeWidth={1.8} />
          </span>
          Morawebsoft
        </Link>

        <button type="button" onClick={() => setOpen(value => !value)} className="rounded-lg border border-[#374151] p-2 text-[#2DD4BF] md:hidden" aria-label={open ? 'Menü schliessen' : 'Menü öffnen'} aria-expanded={open}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

        <div className={`${open ? 'block' : 'hidden'} absolute left-0 right-0 top-[77px] z-30 border-b border-[#374151] bg-[#0B0F1A] px-6 py-6 md:static md:block md:border-0 md:bg-transparent md:p-0`}>
          <nav className="flex flex-col gap-5 text-sm md:flex-row md:items-center md:gap-7">
            <div className="relative">
              <button type="button" onClick={() => setServicesOpen(value => !value)} className="flex items-center gap-1 text-[#9CA3AF] transition-colors hover:text-[#2DD4BF]" aria-expanded={servicesOpen}>
                Leistungen <ChevronDown size={15} className={servicesOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              <div className={`${servicesOpen ? 'flex' : 'hidden'} mt-3 flex-col gap-3 border-l border-[#374151] pl-4 md:absolute md:left-0 md:top-7 md:mt-0 md:w-52 md:rounded-xl md:border md:bg-[#1F2937] md:p-3 md:pl-3`}>
                {services.map(([path, label]) => <Link key={path} to={path} onClick={closeMenu} className="text-sm text-[#9CA3AF] hover:text-[#2DD4BF]">{label}</Link>)}
              </div>
            </div>
            <Link to="/#referenzen" onClick={closeMenu} className="text-[#9CA3AF] transition-colors hover:text-[#2DD4BF]">Referenzen</Link>
            <NavLink to="/ueber-mich" onClick={closeMenu} className={navClass}>Über mich</NavLink>
            <NavLink to="/kontakt" onClick={closeMenu} className={navClass}>Kontakt</NavLink>
            <Link to="/kontakt" onClick={closeMenu} className="rounded-lg bg-[#2DD4BF] px-5 py-3 text-center font-semibold text-[#0B0F1A] transition-colors hover:bg-[#0F766E] hover:text-white md:ml-2">Erstgespräch buchen</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
