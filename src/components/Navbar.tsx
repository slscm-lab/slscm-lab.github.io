import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { PageRoute } from '../types';

interface NavbarProps {
  currentRoute: PageRoute;
  onRouteChange: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onRouteChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; route: PageRoute; badge?: string }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Projects', route: 'projects', badge: 'Active' },
    { label: 'Seminars & Talks', route: 'seminars' },
    { label: 'Events & Briefs', route: 'events', badge: 'News' },
    { label: 'Publications', route: 'publications' },
    { label: 'People', route: 'people' },
    { label: 'Alumni', route: 'alumni' },
    { label: 'Lab Life', route: 'lab-life' },
  ];

  const handleNavigate = (route: PageRoute) => {
    onRouteChange(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-md py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="section-shell flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <button
          type="button"
          onClick={() => handleNavigate('home')}
          className="group flex items-center gap-3 text-left focus-ring rounded-xl p-1 -m-1"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-800 p-0.5 shadow-md shadow-slate-900/10 transition-transform group-hover:scale-105">
            <img
              src="/assets/images/slscm_logo.svg"
              alt="SLSCM Lab Logo"
              className="h-full w-full rounded-[10px] object-cover"
              onError={(e) => {
                // Fallback to stylized SVG icon if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-mono text-xs font-bold tracking-wider text-cyan-300">SC</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-lg font-bold tracking-tight text-slate-950 group-hover:text-sky-700 transition-colors">
                SLSCM Lab
              </span>
              <span className="hidden sm:inline-block rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-800">
                NEU
              </span>
            </div>
            <p className="hidden md:block font-editorial text-[11px] font-normal text-slate-500">
              Smart Logistics &amp; Supply Chain Management
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/70 p-1 backdrop-blur-md shadow-xs">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNavigate(item.route)}
                className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-editorial text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <a
            href="mailto:minhvd@neu.edu.vn"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-gradient-to-r from-sky-500 to-cyan-600 px-3.5 py-2 font-editorial text-xs font-bold text-white shadow-sm shadow-sky-500/20 hover:from-sky-600 hover:to-cyan-700 transition hover:-translate-y-0.5 focus-ring"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join Us</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 focus-ring"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 border-b border-slate-200/90 bg-white/95 px-5 py-4 backdrop-blur-xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="grid gap-1.5">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleNavigate(item.route)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-left font-editorial text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        isActive ? 'bg-cyan-400 text-slate-950' : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100 mt-1">
              <a
                href="mailto:minhvd@neu.edu.vn"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 py-2.5 text-center font-editorial text-sm font-bold text-white shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Contact Lab &amp; Admissions</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
