import { useEffect, useRef, useState } from 'react';
import { Layers, Cpu, Users, TrendingUp } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function About() {
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

  const stats = [
    { label: t('about.stat.years'), value: '6+' },
    { label: t('about.stat.tech'), value: '20+' },
    { label: t('about.stat.cert'), value: 'C2' },
    { label: t('about.stat.degree'), value: 'EFZ' },
  ];

  const pillars = [
    { icon: Cpu, title: t('about.pillar1.title'), desc: t('about.pillar1.desc') },
    { icon: Layers, title: t('about.pillar2.title'), desc: t('about.pillar2.desc') },
    { icon: TrendingUp, title: t('about.pillar3.title'), desc: t('about.pillar3.desc') },
    { icon: Users, title: t('about.pillar4.title'), desc: t('about.pillar4.desc') },
  ];

  return (
    <section id="about" ref={ref} className="py-28 relative">
      <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-cyan-500/4 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24 items-start">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-cyan-400 text-xs tracking-widest">{t('about.section')}</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
              {t('about.title1')}
              <br />
              <span className="text-white/20">{t('about.title2')}</span>
            </h2>

            <p className="text-white/50 leading-relaxed text-base mb-5">{t('about.p1')}</p>
            <p className="text-white/50 leading-relaxed text-base mb-10">{t('about.p2')}</p>

            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="glass-card border border-white/6 rounded-xl p-4 hover:border-cyan-400/20 hover:shadow-[0_0_25px_rgba(34,211,238,0.07)] transition-all duration-300 group"
                >
                  <div className="font-mono text-2xl font-bold text-gradient-cyan mb-1">{value}</div>
                  <div className="text-xs text-white/35">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {pillars.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`glass-card border border-white/6 rounded-xl p-5 hover:border-cyan-400/15 hover:shadow-[0_0_25px_rgba(34,211,238,0.07)] transition-all duration-300 group ${i === 0 ? 'sm:col-span-2 sm:flex sm:gap-5 sm:items-start' : ''}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/8 border border-cyan-400/15 flex items-center justify-center mb-3 group-hover:bg-cyan-400/12 transition-colors shrink-0">
                  <Icon size={17} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
