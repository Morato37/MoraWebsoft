import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

interface MagneticButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'ghost';
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, to, href, variant = 'primary', className = '', onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base = 'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-[box-shadow,color] duration-300 sm:text-base';
  const styles = variant === 'primary'
    ? 'bg-[#2DD4BF] text-[#06101A] shadow-[0_0_0_0_rgba(45,212,191,0)] hover:shadow-[0_0_40px_-4px_rgba(45,212,191,0.65)]'
    : 'border border-white/15 bg-white/[0.03] text-[#E5E7EB] backdrop-blur hover:border-[#2DD4BF]/60 hover:text-white';

  const inner = (
    <>
      {variant === 'primary' && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  const cls = `${base} ${styles} ${className}`;

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={reset} className="inline-block">
      {to ? (
        <Link to={to} className={cls} onClick={onClick}>{inner}</Link>
      ) : (
        <a href={href} className={cls} onClick={onClick}>{inner}</a>
      )}
    </motion.div>
  );
}
