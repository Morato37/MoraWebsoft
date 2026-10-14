import { motion, useReducedMotion } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  highlight?: string[];
  as?: 'h1' | 'h2' | 'p';
}

export default function SplitText({ text, className = '', delay = 0, highlight = [], as = 'h1' }: SplitTextProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.045, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((word, i) => {
        const clean = word.replace(/[.,!?]/g, '');
        const hl = highlight.includes(clean);
        return (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] pr-[0.25em] align-top">
            <motion.span
              className={`inline-block ${hl ? 'text-gradient' : ''}`}
              variants={{
                hidden: { y: reduce ? 0 : '110%', rotate: reduce ? 0 : 6, opacity: 0 },
                show: { y: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
