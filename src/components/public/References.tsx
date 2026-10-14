import { projects, type ProjectTag } from '../../data/projects';
import ProjectCard from './ProjectCard';
import SectionHeading from '../motion/SectionHeading';
import { Stagger, StaggerItem } from '../motion/Reveal';

interface ReferencesProps { filter?: ProjectTag; title?: string; }

export default function References({ filter, title }: ReferencesProps) {
  const filtered = filter ? projects.filter(p => p.projectTags.includes(filter)) : projects;
  return (
    <section id="referenzen" className="relative scroll-mt-24 py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.12),transparent_60%)]" />
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <SectionHeading label="Referenzen" title={title ?? 'Gebaut für Betriebe aus Messe, Handel, Reisen, Architektur und IT.'} text="Jedes Projekt ist ein Unikat, entwickelt für den jeweiligen Kunden, nicht aus dem Baukasten." />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {filtered.map(project => (
            <StaggerItem key={project.id} className="h-full"><ProjectCard project={project} /></StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
