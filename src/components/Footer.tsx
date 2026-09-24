import React from 'react';
import { Icon } from './Icon';
import { PageRoute } from '../types';

interface FooterProps {
  onRouteChange: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange }) => {
  const quickLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home Overview', route: 'home' },
    { label: 'Research Publications', route: 'publications' },
    { label: 'Research Topics', route: 'research' },
    { label: 'People & Mentors', route: 'people' },
    { label: 'Alumni & Hall of Fame', route: 'alumni' },
    { label: 'Events & News Briefs', route: 'events' },
    { label: 'Lab Life & Fanpage', route: 'lab-life' },
  ];

  return (
    <footer className="mt-20 border-t border-slate-200/90 bg-slate-50/95 py-14 text-slate-600">
      <div className="section-shell">
        <div className="grid gap-10 md:grid-cols-[1.4fr_.8fr_.8fr]">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 text-slate-900">
              <img
                src="/assets/images/slscm_logo.png"
                alt="SLSCM Lab Logo"
                className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200 shadow-xs"
              />
              <div>
                <span className="font-editorial text-xl font-bold tracking-tight text-slate-900">
                  SLSCM Lab
                </span>
                {/* <p className="font-mono text-[10px] uppercase tracking-wider text-sky-700 font-semibold">
                  NEU College of Technology
                </p> */}
              </div>
            </div>

            <div className="mt-5 space-y-2 font-mono text-xs text-slate-600">
              <p className="flex items-start gap-2.5">
                <Icon name="location_on" className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <span>Room 1613, Building A1, 207 Giai Phong, Bach Mai, Hanoi, Vietnam</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-sky-600" />
                <a href="mailto:minhvd@neu.edu.vn" className="hover:text-sky-700 transition-colors">
                  minhvd@neu.edu.vn
                </a>
              </p>
            </div>
          </div>

          {/* Site Sections */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-900">
              Website Sections
            </h4>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 font-editorial text-sm">
              {quickLinks.map((item) => (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => {
                    onRouteChange(item.route);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-slate-600 hover:text-sky-700 transition-colors py-0.5"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-900">
              Academic Network
            </h4>
            <div className="mt-4 space-y-2.5 font-editorial text-sm">
              <a
                href="https://fda.neu.edu.vn/slscm/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-600 hover:text-sky-700 transition-colors"
              >
                <span>Faculty of Data Science &amp; AI (FDA)</span>
                <Icon name="open_in_new" className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://neu.edu.vn/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-600 hover:text-sky-700 transition-colors"
              >
                <span>National Economics University</span>
                <Icon name="open_in_new" className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.facebook.com/slscm.lab"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-600 hover:text-sky-700 transition-colors"
              >
                <span>Facebook Fanpage (@slscm.lab)</span>
                <Icon name="open_in_new" className="h-3.5 w-3.5" />
              </a>
              {/* <a
                href="https://slscm-lab.github.io"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-600 hover:text-sky-700 transition-colors"
              >
                <span>Academic Portal (GitHub Pages)</span>
                <Icon name="public" className="h-3.5 w-3.5 text-emerald-600" />
              </a> */}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200/80 pt-6 font-mono text-[11px] text-slate-500 sm:flex-row sm:items-center">
          <p>© SLSCM Lab · College of Technology, National Economics University.</p>
          <div className="flex items-center gap-4 text-slate-500">
            {/* <span>Lead: Dr. Duc Minh Vu</span>
            <span>•</span> */}
            <span>Web / Tech Lead: Le Huu Trung</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
