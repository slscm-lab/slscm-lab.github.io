import React from 'react';
import { MapPin, Mail, ExternalLink, Globe } from 'lucide-react';
import { PageRoute } from '../types';

interface FooterProps {
  onRouteChange: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange }) => {
  const quickLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home Overview', route: 'home' },
    { label: 'Research Projects', route: 'projects' },
    { label: 'Seminars & Colloquia', route: 'seminars' },
    { label: 'Events & News Briefs', route: 'events' },
    { label: 'Publications Vault', route: 'publications' },
    { label: 'People & Mentors', route: 'people' },
    { label: 'Alumni & Hall of Fame', route: 'alumni' },
    { label: 'Lab Life & Fanpage', route: 'lab-life' },
  ];

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 py-14 text-slate-400">
      <div className="section-shell">
        <div className="grid gap-10 md:grid-cols-[1.4fr_.8fr_.8fr]">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 text-white">
              <img
                src="/assets/images/slscm_logo.png"
                alt="SLSCM Lab Logo"
                className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/20 shadow-sm"
              />
              <div>
                <span className="font-editorial text-xl font-bold tracking-tight">
                  SLSCM Lab
                </span>
                <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-300">
                  NEU College of Technology
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-md font-editorial text-sm leading-relaxed text-slate-300">
              Smart Logistics &amp; Supply Chain Management Lab (SLSCM Lab),
              College of Technology, National Economics University (NEU), Hanoi, Vietnam.
            </p>

            <div className="mt-5 space-y-2 font-mono text-xs text-slate-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span>Room P1613, Building A1, 207 Giai Phong Road, Hai Ba Trung, Hanoi, Vietnam</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                <a href="mailto:minhvd@neu.edu.vn" className="hover:text-white transition-colors">
                  minhvd@neu.edu.vn
                </a>
              </p>
            </div>
          </div>

          {/* Site Sections */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
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
                  className="text-left text-slate-400 hover:text-white transition-colors py-0.5"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
              Academic Network
            </h4>
            <div className="mt-4 space-y-2.5 font-editorial text-sm">
              <a
                href="https://fda.neu.edu.vn/slscm/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white transition-colors"
              >
                <span>Faculty of Data Science &amp; AI (FDA)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://neu.edu.vn/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white transition-colors"
              >
                <span>National Economics University (NEU)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.facebook.com/slscm.lab"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white transition-colors"
              >
                <span>Facebook Fanpage (@slscm.lab)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://slscm-lab.github.io"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white transition-colors"
              >
                <span>Academic Portal (GitHub Pages)</span>
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-800 pt-6 font-mono text-[11px] text-slate-500 sm:flex-row sm:items-center">
          <p>© 2025–2026 SLSCM Lab · College of Technology, National Economics University.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Lead: Dr. Duc Minh Vu</span>
            <span>•</span>
            <span>Developed by Le Huu Trung</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
