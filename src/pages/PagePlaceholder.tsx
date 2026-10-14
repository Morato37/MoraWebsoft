interface PagePlaceholderProps {
  title: string;
  label?: string;
}

export default function PagePlaceholder({ title, label = '// Seite' }: PagePlaceholderProps) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-12 sm:px-8 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">{label}</p>
      <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-[#E5E7EB] sm:text-6xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-[#9CA3AF]">Platzhalter für Inhalte.</p>
    </section>
  );
}
