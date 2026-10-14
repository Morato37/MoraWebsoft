import { ExternalLink, Lock } from 'lucide-react';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#374151] bg-[#1F2937]">
      <div className="relative aspect-video w-full overflow-hidden bg-[#1F2937]">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.img-fallback')) {
              const fallback = document.createElement('div');
              fallback.className = 'img-fallback flex h-full w-full items-center justify-center text-sm text-[#9CA3AF]';
              fallback.textContent = project.image.split('/').pop() ?? '';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#2DD4BF]">{project.category}</p>
          {project.nda && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#374151] px-2 py-0.5 font-mono text-xs text-[#9CA3AF]">
              <Lock size={10} /> NDA
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-bold text-[#E5E7EB]">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-[#9CA3AF]">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="rounded-md border border-[#374151] px-2.5 py-1 font-mono text-xs text-[#9CA3AF]">{tag}</span>
          ))}
        </div>
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2DD4BF] transition-colors hover:text-[#0F766E]">
            Website besuchen <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
