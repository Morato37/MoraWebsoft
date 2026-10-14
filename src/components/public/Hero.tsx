import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { useRef, type MouseEvent } from 'react';
import Aurora from '../motion/Aurora';
import MagneticButton from '../motion/MagneticButton';
import Marquee from '../motion/Marquee';
import SplitText from '../motion/SplitText';
import TypingLabel from './TypingLabel';
import PortraitCard from './PortraitCard';

const stack = ['Abacus', 'Bexio', 'Microsoft 365', 'Power Automate', 'Shopify', 'Stripe', 'Twint', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase'];

const codeLines = [
  { k: 'const', v: 'kunde = {' },
  { k: '  name:', v: '"Ihr Betrieb",' },
  { k: '  problem:', v: '"Doppelerfassung",' },
  { k: '  loesung:', v: 'await morawebsoft.build()', hl: true },
  { k: '}', v: '' },
  { k: '//', v: 'Status: Neue Projekte offen', dim: true },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 120, damping: 18 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 });

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="noise relative isolate -mt-20 overflow-hidden pt-28 sm:-mt-24 sm:pt-32">
      <Aurora />
      <div className="relative z-10 mx-auto grid max-w-[1240px] gap-12 px-6 pb-16 pt-6 sm:px-8 md:min-h-[calc(100vh-128px)] md:grid-cols-[1.15fr_0.85fr] md:items-center md:pb-24">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#2DD4BF]">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DD4BF]" /></span>
            <TypingLabel text="Web Engineering & Automation · Rüti ZH" />
          </motion.div>

          <SplitText
            as="h1"
            text="Software, die Ihrem Betrieb Stunden spart. Nicht Wochen kostet."
            highlight={['Stunden', 'spart']}
            delay={0.25}
            className="mt-7 max-w-3xl text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
          />

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }} className="mt-7 max-w-xl text-base leading-8 text-[#A8B1C2] sm:text-lg">
            Ich entwickle Web-Apps, Websites, Automatisierungen und Schnittstellen für KMU. Remote umgesetzt, persönlich besprochen, zum Festpreis.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <MagneticButton to="/kontakt">Erstgespräch anfragen <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></MagneticButton>
            <MagneticButton href="#leistungen" variant="ghost">Leistungen ansehen</MagneticButton>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#9CA3AF]">
            {['7 Referenzen online', 'Antwort innert 24 h', 'Abacus- & M365-Praxis aus eigener IT-Leitung'].map(t => (
              <li key={t} className="flex items-center gap-2"><Sparkles size={14} className="text-[#2DD4BF]" />{t}</li>
            ))}
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-md md:max-w-none" style={{ perspective: 1200 }}>
          <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="relative">
            <div className="beam-border rounded-3xl">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c1220]/90 shadow-[0_40px_120px_-30px_rgba(45,212,191,0.35)]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-xs text-[#6B7280]">morawebsoft.ts</span>
                </div>
                <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
                  <div className="p-5 font-mono text-[13px] leading-7 sm:p-6">
                    {codeLines.map((l, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + i * 0.12 }} className={`flex gap-2 ${l.dim ? 'text-[#6B7280]' : ''}`}>
                        <span className="w-6 select-none text-right text-[#4B5563]">{i + 1}</span>
                        <span className={l.hl ? 'text-[#2DD4BF]' : 'text-[#a78bfa]'}>{l.k}</span>
                        <span className={l.hl ? 'text-gradient-animated font-semibold' : 'text-[#E5E7EB]'}>{l.v}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 p-5 sm:border-l sm:border-t-0">
                    <PortraitCard size="sm" className="w-32 sm:w-36" />
                    <p className="mt-3 text-sm font-semibold text-white">Matteo Mora</p>
                    <p className="text-xs text-[#9CA3AF]">Entwickler & ehem. IT-Leiter</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-5 py-3 font-mono text-xs text-[#9CA3AF]">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#28c840]" />build: passing</span>
                  <span>CH · remote</span>
                </div>
              </div>
            </div>

            <motion.div style={{ x: tx, y: ty, translateZ: 60 }} className="float-slow absolute -left-6 top-10 hidden rounded-2xl border border-white/10 bg-[#0c1220]/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#9CA3AF]">Gespart / Jahr</p>
              <p className="text-xl font-bold text-gradient">130 h</p>
            </motion.div>
            <motion.div style={{ x: tx, y: ty, translateZ: 80 }} className="float-slow absolute -right-4 bottom-10 hidden rounded-2xl border border-white/10 bg-[#0c1220]/90 px-4 py-3 shadow-xl backdrop-blur sm:block" >
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#9CA3AF]">Offerte</p>
              <p className="text-xl font-bold text-white">innert 24 h</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-white/[0.06] py-5">
        <Marquee speed={38} items={stack.map(s => <span key={s} className="font-mono text-sm uppercase tracking-[0.2em] text-[#6B7280] transition-colors hover:text-[#2DD4BF]">{s}</span>)} />
      </div>

      <a href="#fuer-wen" aria-label="Weiter" className="scroll-hint absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 text-[#2DD4BF] md:block"><ChevronDown size={22} /></a>
    </section>
  );
}
