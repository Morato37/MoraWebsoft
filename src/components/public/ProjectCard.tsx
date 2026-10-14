import { BarChart3, CheckCircle2, ExternalLink, Lock, Smartphone, Users } from 'lucide-react';
import type { Project } from '../../data/projects';
import SpotlightCard from '../motion/SpotlightCard';

interface ProjectCardProps { project: Project; }

export default function ProjectCard({ project }: ProjectCardProps) {
  const inner = (
    <SpotlightCard className="h-full" tilt>
      <div className="flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c1220]">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (project.screenshot && target.src !== project.screenshot) { target.src = project.screenshot; return; }
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f1a2a] to-[#1a1033] font-mono text-xs text-[#6B7280]';
                fallback.textContent = project.title;
                parent.appendChild(fallback);
              }
            }}
          />
          {project.visual === 'app' && (
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#081426]/90 p-6">
              <div className="flex w-full max-w-[250px] gap-3 rounded-2xl border border-cyan-300/20 bg-[#102541] p-3 shadow-[0_18px_50px_-20px_rgba(45,212,191,0.8)]">
                <div className="flex w-12 shrink-0 flex-col items-center gap-3 rounded-xl bg-[#07182d] py-3 text-cyan-300"><Smartphone size={17} /><span className="h-12 w-1 rounded-full bg-cyan-300/30" /><span className="h-8 w-1 rounded-full bg-cyan-300/20" /></div>
                <div className="min-w-0 flex-1"><div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-200/70">Messe Leads</span><BarChart3 size={14} className="text-cyan-300" /></div><div className="mt-3 grid grid-cols-3 gap-1.5">{['42', '18', '86%'].map(value => <span key={value} className="rounded-md bg-white/[0.06] px-1.5 py-2 text-center font-mono text-[10px] text-white">{value}</span>)}</div><div className="mt-3 h-2 rounded-full bg-cyan-300/20"><div className="h-full w-3/4 rounded-full bg-cyan-300" /></div><div className="mt-2 h-2 w-4/5 rounded-full bg-white/10" /></div>
              </div>
            </div>
          )}
          {project.visual === 'nda' && (
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#071b20]/95 p-6">
              <div className="w-full max-w-[270px] rounded-2xl border border-[#2DD4BF]/25 bg-[#0d2a2e] p-4 shadow-[0_18px_50px_-20px_rgba(45,212,191,0.8)]"><div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8fe8da]">Interne Plattform</span><Lock size={14} className="text-[#2DD4BF]" /></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-lg bg-white/[0.06] p-3"><Users size={14} className="text-[#2DD4BF]" /><p className="mt-2 text-[10px] text-white/70">Teams</p><p className="mt-1 font-mono text-sm text-white">12</p></div><div className="rounded-lg bg-white/[0.06] p-3"><CheckCircle2 size={14} className="text-[#2DD4BF]" /><p className="mt-2 text-[10px] text-white/70">Prozesse</p><p className="mt-1 font-mono text-sm text-white">24</p></div></div><div className="mt-3 space-y-2">{[72, 48, 88].map(width => <div key={width} className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#2DD4BF]/70" style={{ width: `${width}%` }} /></div>)}</div></div>
            </div>
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-transparent to-transparent opacity-80" />
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#070b14]/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2DD4BF] backdrop-blur">{project.category}</span>
          {project.nda && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#070b14]/70 px-2.5 py-1 font-mono text-[10px] text-[#9CA3AF] backdrop-blur"><Lock size={10} /> NDA</span>}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-bold text-white">{project.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-[#A8B1C2]">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map(tag => <span key={tag} className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-[#9CA3AF]">{tag}</span>)}
          </div>
          {project.url && (
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2DD4BF]">
              Website besuchen <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          )}
        </div>
      </div>
    </SpotlightCard>
  );

  return project.url
    ? <a href={project.url} target="_blank" rel="noopener noreferrer" className="block h-full">{inner}</a>
    : <div className="h-full">{inner}</div>;
}
