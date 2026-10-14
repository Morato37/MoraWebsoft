import { useEffect, useState } from 'react';

interface TypingLabelProps {
  text: string;
  className?: string;
}

export default function TypingLabel({ text, className = '' }: TypingLabelProps) {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

    if (prefersReduced || isSmallScreen) {
      setDisplayed(text);
      return;
    }

    let index = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index += 1;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      <span className="typing-cursor" aria-hidden="true">|</span>
    </span>
  );
}
