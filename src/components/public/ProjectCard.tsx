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
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#061225]/95 px-8 py-4">
              <div className="relative h-[190px] w-[108px] rounded-[22px] border-[3px] border-[#31445f] bg-[#07182d] p-1 shadow-[0_20px_50px_-16px_rgba(45,212,191,0.8)]">
                <div className="relative h-full overflow-hidden rounded-[16px] bg-[#0d223d]">
                  <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-white/20" />
                  <div className="flex items-center justify-between px-3 pt-2"><span className="text-[7px] font-semibold text-white">Messe</span><span className="h-2 w-2 rounded-full bg-[#2DD4BF]" /></div>
                  <div className="mt-2 px-2"><div className="rounded-lg border border-[#2DD4BF]/25 bg-[#123353] p-2"><div className="flex items-center justify-between"><span className="font-mono text-[6px] uppercase tracking-wider text-[#8fe8da]">Leads heute</span><BarChart3 size={10} className="text-[#2DD4BF]" /></div><p className="mt-1 font-mono text-lg font-bold text-white">42</p><div className="mt-1 h-1 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-[#2DD4BF]" /></div></div></div>
                  <div className="mt-2 px-2"><div className="mb-1 flex items-center justify-between"><span className="text-[6px] font-semibold text-white/70">Neue Kontakte</span><span className="text-[6px] text-[#2DD4BF]">Alle</span></div>{['M. Keller', 'A. Rossi', 'S. Meier'].map((name, index) => <div key={name} className="mb-1 flex items-center gap-1.5 rounded-md bg-white/[0.05] px-1.5 py-1"><span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#2DD4BF]/20 text-[6px] text-[#8fe8da]">{index + 1}</span><span className="truncate text-[6px] text-white/70">{name}</span><CheckCircle2 size={8} className="ml-auto text-[#2DD4BF]" /></div>)}</div>
                  <div className="absolute inset-x-2 bottom-2 flex items-center justify-around border-t border-white/10 pt-2 text-[#2DD4BF]"><Smartphone size={11} /><Users size={11} /><BarChart3 size={11} /></div>
                </div>
              </div>
              <div className="ml-5 hidden w-[130px] space-y-2 sm:block"><div className="font-mono text-[8px] uppercase tracking-[0.16em] text-cyan-200/60">Messe Leads</div><div className="grid grid-cols-2 gap-1.5"><span className="rounded-md bg-white/[0.06] px-2 py-2 text-center font-mono text-[10px] text-white">42</span><span className="rounded-md bg-white/[0.06] px-2 py-2 text-center font-mono text-[10px] text-white">86%</span></div><div className="h-1.5 rounded-full bg-cyan-300/15"><div className="h-full w-3/4 rounded-full bg-cyan-300" /></div><p className="text-[9px] leading-4 text-white/45">Erfassung direkt am Messestand</p></div>
            </div>
          )}
          {project.visual === 'nda' && (
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#061b20]/95 p-4">
              <div className="flex h-[190px] w-full max-w-[300px] overflow-hidden rounded-xl border border-[#2DD4BF]/25 bg-[#0b2428] shadow-[0_20px_50px_-16px_rgba(45,212,191,0.8)]">
                <div className="w-11 shrink-0 border-r border-white/10 bg-[#08191e] px-2 py-3"><div className="mx-auto flex h-6 w-6 items-center justify-center rounded-lg bg-[#2DD4BF]/15 text-[#2DD4BF]"><Lock size={12} /></div><div className="mt-5 space-y-3"><span className="block h-1.5 rounded-full bg-[#2DD4BF]/70" /><span className="block h-1.5 rounded-full bg-white/15" /><span className="block h-1.5 rounded-full bg-white/15" /><span className="block h-1.5 rounded-full bg-white/15" /></div></div>
                <div className="min-w-0 flex-1 p-3"><div className="flex items-center justify-between border-b border-white/10 pb-2"><div><p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#8fe8da]">Interne Plattform</p><p className="mt-1 text-[7px] text-white/40">Übersicht / Heute</p></div><span className="h-4 w-4 rounded-full bg-[#2DD4BF]/20" /></div><div className="mt-3 grid grid-cols-3 gap-1.5"><div className="rounded-md bg-white/[0.06] p-2"><Users size={10} className="text-[#2DD4BF]" /><p className="mt-1 text-[7px] text-white/45">Teams</p><p className="font-mono text-sm text-white">12</p></div><div className="rounded-md bg-white/[0.06] p-2"><CheckCircle2 size={10} className="text-[#2DD4BF]" /><p className="mt-1 text-[7px] text-white/45">Offen</p><p className="font-mono text-sm text-white">24</p></div><div className="rounded-md bg-white/[0.06] p-2"><BarChart3 size={10} className="text-[#2DD4BF]" /><p className="mt-1 text-[7px] text-white/45">Effizienz</p><p className="font-mono text-sm text-white">86%</p></div></div><div className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-2"><div className="flex items-end gap-1.5">{[35, 58, 44, 76, 62, 88, 70].map((height, index) => <span key={index} className="flex-1 rounded-t bg-[#2DD4BF]/70" style={{ height: `${height / 3}px` }} />)}</div><div className="mt-2 flex justify-between text-[6px] text-white/35"><span>Mo</span><span>Mi</span><span>Fr</span></div></div></div>
              </div>
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
