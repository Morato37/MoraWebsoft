interface LandingPlaceholderProps {
  title: string;
}

export default function LandingPlaceholder({ title }: LandingPlaceholderProps) {
  return (
    <section className="mx-auto max-w-[800px] px-0 py-12 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">// Landingpage</p>
      <h1 className="mt-5 text-4xl font-bold leading-tight text-[#E5E7EB] sm:text-6xl">{title}</h1>
      <p className="mt-6 text-base leading-7 text-[#9CA3AF]">Platzhalter für Inhalte.</p>
    </section>
  );
}
