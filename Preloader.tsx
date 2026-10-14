import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const words = ['Web-Apps', 'Websites', 'Automatisierung', 'Schnittstellen'];

export default function Preloader() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('mw-preloaded') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return true; }
  });
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      setWord(Math.min(words.length - 1, Math.floor(p * words.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setShow(false); try { sessionStorage.setItem('mw-preloaded', '1'); } catch { /* ignore */ } }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = ''; };
  }, [show]);

  useEffect(() => { if (!show) document.body.style.overflow = ''; }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070b14]"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div aria-hidden="true" className="aurora-blob aurora-1 opacity-40" />
          <div aria-hidden="true" className="aurora-blob aurora-2 opacity-40" />
          <div className="relative flex flex-col items-center">
            <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#22d3ee] text-3xl font-extrabold text-[#06101A] shadow-[0_0_60px_-10px_rgba(45,212,191,0.9)]">
              M
              <motion.span className="absolute inset-0 rounded-2xl border-2 border-[#2DD4BF]" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }} />
            </motion.div>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[#6B7280]">Morawebsoft</p>
            <div className="mt-3 h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p key={word} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.25 }} className="text-base font-semibold text-gradient">{words[word]}</motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-6 h-px w-48 overflow-hidden rounded bg-white/10">
              <motion.div className="h-full bg-gradient-to-r from-[#2DD4BF] to-[#a78bfa]" style={{ width: `${count}%` }} />
            </div>
            <p className="mt-3 font-mono text-xs tabular-nums text-[#2DD4BF]">{String(count).padStart(3, '0')}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
