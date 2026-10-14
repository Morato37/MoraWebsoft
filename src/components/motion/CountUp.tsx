import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function CountUp({ to, suffix = '', prefix = '', duration = 1.6, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: v => setVal(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return <span ref={ref} className={className}>{prefix}{val}{suffix}</span>;
}
