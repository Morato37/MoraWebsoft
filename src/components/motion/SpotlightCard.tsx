import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
}

export default function SpotlightCard({ children, className = '', tilt = true, glow = true }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 20 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px);
    my.set(py);
    if (tilt && !window.matchMedia('(hover: none)').matches) {
      ry.set(((px / r.width) - 0.5) * 10);
      rx.set((0.5 - (py / r.height)) * 10);
    }
  };
  const onLeave = () => { mx.set(-400); my.set(-400); rx.set(0); ry.set(0); };

  const spot = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(45,212,191,0.18), transparent 70%)`;
  const border = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, rgba(45,212,191,0.9), rgba(255,255,255,0.08) 60%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`group relative rounded-2xl ${className}`}
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: border, WebkitMask: 'linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: 1 }} />
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f1522]/80 backdrop-blur-sm">
        {glow && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: spot }} />}
        <div className="relative h-full" style={{ transform: 'translateZ(20px)' }}>{children}</div>
      </div>
    </motion.div>
  );
}
