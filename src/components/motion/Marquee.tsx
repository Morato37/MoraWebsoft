import type { ReactNode } from 'react';

interface MarqueeProps {
  items: ReactNode[];
  speed?: number;
  className?: string;
  reverse?: boolean;
}

export default function Marquee({ items, speed = 40, className = '', reverse = false }: MarqueeProps) {
  const row = [...items, ...items];
  return (
    <div className={`marquee-mask relative overflow-hidden ${className}`}>
      <div className="flex w-max gap-10 marquee-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        {row.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i >= items.length}>{item}</div>
        ))}
      </div>
    </div>
  );
}
