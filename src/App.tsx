import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { PublicationsPage } from './pages/PublicationsPage';
import { PeoplePage } from './pages/PeoplePage';
import { AlumniPage } from './pages/AlumniPage';
import { LabLifePage } from './pages/LabLifePage';
import { ChevronRight, Home } from 'lucide-react';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');

  // Hash Routing Synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (
        hash === 'events' ||
        hash === 'publications' ||
        hash === 'people' ||
        hash === 'alumni' ||
        hash === 'lab-life'
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
        return 'Research Publications (2025–2026)';
      case 'people':
        return 'Faculty, Researchers & Mentors';
      case 'alumni':
        return 'Hall of Fame & Alumni Placements';
      case 'lab-life':
        return 'Lab Life & Fanpage Feed';
      default:
        return 'Home';
    }
  };

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
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="h-3 w-3 text-slate-400" />
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
          {currentRoute === 'events' && <EventsPage />}
          {currentRoute === 'people' && <PeoplePage />}
          {currentRoute === 'alumni' && <AlumniPage />}
          {currentRoute === 'lab-life' && <LabLifePage />}
        </main>
      </div>

      {/* Footer */}
      <Footer onRouteChange={handleNavigate} />
    </div>
  );
}

export default App;
