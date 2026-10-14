import { useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import AdminApp from './admin/AdminApp';
import PublicFooter from './components/layout/PublicFooter';
import PublicHeader from './components/layout/PublicHeader';
import AutomatisierungPage from './pages/AutomatisierungPage';
import DatenschutzPage from './pages/DatenschutzPage';
import HomePage from './pages/HomePage';
import ImpressumPage from './pages/ImpressumPage';
import KontaktPage from './pages/KontaktPage';
import OnlineCvPage from './pages/OnlineCvPage';
import SchnittstellenPage from './pages/SchnittstellenPage';
import UeberMichPage from './pages/UeberMichPage';
import WebdesignPage from './pages/WebdesignPage';
import WebengineeringPage from './pages/WebengineeringPage';
import DankePage from './pages/landing/DankePage';
import M365OnboardingPage from './pages/landing/M365OnboardingPage';
import OffertformularErpPage from './pages/landing/OffertformularErpPage';
import ProzessCheckPage from './pages/landing/ProzessCheckPage';
import ShopAbacusPage from './pages/landing/ShopAbacusPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function PublicLayout() {
  return (
    <div className="public min-h-screen bg-[#0B0F1A] text-[#E5E7EB]">
      <ScrollToTop />
      <PublicHeader />
      <main className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

function LandingLayout() {
  return (
    <div className="public min-h-screen bg-[#0B0F1A] text-[#E5E7EB]">
      <ScrollToTop />
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col px-6 sm:px-8">
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

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/webengineering', element: <WebengineeringPage /> },
      { path: '/webdesign', element: <WebdesignPage /> },
      { path: '/automatisierung', element: <AutomatisierungPage /> },
      { path: '/schnittstellen', element: <SchnittstellenPage /> },
      { path: '/online-cv', element: <OnlineCvPage /> },
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
