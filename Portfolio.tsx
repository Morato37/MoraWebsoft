import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Lock, FolderOpen } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

type Project = {
  titleKey: string;
  descKey: string;
  type: string;
  typeColor: 'cyan' | 'blue' | 'amber' | 'slate';
  link?: string;
  linkComingSoon?: boolean;
  nda?: boolean;
};

const projects: Project[] = [
  {
    titleKey: 'portfolio.p1.title',
    descKey: 'portfolio.p1.desc',
    type: 'Website',
    typeColor: 'cyan',
    link: 'https://schweizer-sammelkartenmesse.ch/',
  },
  {
    titleKey: 'portfolio.p2.title',
    descKey: 'portfolio.p2.desc',
    type: 'Website',
    typeColor: 'cyan',
    link: 'https://interactive-landscap-hz71.bolt.host/',
  },
  {
    titleKey: 'portfolio.p3.title',
    descKey: 'portfolio.p3.desc',
    type: 'Android App',
    typeColor: 'blue',
  },
  {
    titleKey: 'portfolio.p4.title',
    descKey: 'portfolio.p4.desc',
    type: 'B2B Web-Apps / Digitale Tools',
    typeColor: 'amber',
    nda: true,
  },
  {
    titleKey: 'portfolio.p5.title',
    descKey: 'portfolio.p5.desc',
    type: 'Website & Shop',
    typeColor: 'cyan',
    link: 'https://kaleidoscopic-kitten-e2ec36.netlify.app/',
  },
  {
    titleKey: 'portfolio.p6.title',
    descKey: 'portfolio.p6.desc',
    type: 'Website',
    typeColor: 'blue',
    link: 'https://it-company.bolt.host/',
  },
  {
    titleKey: 'portfolio.p7.title',
    descKey: 'portfolio.p7.desc',
    type: 'Digitales CV',
    typeColor: 'cyan',
    link: 'https://it-professional-port-0nre.bolt.host',
  },
];

const typeStyles: Record<string, string> = {
  cyan: 'text-cyan-400 bg-cyan-400/8 border-cyan-400/20',
  blue: 'text-blue-400 bg-blue-400/8 border-blue-400/20',
  amber: 'text-amber-400 bg-amber-400/8 border-amber-400/20',
  slate: 'text-slate-400 bg-slate-700/20 border-slate-600/20',
};

const glowStyles: Record<string, string> = {
  cyan: 'hover:border-cyan-400/35 hover:shadow-[0_0_40px_rgba(34,211,238,0.12),0_8px_32px_rgba(0,0,0,0.5)]',
  blue: 'hover:border-blue-400/30 hover:shadow-[0_0_40px_rgba(96,165,250,0.10),0_8px_32px_rgba(0,0,0,0.5)]',
  amber: 'hover:border-amber-400/30 hover:shadow-[0_0_40px_rgba(251,191,36,0.10),0_8px_32px_rgba(0,0,0,0.5)]',
  slate: 'hover:border-slate-500/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
};

const topLineStyles: Record<string, string> = {
  cyan: 'from-transparent via-cyan-400/30 to-transparent',
  blue: 'from-transparent via-blue-400/30 to-transparent',
  amber: 'from-transparent via-amber-400/30 to-transparent',
  slate: 'from-transparent via-slate-500/20 to-transparent',
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div
        className={`group relative flex flex-col h-full glass-card border border-white/6 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1.5 ${glowStyles[project.typeColor]}`}
        style={{ transition: 'transform 0.3s ease, box-shadow 0.4s ease, border-color 0.3s ease' }}
      >
        {/* Top shimmer line */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${topLineStyles[project.typeColor]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Glow blob */}
        <div className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          project.typeColor === 'cyan' ? 'bg-cyan-400/3' :
          project.typeColor === 'blue' ? 'bg-blue-400/3' :
          project.typeColor === 'amber' ? 'bg-amber-400/3' : ''
        } blur-xl`} />

        <div className="relative flex flex-col flex-1 p-6 gap-4">
          <div className="flex items-start justify-between gap-3">
            <span className={`font-mono text-xs px-2.5 py-1 rounded-md border ${typeStyles[project.typeColor]}`}>
              {project.type}
            </span>
            {project.nda && (
              <span className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md border text-amber-400/60 bg-amber-400/5 border-amber-400/15">
                <Lock size={9} />
                NDA
              </span>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white text-lg leading-snug mb-2.5 group-hover:text-white transition-colors">
              {t(project.titleKey)}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {t(project.descKey)}
            </p>
          </div>

          <div className="pt-4 border-t border-white/5">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono border transition-all duration-200 ${typeStyles[project.typeColor]} hover:bg-white/5`}
              >
                <ExternalLink size={12} />
                {t('portfolio.visit')}
              </a>
            ) : project.linkComingSoon ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono border border-white/8 text-white/20 cursor-not-allowed select-none">
                {t('portfolio.comingSoon')}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { t } = useLang();

  return (
    <section id="portfolio" className="py-28 relative">
      <div className="absolute left-1/4 top-1/2 w-[500px] h-[500px] bg-cyan-500/4 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-cyan-400 text-xs tracking-widest">{t('portfolio.section')}</span>
          <div className="h-px flex-1 bg-white/5 shimmer-line" />
        </div>
        <div className="flex items-end justify-between mb-14">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            {t('portfolio.title1')}<span className="text-white/20">{t('portfolio.title2')}</span>
          </h2>
          <FolderOpen size={28} className="text-white/8 hidden sm:block mb-2" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((p, i) => (
            <ProjectCard key={p.titleKey} project={p} index={i} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {projects.slice(3).map((p, i) => (
            <ProjectCard key={p.titleKey} project={p} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
