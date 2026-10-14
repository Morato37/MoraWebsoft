import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Nav() {
  const { lang, toggle, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  const links = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.experience'), href: '#experience' },
    { label: t('nav.portfolio'), href: '#portfolio' },
    { label: t('nav.skills'), href: '#skills' },
    { label: t('nav.education'), href: '#education' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setActive(href);
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <button onClick={() => handleNav('#hero')} className="flex items-center group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 220 60"
            className="h-16 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
            aria-label="MoraWebsoft"
          >
            <rect x="2" y="8" width="44" height="44" rx="8" fill="none" stroke="#22d3ee" strokeWidth="2.5"/>
            <polyline points="10,42 20,18 30,36 40,22" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="42" r="2.5" fill="#22d3ee"/>
            <circle cx="40" cy="22" r="2.5" fill="#22d3ee"/>
            <text x="54" y="34" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="18" fill="#ffffff" letterSpacing="0.5">Mora</text>
            <text x="103" y="34" fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="18" fill="#22d3ee" letterSpacing="0.5">Websoft</text>
            <text x="54" y="46" fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="8" fill="#ffffff44" letterSpacing="2">DIGITAL SOLUTIONS</text>
          </svg>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className={`relative px-4 py-2 text-sm font-mono transition-all duration-200 rounded-lg ${
                active === l.href
                  ? 'text-cyan-400'
                  : 'text-white/45 hover:text-white/80'
              }`}
            >
              {active === l.href && (
                <span className="absolute inset-0 bg-cyan-400/8 rounded-lg border border-cyan-400/15" />
              )}
              <span className="relative">{l.label}</span>
            </button>
          ))}

          <button
            onClick={toggle}
            className="ml-3 px-3 py-2 font-mono text-sm glass border border-white/10 rounded-lg hover:border-white/20 transition-all flex items-center gap-1.5"
          >
            <span className={lang === 'de' ? 'text-white font-semibold' : 'text-white/30'}>DE</span>
            <span className="text-white/15">/</span>
            <span className={lang === 'en' ? 'text-white font-semibold' : 'text-white/30'}>EN</span>
          </button>

          <a
            href="mailto:matteo@morawebsoft.com"
            className="ml-2 px-5 py-2 text-sm font-mono border border-cyan-400/35 text-cyan-400 rounded-lg hover:bg-cyan-400/8 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
          >
            {t('nav.hire')}
          </a>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="px-3 py-1.5 font-mono text-xs glass border border-white/10 rounded-lg flex items-center gap-1"
          >
            <span className={lang === 'de' ? 'text-white' : 'text-white/30'}>DE</span>
            <span className="text-white/20">/</span>
            <span className={lang === 'en' ? 'text-white' : 'text-white/30'}>EN</span>
          </button>
          <button
            className="p-2 glass border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-b border-white/6 px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="text-left py-2.5 px-3 text-sm font-mono text-white/55 hover:text-cyan-400 hover:bg-white/3 rounded-lg transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
