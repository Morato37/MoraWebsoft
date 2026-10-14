import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Code2, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const services = [
  ['/webengineering', 'Webengineering', 'Web-Apps & Portale'],
  ['/webdesign', 'Webdesign', 'Websites & Shops'],
  ['/automatisierung', 'Automatisierung', 'Prozesse ohne Handarbeit'],
  ['/schnittstellen', 'Schnittstellen', 'Abacus, Bexio, Shopify'],
  ['/online-cv', 'Online-CV', 'Lebenslauf als Website'],
] as const;

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 text-sm transition-colors hover:text-white ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`;

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const ddRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setServicesOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 24));
  useEffect(() => { setOpen(false); setServicesOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${scrolled || open ? 'glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]' : 'border border-transparent'}`}>
          <Link to="/" className="group flex items-center gap-3 text-lg font-bold tracking-tight text-white">
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#2DD4BF] to-[#22d3ee] text-[#06101A] shadow-[0_0_24px_-4px_rgba(45,212,191,0.8)] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" aria-hidden="true">
              <Code2 size={18} strokeWidth={2.2} />
            </span>
            Morawebsoft
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <div ref={ddRef} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button type="button" onClick={() => setServicesOpen(v => !v)} className="flex items-center gap-1 py-1 text-sm text-[#9CA3AF] transition-colors hover:text-white" aria-expanded={servicesOpen}>
                Leistungen <ChevronDown size={14} className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full z-[70] w-72 -translate-x-1/2 pt-3"
                  >
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/[0.97] p-2 shadow-[0_24px_80px_-10px_rgba(0,0,0,0.85),0_0_0_1px_rgba(45,212,191,0.08)] backdrop-blur-xl">
                      {services.map(([path, label, sub]) => (
                        <Link key={path} to={path} onClick={() => setServicesOpen(false)} className="group/item flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-[#2DD4BF]/10">
                          <span>
                            <span className="block text-sm font-semibold text-white">{label}</span>
                            <span className="block text-xs text-[#9CA3AF]">{sub}</span>
                          </span>
                          <ArrowUpRight size={16} className="text-[#2DD4BF] opacity-0 transition-all group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/#referenzen" className="py-1 text-sm text-[#9CA3AF] transition-colors hover:text-white">Referenzen</Link>
            <NavLink to="/ueber-mich" className={navClass}>Über mich</NavLink>
            <NavLink to="/kontakt" className={navClass}>Kontakt</NavLink>
            <Link to="/kontakt" className="group relative ml-1 inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-[#2DD4BF] px-5 py-2.5 text-sm font-semibold text-[#06101A] transition-shadow hover:shadow-[0_0_30px_-4px_rgba(45,212,191,0.7)]">
              <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Erstgespräch anfragen</span>
            </Link>
          </nav>

          <button type="button" onClick={() => setOpen(v => !v)} className="rounded-xl border border-white/10 p-2 text-[#2DD4BF] md:hidden" aria-label={open ? 'Menü schliessen' : 'Menü öffnen'} aria-expanded={open}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-2 md:hidden"
          >
            <div className="glass max-h-[calc(100vh-110px)] overflow-y-auto rounded-2xl p-4">
              <p className="px-2 font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">Leistungen</p>
              <div className="mt-2 flex flex-col">
                {services.map(([path, label, sub], i) => (
                  <motion.div key={path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link to={path} className="flex items-center justify-between rounded-xl px-2 py-3 hover:bg-white/[0.05]">
                      <span><span className="block font-semibold text-white">{label}</span><span className="block text-xs text-[#9CA3AF]">{sub}</span></span>
                      <ArrowUpRight size={16} className="text-[#2DD4BF]" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-3">
                <Link to="/#referenzen" className="rounded-xl px-2 py-3 text-[#E5E7EB] hover:bg-white/[0.05]">Referenzen</Link>
                <Link to="/ueber-mich" className="rounded-xl px-2 py-3 text-[#E5E7EB] hover:bg-white/[0.05]">Über mich</Link>
                <Link to="/kontakt" className="rounded-xl px-2 py-3 text-[#E5E7EB] hover:bg-white/[0.05]">Kontakt</Link>
              </div>
              <Link to="/kontakt" className="mt-3 flex items-center justify-center rounded-full bg-[#2DD4BF] px-5 py-3.5 font-semibold text-[#06101A]">Erstgespräch anfragen</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
