import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Education() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = [
    {
      icon: GraduationCap,
      year: '2021',
      titleKey: 'edu.item1.title',
      subtitleKey: 'edu.item1.subtitle',
      institutionKey: 'edu.item1.institution',
      detailKey: 'edu.item1.detail',
      highlight: true,
    },
    {
      icon: Award,
      year: '2020',
      titleKey: 'edu.item2.title',
      subtitleKey: 'edu.item2.subtitle',
      institutionKey: 'edu.item2.institution',
      detailKey: 'edu.item2.detail',
      highlight: false,
    },
  ];

  return (
    <section id="education" ref={ref} className="py-28 relative">
      <div className="absolute left-1/2 top-0 w-[400px] h-[400px] bg-cyan-500/3 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-cyan-400 text-xs tracking-widest">{t('edu.section')}</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-14 leading-tight">
          {t('edu.title1')}<span className="text-white/20">{t('edu.title2')}</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          {items.map(({ icon: Icon, year, titleKey, subtitleKey, institutionKey, detailKey, highlight }, i) => (
            <div
              key={titleKey}
              className={`relative glass-card border rounded-2xl p-6 transition-all duration-700 hover:-translate-y-1.5 group ${
                highlight
                  ? 'border-cyan-400/20 hover:border-cyan-400/35 hover:shadow-[0_0_40px_rgba(34,211,238,0.10)]'
                  : 'border-white/6 hover:border-white/12 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
              } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 150}ms`, transition: 'transform 0.3s ease, box-shadow 0.4s ease, border-color 0.3s ease, opacity 0.7s ease' }}
            >
              {highlight && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-t-2xl" />
              )}

              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                  highlight ? 'bg-cyan-400/8 border-cyan-400/20' : 'bg-white/4 border-white/8'
                }`}>
                  <Icon size={18} className={highlight ? 'text-cyan-400' : 'text-white/35'} />
                </div>
                <span className={`font-mono text-xs px-2.5 py-1 rounded-lg border ${
                  highlight ? 'text-cyan-400 bg-cyan-400/8 border-cyan-400/20' : 'text-white/25 bg-white/4 border-white/8'
                }`}>
                  {year}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm mb-1.5">{t(titleKey)}</h3>
              <p className="text-white/40 text-xs mb-3">{t(subtitleKey)}</p>
              <p className="text-white/25 text-xs mb-3 font-mono">{t(institutionKey)}</p>

              <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg ${
                highlight ? 'text-amber-400 bg-amber-400/8 border border-amber-400/15' : 'text-white/25 bg-white/4 border border-white/8'
              }`}>
                <Award size={10} />
                {t(detailKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
