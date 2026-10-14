const steps = [
  { num: '01', title: 'Gespräch', text: '20 Minuten per Video. Sie erzählen, wo es hängt. Ich sage, was möglich ist und was es kostet.' },
  { num: '02', title: 'Offerte', text: 'Innert 24 Stunden: Festpreis, Umfang, Termin. Keine Stundenschätzung, die sich verdoppelt.' },
  { num: '03', title: 'Umsetzung', text: 'Sie sehen jeden Zwischenstand online und geben Feedback, wann es Ihnen passt.' },
  { num: '04', title: 'Launch und Betreuung', text: 'Ich bleibe erreichbar. Hosting, Updates, Monitoring ab CHF 49 pro Monat.' },
];

export default function Process() {
  return (
    <section className="border-t border-[#374151] py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <h2 className="text-3xl font-bold leading-tight text-[#E5E7EB] sm:text-4xl">Vier Schritte, keine Überraschungen.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map(step => (
            <div key={step.num} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6">
              <p className="font-mono text-2xl font-bold text-[#2DD4BF]">{step.num}</p>
              <h3 className="mt-4 text-lg font-bold text-[#E5E7EB]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
