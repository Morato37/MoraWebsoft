interface PortraitCardProps { className?: string; size?: 'sm' | 'lg'; }

/** Freigestelltes Porträt auf dunklem Verlauf mit Glow, unten weich auslaufend. */
export default function PortraitCard({ className = '', size = 'lg' }: PortraitCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c1220] ${size === 'lg' ? 'aspect-[4/5]' : 'aspect-square'} ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(45,212,191,0.35),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgba(167,139,250,0.25),transparent_55%),linear-gradient(180deg,#101a2c_0%,#0b1120_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-[38%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2DD4BF]/20 blur-3xl" />
      <picture>
        <source srcSet="/images/matteo.webp" type="image/webp" />
        <img
          src="/images/matteo.png"
          alt="Matteo Mora"
          className={`absolute inset-x-0 bottom-0 mx-auto h-[96%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${size === 'lg' ? 'translate-y-[2%]' : 'translate-y-[6%] scale-[1.15]'}`}
          loading="eager"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0c1220] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
    </div>
  );
}
