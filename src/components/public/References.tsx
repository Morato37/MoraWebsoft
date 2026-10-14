import { projects, type ProjectTag } from '../../data/projects';
import ProjectCard from './ProjectCard';

interface ReferencesProps {
  filter?: ProjectTag;
  title?: string;
}

export default function References({ filter, title }: ReferencesProps) {
  const filtered = filter
    ? projects.filter(p => p.projectTags.includes(filter))
    : projects;

  return (
    <section id="referenzen" className="border-t border-[#374151] py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <h2 className="max-w-3xl text-3xl font-bold leading-tight text-[#E5E7EB] sm:text-4xl">
          {title ?? 'Gebaut für Betriebe aus Messe, Handel, Reisen, Architektur und IT.'}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
