import Seo, { localBusinessJsonLd } from '../components/public/Seo';
import FinalCta from '../components/public/FinalCta';
import ForWhom from '../components/public/ForWhom';
import Hero from '../components/public/Hero';
import Process from '../components/public/Process';
import References from '../components/public/References';
import Services from '../components/public/Services';
import WhyMe from '../components/public/WhyMe';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Web-Apps, Websites & Automatisierung für KMU | Morawebsoft, Rüti ZH"
        description="Morawebsoft entwickelt Web-Applikationen, Websites, Automatisierungen und Schnittstellen für KMU in der Deutschschweiz. Festpreise, direkter Draht zum Entwickler, Abacus- und M365-Praxis."
        path="/"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Hero />
      <ForWhom />
      <Services />
      <Process />
      <References />
      <WhyMe />
      <FinalCta />
    </>
  );
}
