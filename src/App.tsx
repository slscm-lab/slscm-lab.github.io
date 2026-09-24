import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { ResearchTopicsPage } from './pages/ResearchTopicsPage';
import { PeoplePage } from './pages/PeoplePage';
import { AlumniPage } from './pages/AlumniPage';
import { LabLifePage } from './pages/LabLifePage';
import { AdminPage } from './pages/AdminPage';
import { Icon } from './components/Icon';
import { DataProvider, useDataContext } from './context/DataContext';

export function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const { isLoading, error, refreshAll } = useDataContext();

  // Hash Routing Synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (
        hash === 'events' ||
        hash === 'research' ||
        hash === 'publications' ||
        hash === 'people' ||
        hash === 'alumni' ||
        hash === 'lab-life' ||
        hash === 'admin'
      ) {
        setCurrentRoute(hash as PageRoute);
      } else {
        setCurrentRoute('home');
      }
    };

    // Initial check on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    if (route === 'home') {
      window.location.hash = '/';
    } else {
      window.location.hash = `/${route}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageTitle = (route: PageRoute): string => {
    switch (route) {
      case 'events':
        return 'Events & Research Briefs';
      case 'publications':
        return 'Research Publications';
      case 'research':
        return 'Research Topics';
      case 'people':
        return 'Faculty, Researchers & Mentors';
      case 'alumni':
        return 'Hall of Fame & Alumni Placements';
      case 'lab-life':
        return 'Lab Life & Fanpage Feed';
      case 'admin':
        return 'Admin Management Console';
      default:
        return 'Home';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <Icon name="hub" className="mx-auto h-9 w-9 animate-pulse text-sky-600" />
          <p className="mt-4 font-editorial text-sm font-semibold text-slate-700">Loading SLSCM Lab data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Icon name="cloud_off" className="mx-auto h-9 w-9 text-slate-500" />
          <h1 className="mt-4 font-editorial text-xl font-bold text-slate-950">Content is temporarily unavailable</h1>
          <p className="mt-2 font-editorial text-sm text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => void refreshAll()}
            className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 font-editorial text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-sky-200 selection:text-slate-900">
      {/* Ambient background glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-40 h-[600px] w-[600px] rounded-full bg-emerald-400/10 blur-[140px]" />
        <div className="absolute top-[50%] left-[10%] h-[500px] w-[500px] rounded-full bg-amber-300/8 blur-[130px]" />
        <div className="absolute top-[75%] -right-20 h-[550px] w-[550px] rounded-full bg-sky-400/10 blur-[130px]" />
      </div>

      <div>
        {/* Navigation Bar */}
        <Navbar currentRoute={currentRoute} onRouteChange={handleNavigate} />

        {/* Breadcrumb on sub-pages */}
        {currentRoute !== 'home' && (
          <div className="border-b border-slate-200/60 bg-white/60 py-2.5 backdrop-blur-sm">
            <div className="section-shell flex items-center gap-2 font-mono text-xs text-slate-500">
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="flex items-center gap-1 text-slate-600 hover:text-sky-700 transition"
              >
                <Icon name="home" className="h-3.5 w-3.5" />
                <span>Home</span>
              </button>
              <Icon name="chevron_right" className="h-3 w-3 text-slate-400" />
              <span className="font-semibold text-slate-900">
                {getPageTitle(currentRoute)}
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Route View */}
        <main>
          {currentRoute === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentRoute === 'publications' && <PublicationsPage />}
          {currentRoute === 'research' && <ResearchTopicsPage onNavigate={handleNavigate} />}
          {currentRoute === 'events' && <EventsPage />}
          {currentRoute === 'people' && <PeoplePage />}
          {currentRoute === 'alumni' && <AlumniPage />}
          {currentRoute === 'lab-life' && <LabLifePage />}
          {currentRoute === 'admin' && <AdminPage />}
        </main>
      </div>

      {/* Footer */}
      <Footer onRouteChange={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
