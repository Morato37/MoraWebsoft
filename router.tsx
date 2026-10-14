import { useEffect } from 'react';
import { createBrowserRouter, createHashRouter, Navigate, Outlet } from 'react-router-dom';
import AdminApp from './admin/AdminApp';
import PublicFooter from './components/layout/PublicFooter';
import PublicHeader from './components/layout/PublicHeader';
import CursorGlow from './components/motion/CursorGlow';
import PageTransition from './components/motion/PageTransition';
import ScrollProgress from './components/motion/ScrollProgress';
import Preloader from './components/motion/Preloader';
import SmoothScroll from './components/motion/SmoothScroll';
import useSectionReveal from './components/motion/useSectionReveal';
import AutomatisierungPage from './pages/AutomatisierungPage';
import DatenschutzPage from './pages/DatenschutzPage';
import HomePage from './pages/HomePage';
import ImpressumPage from './pages/ImpressumPage';
import KontaktPage from './pages/KontaktPage';
import OnlineCvPage from './pages/OnlineCvPage';
import CvBestellenPage from './pages/CvBestellenPage';
import SchnittstellenPage from './pages/SchnittstellenPage';
import UeberMichPage from './pages/UeberMichPage';
import WebdesignPage from './pages/WebdesignPage';
import WebengineeringPage from './pages/WebengineeringPage';
import DankePage from './pages/landing/DankePage';
import M365OnboardingPage from './pages/landing/M365OnboardingPage';
import OffertformularErpPage from './pages/landing/OffertformularErpPage';
import ProzessCheckPage from './pages/landing/ProzessCheckPage';
import ShopAbacusPage from './pages/landing/ShopAbacusPage';

function PublicLayout() {
  useSectionReveal();
  return (
    <div className="public relative min-h-screen bg-[#070b14] text-[#E5E7EB]">
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <CursorGlow />
      <PublicHeader />
      <main className="relative z-10 min-h-[calc(100vh-160px)] pt-20 sm:pt-24">
        <PageTransition><Outlet /></PageTransition>
      </main>
      <PublicFooter />
    </div>
  );
}

function LandingLayout() {
  useSectionReveal();
  return (
    <div className="public relative min-h-screen bg-[#070b14] text-[#E5E7EB]">
      <SmoothScroll />
      <ScrollProgress />
      <CursorGlow />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] flex-col px-6 sm:px-8">
        <a href="/" className="flex items-center gap-3 py-7 text-lg font-bold tracking-tight text-[#E5E7EB]" aria-label="Morawebsoft Startseite">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2DD4BF]/40 text-[#2DD4BF]">M</span>
          Morawebsoft
        </a>
        <main className="flex-1">
          <Outlet />
        </main>
        <div className="border-t border-[#374151] py-6 text-sm text-[#9CA3AF]">
          Morawebsoft · Matteo Mora · 8630 Rüti ZH
        </div>
      </div>
    </div>
  );
}

function AdminRoute() {
  useEffect(() => {
    document.title = 'Admin · Morawebsoft';
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex,nofollow');

    return () => {
      robots?.remove();
    };
  }, []);

  return <AdminApp />;
}

const createRouter = import.meta.env.VITE_PREVIEW_HASH_ROUTER === '1' ? createHashRouter : createBrowserRouter;

export const router = createRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/webengineering', element: <WebengineeringPage /> },
      { path: '/webdesign', element: <WebdesignPage /> },
      { path: '/automatisierung', element: <AutomatisierungPage /> },
      { path: '/schnittstellen', element: <SchnittstellenPage /> },
      { path: '/online-cv', element: <OnlineCvPage /> },
      { path: '/online-cv/bestellen', element: <CvBestellenPage /> },
      { path: '/ueber-mich', element: <UeberMichPage /> },
      { path: '/kontakt', element: <KontaktPage /> },
      { path: '/impressum', element: <ImpressumPage /> },
      { path: '/datenschutz', element: <DatenschutzPage /> },
    ],
  },
  {
    element: <LandingLayout />,
    children: [
      { path: '/offertformular-erp', element: <OffertformularErpPage /> },
      { path: '/shop-abacus', element: <ShopAbacusPage /> },
      { path: '/m365-onboarding', element: <M365OnboardingPage /> },
      { path: '/prozess-check', element: <ProzessCheckPage /> },
      { path: '/danke', element: <DankePage /> },
    ],
  },
  { path: '/admin/*', element: <AdminRoute /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
