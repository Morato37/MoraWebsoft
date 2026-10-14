import Lenis from 'lenis';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SmoothScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => { cancelAnimationFrame(raf); lenis.destroy(); delete (window as unknown as { __lenis?: Lenis }).__lenis; };
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { setTimeout(() => (lenis ? lenis.scrollTo(el as HTMLElement, { offset: -80 }) : el.scrollIntoView()), 60); return; }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
