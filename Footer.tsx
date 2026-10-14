import { Mail, Phone, MapPin, Linkedin, Terminal, ArrowUp } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer id="contact" className="relative border-t border-white/6 bg-[#05050f] overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="absolute left-1/2 bottom-0 w-[600px] h-[300px] bg-cyan-500/4 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-cyan-400 text-xs tracking-widest">{t('footer.section')}</span>
              <div className="h-px w-12 bg-white/8" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
              {t('footer.title1')}<span className="text-gradient-cyan">{t('footer.title2')}</span>
            </h2>
            <p className="text-white/35 text-sm leading-relaxed max-w-md mb-10">
              {t('footer.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:matteo@morawebsoft.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-[#05050f] text-sm font-mono font-bold rounded-lg hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Mail size={14} />
                {t('footer.email')}
              </a>
              <a
                href="tel:+41767764965"
                className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 text-white/60 text-sm font-mono rounded-lg hover:border-white/20 hover:text-white/90 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone size={14} />
                {t('footer.call')}
              </a>
            </div>
          </div>

          <button
            onClick={scrollTop}
            className="w-11 h-11 glass border border-white/10 rounded-xl flex items-center justify-center text-white/25 hover:border-cyan-400/30 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] transition-all duration-300 self-start mt-1"
          >
            <ArrowUp size={15} />
          </button>
        </div>

        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-cyan-400/8 border border-cyan-400/15 rounded-lg flex items-center justify-center">
              <Terminal size={12} className="text-cyan-400" />
            </div>
            <span className="font-mono text-sm text-white/25">
              Matteo Mora <span className="text-cyan-400/40 mx-1">·</span> IT-Infrastruktur & Projektleitung
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
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
                  className="flex items-center gap-1.5 text-xs text-white/25 hover:text-cyan-400 transition-colors font-mono group"
                >
                  <Icon size={11} className="group-hover:scale-110 transition-transform" />
                  {label}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-1.5 text-xs text-white/25 font-mono">
                  <Icon size={11} />
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
