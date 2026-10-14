import { useEffect, useRef, useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

type JobDef = {
  periodKey: string;
  titleKey: string;
  companyKey: string;
  tag: 'current' | 'internship' | 'parttime' | 'freelance';
  color: string;
  parallel?: boolean;
  categories: { labelKey: string; itemKeys: string[] }[];
};

const jobDefs: JobDef[] = [
  {
    periodKey: 'exp.job1.period',
    titleKey: 'exp.job1.title',
    companyKey: 'exp.job1.company',
    tag: 'current',
    color: 'cyan',
    categories: [
      { labelKey: 'exp.job1.cat1', itemKeys: ['exp.job1.cat1.i1', 'exp.job1.cat1.i2', 'exp.job1.cat1.i3'] },
      { labelKey: 'exp.job1.cat2', itemKeys: ['exp.job1.cat2.i1', 'exp.job1.cat2.i2', 'exp.job1.cat2.i3'] },
      { labelKey: 'exp.job1.cat3', itemKeys: ['exp.job1.cat3.i1', 'exp.job1.cat3.i2', 'exp.job1.cat3.i3', 'exp.job1.cat3.i4'] },
      { labelKey: 'exp.job1.cat4', itemKeys: ['exp.job1.cat4.i1', 'exp.job1.cat4.i2'] },
    ],
  },
  {
    periodKey: 'exp.job1b.period',
    titleKey: 'exp.job1b.title',
    companyKey: 'exp.job1b.company',
    tag: 'freelance',
    color: 'green',
    categories: [
      { labelKey: 'exp.job1b.cat1', itemKeys: ['exp.job1b.cat1.i1', 'exp.job1b.cat1.i2', 'exp.job1b.cat1.i3'] },
    ],
  },
  {
    periodKey: 'exp.job3.period',
    titleKey: 'exp.job3.title',
    companyKey: 'exp.job3.company',
    tag: 'parttime',
    color: 'slate',
    parallel: true,
    categories: [
      { labelKey: 'exp.job3.cat1', itemKeys: ['exp.job3.cat1.i1', 'exp.job3.cat1.i2', 'exp.job3.cat1.i3'] },
    ],
  },
  {
    periodKey: 'exp.job2.period',
    titleKey: 'exp.job2.title',
    companyKey: 'exp.job2.company',
    tag: 'internship',
    color: 'blue',
    categories: [
      { labelKey: 'exp.job2.cat1', itemKeys: ['exp.job2.cat1.i1', 'exp.job2.cat1.i2', 'exp.job2.cat1.i3'] },
      { labelKey: 'exp.job2.cat2', itemKeys: ['exp.job2.cat2.i1', 'exp.job2.cat2.i2', 'exp.job2.cat2.i3'] },
    ],
  },
];

function JobCard({ job, index }: { job: JobDef; index: number }) {
  const { t } = useLang();
  const [open, setOpen] = useState(index === 0);
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

  const tagLabel = t(`exp.tag.${job.tag}`);

  const colors = {
    cyan:  { accent: 'border-cyan-400/25 hover:border-cyan-400/40', dot: 'bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.6)]', tag: 'text-cyan-400 bg-cyan-400/8 border-cyan-400/20', top: 'via-cyan-400/40' },
    blue:  { accent: 'border-blue-400/20 hover:border-blue-400/35', dot: 'bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.5)]', tag: 'text-blue-400 bg-blue-400/8 border-blue-400/20', top: 'via-blue-400/40' },
    green: { accent: 'border-emerald-400/20 hover:border-emerald-400/35', dot: 'bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.5)]', tag: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20', top: 'via-emerald-400/40' },
    slate: { accent: 'border-slate-600/25 hover:border-slate-500/35', dot: 'bg-slate-500', tag: 'text-slate-400 bg-slate-700/25 border-slate-600/25', top: 'via-slate-500/20' },
  };
  const c = colors[job.color as keyof typeof colors] ?? colors.slate;

  return (
    <div
      ref={ref}
      className={`relative flex gap-5 transition-all duration-700 ${job.parallel ? 'pl-8' : ''} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
      style={{ transitionDelay: `${index * 130}ms` }}
    >
      {job.parallel && (
        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center" style={{ width: '2rem' }}>
          <div className="w-px h-full bg-gradient-to-b from-emerald-400/25 via-emerald-400/10 to-transparent ml-auto mr-4" />
        </div>
      )}
      <div className="flex flex-col items-center shrink-0 pt-5">
        <div className={`w-3 h-3 rounded-full ${c.dot} z-10 shrink-0`} />
        <div className="w-px flex-1 bg-gradient-to-b from-white/8 to-transparent mt-2" />
      </div>

      <div className={`flex-1 mb-6 glass-card border rounded-2xl overflow-hidden transition-all duration-300 ${c.accent}`}>
        {/* Top accent line */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${c.top} to-transparent opacity-0 group-hover:opacity-100`} />

        <button
          className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-white/[0.015] transition-colors group"
          onClick={() => setOpen(!open)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`font-mono text-xs px-2.5 py-0.5 rounded-md border ${c.tag}`}>
                {tagLabel}
              </span>
              {job.parallel && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-md border text-emerald-400/50 bg-emerald-400/5 border-emerald-400/12">
                  parallel
                </span>
              )}
              <span className="font-mono text-xs text-white/25">{t(job.periodKey)}</span>
            </div>
            <h3 className="font-semibold text-white text-base leading-tight mb-0.5">{t(job.titleKey)}</h3>
            <p className="text-white/35 text-sm">{t(job.companyKey)}</p>
          </div>
          <div className="shrink-0 mt-1 text-white/25">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {open && (
          <div className="px-5 pb-5 border-t border-white/5 pt-4 grid sm:grid-cols-2 gap-5">
            {job.categories.map((cat) => (
              <div key={cat.labelKey}>
                <p className="font-mono text-xs text-white/25 mb-2.5 uppercase tracking-widest">{t(cat.labelKey)}</p>
                <ul className="space-y-2">
                  {cat.itemKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-xs text-white/50 leading-relaxed">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0 opacity-60" />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useLang();

  return (
    <section id="experience" className="py-28 relative">
      <div className="absolute right-0 top-1/3 w-[350px] h-[350px] bg-blue-500/4 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-cyan-400 text-xs tracking-widest">{t('exp.section')}</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="flex items-end justify-between mb-14">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            {t('exp.title1')}<span className="text-white/20">{t('exp.title2')}</span>
          </h2>
          <Briefcase size={28} className="text-white/8 hidden sm:block mb-2" />
        </div>

        <div className="max-w-3xl">
          {jobDefs.map((job, i) => (
            <JobCard key={job.titleKey} job={job} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
