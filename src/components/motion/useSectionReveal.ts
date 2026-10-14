import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Adds .in-view to every <section> and [data-reveal] in <main> once it scrolls into view. CSS does the animation. */
export default function useSectionReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>('main section:not([data-no-reveal]), main [data-reveal]'));
    if (reduce) { els.forEach(el => el.classList.add('in-view')); return; }
    els.forEach(el => el.classList.add('reveal-section'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
}
