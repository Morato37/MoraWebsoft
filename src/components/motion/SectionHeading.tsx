import Reveal from './Reveal';

interface SectionHeadingProps {
  label?: string;
  title: string;
  text?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({ label, title, text, align = 'left', className = '' }: SectionHeadingProps) {
  const center = align === 'center';
  return (
    <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {label && (
        <p className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#2DD4BF] ${center ? 'justify-center' : ''}`}>
          <span className="h-px w-8 bg-[#2DD4BF]/60" aria-hidden="true" />{label}
        </p>
      )}
      <h2 className="mt-5 text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-7 text-[#9CA3AF] sm:text-lg">{text}</p>}
    </Reveal>
  );
}
