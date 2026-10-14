import { ExternalLink, Lock } from 'lucide-react';
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
