import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, ChevronDown } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const typewriterPhrases = [
  'IT-Infrastruktur Experte.',
  'Projektleiter.',
  'B2B Sales Manager.',
  'Digital Transformer.',
];

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing');

  useEffect(() => {
    const phrase = phrases[phraseIdx];

    if (phase === 'typing') {
      if (text.length < phrase.length) {
        const t = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 65);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('pause'), 1800);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('deleting'), 400);
      return () => clearTimeout(t);
    }

    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 32);
        return () => clearTimeout(t);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setPhase('typing');
      }
    }
  }, [text, phase, phraseIdx, phrases]);

  return text;
}

function useReveal(delay = 0) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return visible;
}

export default function Hero() {
  const { t } = useLang();
  const typeText = useTypewriter(typewriterPhrases);

  const v0 = useReveal(100);
  const v1 = useReveal(260);
  const v2 = useReveal(460);
  const v3 = useReveal(660);
  const v4 = useReveal(860);
  const v5 = useReveal(1060);

  const scrollDown = () =>
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid pointer-events-none opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full pt-28 pb-20 z-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-20 items-center">
          <div>
            {/* Badge */}
            <div className={`flex items-center gap-3 mb-10 transition-all duration-700 ${v0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-400/20 text-cyan-400 font-mono text-xs tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {t('hero.badge')}
              </div>
            </div>

            {/* Name */}
            <div className={`transition-all duration-700 ${v1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-2">
                <span className="text-gradient-white">Matteo</span>
                <br />
                <span className="text-gradient-cyan">Mora</span>
              </h1>
            </div>

            {/* Typewriter */}
            <div className={`flex items-center gap-0 mt-7 mb-8 h-10 transition-all duration-700 ${v2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="font-mono text-xl sm:text-2xl font-semibold text-white/80 tracking-tight">
                {typeText}
              </span>
              <span className="typewriter-cursor ml-0.5" />
            </div>

            {/* Subtitle */}
            <div className={`transition-all duration-700 ${v3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-white/45 text-base leading-relaxed max-w-xl mb-10">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 ${v4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a
                href="mailto:matteo@morawebsoft.com"
                className="px-7 py-3.5 bg-cyan-400 text-[#05050f] text-sm font-mono font-bold rounded-lg hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('hero.cta.contact')}
              </a>
              <button
                onClick={() => document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 glass border border-white/10 text-white/70 text-sm font-mono rounded-lg hover:border-cyan-400/30 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('hero.cta.experience')}
              </button>
            </div>

            {/* Links */}
            <div className={`flex flex-wrap gap-6 transition-all duration-700 ${v5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { icon: Mail, label: 'matteo@morawebsoft.com', href: 'mailto:matteo@morawebsoft.com' },
                { icon: Phone, label: '076 776 49 65', href: 'tel:+41767764965' },
                { icon: MapPin, label: '8630 Rüti', href: null },
                { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/matteo-mora-13a639204/' },
              ].map(({ icon: Icon, label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/35 hover:text-cyan-400 transition-all duration-200 group"
                  >
                    <Icon size={13} className="group-hover:scale-110 transition-transform" />
                    <span className="font-mono">{label}</span>
                  </a>
                ) : (
                  <div key={label} className="flex items-center gap-2 text-sm text-white/35">
                    <Icon size={13} />
                    <span className="font-mono">{label}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right: photo + terminal */}
          <div className="hidden lg:flex flex-col items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-2xl scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden border border-white/8 glass-card">
                <img
                  src="/pb_cut.jpg"
                  alt="Matteo Mora"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050f]/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg" />
            </div>

            <div className="w-full glass-card border border-white/7 rounded-xl p-4 font-mono text-xs hover:border-cyan-400/15 transition-colors">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-white/20 text-[10px]">terminal</span>
              </div>
              <p className="text-white/20">{t('hero.terminal.whoami')}</p>
              <p className="text-cyan-400 font-semibold">matteo.mora</p>
              <p className="text-white/20 mt-2">{t('hero.terminal.role')}</p>
              <p className="text-emerald-400/90">{t('hero.terminal.roleValue')}</p>
              <p className="text-white/20 mt-2">{t('hero.terminal.ls')}</p>
              <p className="text-amber-400/80">Abacus  M365  C#</p>
              <p className="text-white/20 mt-2">{t('hero.terminal.abacus')}</p>
              <p className="text-white/45">{t('hero.terminal.abacusValue')}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-cyan-400">$</span>
                <span className="w-1.5 h-3.5 bg-cyan-400/80 animate-pulse ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 hover:text-cyan-400/60 transition-colors duration-300 animate-bounce z-10"
      >
        <span className="font-mono text-[10px] tracking-[0.3em]">{t('hero.scroll')}</span>
        <ChevronDown size={14} />
      </button>
    </section>
  );
}
