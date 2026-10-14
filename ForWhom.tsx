import { Globe, LayoutGrid, Repeat } from 'lucide-react';
import SectionHeading from '../motion/SectionHeading';
import SpotlightCard from '../motion/SpotlightCard';
import { Stagger, StaggerItem } from '../motion/Reveal';

const cards = [
  { icon: Repeat, title: 'Zweimal erfasst?', text: 'Sie erfassen Bestellungen, Offerten oder Rapporte zweimal? Ich verbinde Ihre Systeme, damit Daten nur einmal eingegeben werden.', tag: 'Schnittstellen' },
  { icon: Globe, title: 'Keine Anfragen?', text: 'Ihre Website bringt keine Anfragen? Ich baue eine, die auf dem Handy funktioniert, bei Google gefunden wird und Kunden zum Anruf bringt.', tag: 'Webdesign' },
  { icon: LayoutGrid, title: 'Mail, Papier, Zuruf?', text: 'Ihr Prozess läuft über Mail, Papier und Zuruf? Ich entwickle das Tool, das Ihr Team wirklich benutzt.', tag: 'Web-App' },
];

export default function ForWhom() {
  return (
    <section id="fuer-wen" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <SectionHeading label="Für wen" title="Für Betriebe, die genug von Doppelerfassung, Excel-Listen und veralteten Websites haben." />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, text, tag }) => (
            <StaggerItem key={title} className="h-full">
              <SpotlightCard className="h-full">
                <div className="flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2DD4BF]/20 to-[#a78bfa]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">{tag}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-[#A8B1C2]">{text}</p>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
