import { ArrowRight } from 'lucide-react';
import Aurora from '../motion/Aurora';
import MagneticButton from '../motion/MagneticButton';
import Reveal from '../motion/Reveal';

export default function FinalCta() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <Reveal>
          <div className="beam-border rounded-3xl">
            <div className="noise relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#0c1220] px-6 py-16 text-center sm:px-12 sm:py-24">
              <Aurora density={35} className="opacity-80" />
              <div className="relative z-10">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF]">Bereit?</p>
                <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
                  Erzählen Sie mir in <span className="text-gradient-animated">20 Minuten</span>, wo es hängt.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#A8B1C2]">
                  Kostenlos, per Video, ohne Verkaufsdruck. Sie bekommen eine ehrliche Einschätzung und, wenn es passt, eine Offerte bis am nächsten Abend.
                </p>
                <div className="mt-9 flex justify-center">
                  <MagneticButton to="/kontakt">Anfrage senden <ArrowRight size={18} /></MagneticButton>
                </div>
                <p className="mt-8 text-sm text-[#9CA3AF]">
                  <a href="tel:0767764965" className="transition-colors hover:text-[#2DD4BF]">076 776 49 65</a>
                  {' · '}
                  <a href="mailto:matteo@morawebsoft.com" className="transition-colors hover:text-[#2DD4BF]">matteo@morawebsoft.com</a>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
