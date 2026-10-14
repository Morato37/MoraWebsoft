import { Globe, LayoutGrid, Repeat } from 'lucide-react';

const cards = [
  { icon: Repeat, text: 'Sie erfassen Bestellungen, Offerten oder Rapporte zweimal? Ich verbinde Ihre Systeme, damit Daten nur einmal eingegeben werden.' },
  { icon: Globe, text: 'Ihre Website bringt keine Anfragen? Ich baue eine, die auf dem Handy funktioniert, bei Google gefunden wird und Kunden zum Anruf bringt.' },
  { icon: LayoutGrid, text: 'Ihr Prozess läuft über Mail, Papier und Zuruf? Ich entwickle das Tool, das Ihr Team wirklich benutzt.' },
];

export default function ForWhom() {
  return (
    <section className="border-t border-[#374151] py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Für wen</p>
        <h2 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-[#E5E7EB] sm:text-4xl">
          Für Betriebe, die genug von Doppelerfassung, Excel-Listen und veralteten Websites haben.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, text }) => (
            <div key={text} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2DD4BF]/30 text-[#2DD4BF]">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <p className="mt-5 text-sm leading-7 text-[#9CA3AF]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
