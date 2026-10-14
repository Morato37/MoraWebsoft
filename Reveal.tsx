import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'span';
}

export default function Reveal({ children, className = '', delay = 0, y = 32, once = true, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y, filter: reduce ? 'none' : 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once, margin: '-80px' }} variants={variants}>
      {children}
    </Tag>
  );
}

export function Stagger({ children, className = '', stagger = 0.09, once = true }: { children: ReactNode; className?: string; stagger?: number; once?: boolean }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
