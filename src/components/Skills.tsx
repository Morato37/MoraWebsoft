import { useEffect, useRef, useState } from 'react';
import { Database } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const abacusCapabilityKeys = [
  'skills.abacus.cap1', 'skills.abacus.cap2', 'skills.abacus.cap3',
  'skills.abacus.cap4', 'skills.abacus.cap5', 'skills.abacus.cap6',
  'skills.abacus.cap7', 'skills.abacus.cap8', 'skills.abacus.cap9',
];

const categoryDefs = [
  {
    labelKey: 'skills.cat1',
    color: 'cyan',
    skillKeys: [
      'skills.cat1.s1', 'skills.cat1.s2', 'skills.cat1.s3', 'skills.cat1.s4',
      'skills.cat1.s5', 'skills.cat1.s6', 'skills.cat1.s7',
    ],
  },
  {
    labelKey: 'skills.cat2',
    color: 'blue',
    skillKeys: [
      'skills.cat2.s1', 'skills.cat2.s2', 'skills.cat2.s3',
      'skills.cat2.s4', 'skills.cat2.s5', 'skills.cat2.s6',
    ],
  },
  {
    labelKey: 'skills.cat3',
    color: 'emerald',
    skillKeys: [
      'skills.cat3.s1', 'skills.cat3.s2', 'skills.cat3.s3', 'skills.cat3.s4',
      'skills.cat3.s5', 'skills.cat3.s6', 'skills.cat3.s7',
    ],
  },
  {
    labelKey: 'skills.cat4',
    color: 'amber',
    skillKeys: ['skills.cat4.s1', 'skills.cat4.s2'],
  },
];

const colorMap: Record<string, { pill: string; label: string; glow: string; border: string }> = {
  cyan: {
    pill: 'bg-cyan-400/6 border-cyan-400/15 text-cyan-300/80 hover:bg-cyan-400/12 hover:border-cyan-400/35 hover:text-cyan-300',
    label: 'text-cyan-400',
    glow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.10)] hover:border-cyan-400/20',
    border: 'border-cyan-400/10',
  },
  blue: {
    pill: 'bg-blue-400/6 border-blue-400/15 text-blue-300/80 hover:bg-blue-400/12 hover:border-blue-400/35 hover:text-blue-300',
    label: 'text-blue-400',
    glow: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.10)] hover:border-blue-400/20',
    border: 'border-blue-400/10',
  },
  emerald: {
    pill: 'bg-emerald-400/6 border-emerald-400/15 text-emerald-300/80 hover:bg-emerald-400/12 hover:border-emerald-400/35 hover:text-emerald-300',
    label: 'text-emerald-400',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.10)] hover:border-emerald-400/20',
    border: 'border-emerald-400/10',
  },
  amber: {
    pill: 'bg-amber-400/6 border-amber-400/15 text-amber-300/80 hover:bg-amber-400/12 hover:border-amber-400/35 hover:text-amber-300',
    label: 'text-amber-400',
    glow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.10)] hover:border-amber-400/20',
    border: 'border-amber-400/10',
  },
};

type SkillBar = { label: string; value: number; gradient: string; delay: number };

const skillBars: SkillBar[] = [
  { label: 'Projektleitung',     value: 92, gradient: 'from-cyan-400 to-cyan-300',      delay: 0 },
  { label: 'IT-Infrastruktur',   value: 90, gradient: 'from-cyan-500 to-emerald-400',   delay: 100 },
  { label: 'Abacus ERP',         value: 88, gradient: 'from-amber-400 to-yellow-300',   delay: 200 },
  { label: 'M365 Administration',value: 85, gradient: 'from-blue-400 to-cyan-400',      delay: 300 },
  { label: 'B2B Sales',          value: 82, gradient: 'from-emerald-400 to-teal-300',   delay: 400 },
  { label: 'Digital Transformation', value: 80, gradient: 'from-cyan-400 to-blue-400', delay: 500 },
  { label: 'Vendor Management',  value: 78, gradient: 'from-slate-300 to-slate-200',    delay: 600 },
  { label: 'C# / .NET',          value: 65, gradient: 'from-violet-400 to-blue-400',    delay: 700 },
];

function ProgressBar({ bar, animate }: { bar: SkillBar; animate: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setWidth(bar.value), bar.delay + 80);
    return () => clearTimeout(t);
  }, [animate, bar]);

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-white/70 font-medium">{bar.label}</span>
        <span className="font-mono text-xs text-white/35 tabular-nums">{animate ? `${bar.value}%` : '0%'}</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar.gradient}`}
          style={{
            width: `${width}%`,
            transition: `width 1.1s cubic-bezier(0.22, 1, 0.36, 1)`,
            transitionDelay: `${bar.delay}ms`,
            boxShadow: width > 0 ? '0 0 10px rgba(34,211,238,0.35)' : 'none',
          }}
        />
        {/* Shimmer on the bar */}
        {width > 0 && (
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar.gradient} opacity-40`}
            style={{ width: `${width}%`, filter: 'blur(4px)', transitionDelay: `${bar.delay}ms` }}
          />
        )}
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [barsAnimate, setBarsAnimate] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBarsAnimate(true); },
      { threshold: 0.15 }
    );
    if (barsRef.current) obs.observe(barsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" ref={ref} className="py-28 relative">
      <div className="absolute left-0 top-1/2 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-cyan-400 text-xs tracking-widest">{t('skills.section')}</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-14 leading-tight">
          {t('skills.title1')}<span className="text-white/20">{t('skills.title2')}</span>
        </h2>

        {/* ── Skill Matrix (Progress Bars) ── */}
        <div
          ref={barsRef}
          className={`mb-8 glass-card border border-white/6 rounded-2xl p-7 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent rounded-t-2xl" />
          <p className="font-mono text-xs text-cyan-400 mb-6 tracking-widest uppercase">Skill Matrix</p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
            {skillBars.map((bar) => (
              <ProgressBar key={bar.label} bar={bar} animate={barsAnimate} />
            ))}
          </div>
        </div>

        {/* Abacus featured card */}
        <div
          className={`relative mb-5 glass-card border border-amber-400/20 rounded-2xl p-6 overflow-hidden transition-all duration-700 delay-100 hover:border-amber-400/35 hover:shadow-[0_0_50px_rgba(251,191,36,0.10)] hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transition: 'transform 0.3s ease, box-shadow 0.4s ease, border-color 0.3s ease, opacity 0.7s ease' }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          <div className="absolute -right-20 -top-20 w-56 h-56 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center">
                <Database size={22} className="text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs text-amber-400/70 tracking-widest uppercase">{t('skills.abacus.tag')}</span>
                  <span className="px-1.5 py-0.5 bg-amber-400/12 border border-amber-400/25 rounded text-amber-400 font-mono text-[10px]">{t('skills.abacus.featured')}</span>
                </div>
                <p className="font-bold text-white text-lg leading-tight">Abacus ERP</p>
                <p className="text-white/30 text-xs font-mono">{t('skills.abacus.sub')}</p>
              </div>
            </div>

            <div className="flex-1 sm:border-l sm:border-white/6 sm:pl-5">
              <p className="font-mono text-xs text-white/25 mb-3 uppercase tracking-widest">{t('skills.abacus.bereicheLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {abacusCapabilityKeys.map((key) => (
                  <span
                    key={key}
                    className="px-2.5 py-1 text-xs border rounded-lg glass border-amber-400/12 text-amber-300/75 hover:border-amber-400/35 hover:text-amber-300 transition-all cursor-default"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category pill cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryDefs.map((cat, i) => {
            const c = colorMap[cat.color];
            return (
              <div
                key={cat.labelKey}
                className={`relative glass-card border ${c.border} rounded-2xl p-5 transition-all duration-500 ${c.glow} hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${(i + 1) * 100}ms`, transition: 'transform 0.3s ease, box-shadow 0.4s ease, border-color 0.3s ease, opacity 0.5s ease' }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-t-2xl" />
                <p className={`font-mono text-xs ${c.label} mb-4 tracking-wide font-semibold`}>{t(cat.labelKey)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skillKeys.map((key) => (
                    <span
                      key={key}
                      className={`px-2.5 py-1 text-xs border rounded-lg transition-all duration-200 cursor-default ${c.pill}`}
                    >
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
