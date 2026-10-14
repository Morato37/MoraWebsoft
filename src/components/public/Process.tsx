import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FileCheck2, MessageSquare, Rocket, Wrench } from 'lucide-react';
import SectionHeading from '../motion/SectionHeading';
import Reveal from '../motion/Reveal';

const steps = [
  { icon: MessageSquare, num: '01', title: 'Gespräch', text: '20 Minuten per Video. Sie erzählen, wo es hängt. Ich sage, was möglich ist und was es kostet.', time: 'Tag 0' },
  { icon: FileCheck2, num: '02', title: 'Offerte', text: 'Innert 24 Stunden: Festpreis, Umfang, Termin. Keine Stundenschätzung, die sich verdoppelt.', time: 'Tag 1' },
  { icon: Wrench, num: '03', title: 'Umsetzung', text: 'Sie sehen jeden Zwischenstand online und geben Feedback, wann es Ihnen passt.', time: 'Woche 1–6' },
  { icon: Rocket, num: '04', title: 'Launch & Betreuung', text: 'Ich bleibe erreichbar. Hosting, Updates, Monitoring ab CHF 49 pro Monat.', time: 'Danach' },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  const scaleX = scaleY;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <SectionHeading label="So läuft es" title="Vier Schritte, keine Überraschungen." align="center" />
        <div ref={ref} className="relative mt-16">
          <div aria-hidden="true" className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-0 md:top-7 md:h-px md:w-full">
            <motion.div style={{ scaleY, scaleX }} className="h-full w-full origin-top bg-gradient-to-b from-[#2DD4BF] via-[#22d3ee] to-[#a78bfa] md:origin-left md:bg-gradient-to-r" />
          </div>
          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.12} className="relative pl-16 md:pl-0 md:pt-20">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-[#2DD4BF]/40 bg-[#070b14] text-[#2DD4BF] shadow-[0_0_30px_-8px_rgba(45,212,191,0.9)] md:left-1/2 md:top-1 md:-translate-x-1/2">
                  <s.icon size={20} strokeWidth={1.8} />
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-[#2DD4BF]/40 md:text-center">
                  <div className="flex items-center justify-between font-mono text-xs md:justify-center md:gap-3">
                    <span className="text-[#2DD4BF]">{s.num}</span>
                    <span className="text-[#6B7280]">{s.time}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A8B1C2]">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
