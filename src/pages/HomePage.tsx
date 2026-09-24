import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageRoute, PillarId } from '../types';
import { PaperCard } from '../components/PaperCard';
import {
  getLabOverview,
  getEvents,
  getRecentEvents,
  getPublications,
  getFeaturedPublications,
} from '../repositories';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const overview = getLabOverview();
  const events = getEvents();
  const publications = getPublications();
  const featuredEvents = getRecentEvents(4);
  const featuredPapers = getFeaturedPublications(4);

  const [selectedPillar, setSelectedPillar] = useState<PillarId>('supply_chain_optimization');

const pillarDetails: Record<
  PillarId,
  {
    iconName: string;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    color: string;
    desc: string;
  }
> = {
  supply_chain_optimization: {
    iconName: 'local_shipping',
    iconBg: 'bg-sky-50',
    iconBorder: 'border-sky-200/90',
    iconColor: 'text-sky-700',
    color: 'from-sky-500/10 to-sky-600/5 border-sky-200',
    desc:
      'Advancing operations research and mathematical optimization for complex logistics and supply chain systems, including vehicle routing, scheduling, facility location, network design, inventory management, transportation planning, and integrated supply chain decision-making.',
  },

  ai_supply_chain_intelligence: {
    iconName: 'neurology',
    iconBg: 'bg-emerald-50',
    iconBorder: 'border-emerald-200/90',
    iconColor: 'text-emerald-700',
    color: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200',
    desc:
      'Developing artificial intelligence and data-driven methods for intelligent supply chain decision-making, including machine learning, forecasting, predictive-prescriptive analytics, learning-enhanced optimization, and AI-supported planning and operations.',
  },

  decision_analytics: {
    iconName: 'analytics',
    iconBg: 'bg-amber-50',
    iconBorder: 'border-amber-200/90',
    iconColor: 'text-amber-700',
    color: 'from-amber-500/10 to-amber-600/5 border-amber-200',
    desc:
      'Developing optimization and decision-analytics approaches for complex systems beyond logistics and supply chains, with applications in energy, healthcare, finance and business, public services, urban systems, hospitality, and digital operations.',
  },
};

  return (
    <div className="space-y-24 py-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="section-shell pt-6 pb-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow badge with Institutional Seals */}
          {}

          {/* Hero Headline */}
          <h1 className="mt-6 font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-950 leading-[1.15]">
            Where Mathematical Optimization Powers{' '}
            <span className="metallic-gradient-text">Intelligent Supply Chains</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 font-editorial text-lg sm:text-xl leading-relaxed text-slate-600 max-w-3xl mx-auto font-normal">
            SLSCM Lab pionneers research in combinatorial optimization, prescriptive analytics, and
            artificial intelligence—solving grand challenges in freight logistics, drone routing,
            and sustainable energy systems.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate('publications')}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 font-editorial text-sm font-bold text-white shadow-lift hover:bg-sky-950 transition hover:-translate-y-0.5 focus-ring"
            >
              <Icon name="menu_book" className="h-4 w-4 text-cyan-400" />
              <span>Research Publications</span>
              <Icon name="arrow_forward" className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('people')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white/90 px-6 py-3.5 font-editorial text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition hover:-translate-y-0.5 focus-ring"
            >
              <Icon name="groups" className="h-4 w-4 text-sky-700" />
              <span>Faculty &amp; Researchers</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white/90 px-6 py-3.5 font-editorial text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition hover:-translate-y-0.5 focus-ring"
            >
              <Icon name="newspaper" className="h-4 w-4 text-emerald-700" />
              <span>News &amp; Events</span>
            </button>
          </div>
        </div>

        {/* Telemetry Counter Cards */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-xs text-center">
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              {overview.metrics.total_publications}
            </p>
            <p className="mt-1 font-editorial text-xs sm:text-sm font-semibold text-slate-600">
              Publications 
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-xs text-center">
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-sky-700 tracking-tight">
              {overview.metrics.q1_journals}
            </p>
            <p className="mt-1 font-editorial text-xs sm:text-sm font-semibold text-slate-600">
              Top Tier &amp; Q1 Journals
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-xs text-center">
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight">
              {overview.metrics.student_researchers}
            </p>
            <p className="mt-1 font-editorial text-xs sm:text-sm font-semibold text-slate-600">
              Student Researchers &amp; Scholars
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-xs text-center">
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-700 tracking-tight">
              {overview.metrics.phd_msc_scholarships}
            </p>
            <p className="mt-1 font-editorial text-xs sm:text-sm font-semibold text-slate-600">
              Global PhD & Master's Scholarships
            </p>
          </div>
        </div>

      </section>

      {/* 3 Core Research Pillars */}
      <section className="section-shell">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
            STRATEGIC FOUNDATIONS
          </p>
          <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-bold text-slate-950">
            Core Research Pillars
          </h2>
          <p className="mt-3 font-editorial text-base text-slate-600">
            Our scientific agenda integrates rigorous mathematical modeling with high-performance algorithms.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {overview.research_pillars.map((pillar) => {
            const id = pillar.id as PillarId;
            const detail = pillarDetails[id];
            const isSelected = selectedPillar === id;
            return (
              <div
                key={pillar.id}
                onClick={() => setSelectedPillar(id)}
                className={`soft-card p-6 sm:p-7 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-sky-500 shadow-lift bg-white'
                    : 'bg-white/85 hover:bg-white'
                }`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${detail.iconBg} ${detail.iconBorder} ${detail.iconColor} shadow-2xs`}
                >
                  <Icon name={detail.iconName} className="h-6 w-6" />
                </div>
                <h3 className="font-editorial text-xl font-bold text-slate-950 leading-snug">
                  {(pillar as unknown as { title_en?: string }).title_en || pillar.title}
                </h3>
                <p className="mt-3 font-editorial text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {detail.desc}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {pillar.topics.slice(0, 3).map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Events & News Briefs Preview */}
      <section className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
              INTELLIGENCE &amp; MILESTONES
            </p>
            <h2 className="mt-1 font-editorial text-3xl sm:text-4xl font-bold text-slate-950">
              News Briefs &amp; Announcements
            </h2>
            <p className="mt-2 font-editorial text-base text-slate-600">
              Recent highlights, prestigious publications, student achievements, and workshop launches.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-1.5 font-editorial text-sm font-bold text-sky-700 hover:text-sky-900 transition self-start sm:self-auto"
          >
            <span>Read All Briefs ({events.length})</span>
            <Icon name="chevron_right" className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {featuredEvents.map((item) => (
            <article
              key={item.id}
              className="soft-card p-6 bg-white/95 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-lg bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-900">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {item.date}
                  </span>
                </div>

                <h3 className="font-editorial text-lg font-bold text-slate-950 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 font-editorial text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.slice(0, 2).map((t) => (
                    <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('events')}
                  className="font-editorial text-xs font-bold text-sky-700 hover:text-sky-900"
                >
                  Read Brief →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Publications Teaser */}
      <section className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
              SCHOLARLY OUTPUT
            </p>
            <h2 className="mt-1 font-editorial text-3xl sm:text-4xl font-bold text-slate-950">
              Flagship Publications
            </h2>
            <p className="mt-2 font-editorial text-base text-slate-600">
              Peer-reviewed breakthroughs in INFORMS Journal on Computing, Transportation Research Part C, and EJOR.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('publications')}
            className="inline-flex items-center gap-1.5 font-editorial text-sm font-bold text-sky-700 hover:text-sky-900 transition self-start sm:self-auto"
          >
            <span>Open Research Publications ({publications.length})</span>
            <Icon name="chevron_right" className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {featuredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </section>

      {/* Hall of Fame Teaser */}
      <section className="section-shell">
        <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-sky-50/50 p-8 sm:p-10 shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100/80 px-3 py-1 font-mono text-[11px] font-bold uppercase text-amber-900">
                <Icon name="auto_awesome" className="h-3.5 w-3.5 text-amber-700" />
                <span>Mentorship Excellence &amp; Hall of Fame</span>
              </span>
              <h2 className="mt-4 font-editorial text-3xl sm:text-4xl font-bold text-slate-950 leading-tight">
                Mentoring Scholars for the Global Stage
              </h2>
              <p className="mt-3 font-editorial text-base text-slate-700 leading-relaxed">
                From university valedictorians to fully-funded PhD fellows at Singapore Management University,
                Liverpool John Moores, and University of Connecticut, our students achieve world-class scholarly outcomes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('alumni')}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-editorial text-sm font-bold text-white shadow-lift hover:bg-amber-950 transition hover:-translate-y-0.5 focus-ring shrink-0"
            >
              <Icon name="workspace_premium" className="h-4 w-4 text-amber-400" />
              <span>Explore Hall of Fame</span>
              <Icon name="arrow_forward" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Join Us / Callout */}
      <section className="section-shell">
        <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/50 to-emerald-50/30 p-8 sm:p-12 text-slate-900 shadow-soft relative overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr] relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-100/70 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800">
                <span>Opportunities for Researchers &amp; Students</span>
              </div>
              <h2 className="mt-4 font-editorial text-3xl sm:text-4xl font-bold text-slate-950 leading-tight">
                Tackle Grand Challenges with SLSCM Lab
              </h2>
              <p className="mt-4 font-editorial text-base text-slate-600 leading-relaxed max-w-2xl">
                We welcome undergraduate researchers, graduate scholars, and industry partners who share a
                passion for operations research, intelligent algorithms, and sustainable supply chain systems.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs text-slate-600">
                <span className="flex items-center gap-2 rounded-xl bg-white/80 border border-slate-200/80 px-3.5 py-2 shadow-xs">
                  <Icon name="location_on" className="h-4 w-4 text-sky-600" />
                  <span>Room 1613, Building A1, NEU</span>
                </span>
                <a
                  href="mailto:minhvd@neu.edu.vn"
                  className="flex items-center gap-2 rounded-xl bg-white/80 border border-slate-200/80 px-3.5 py-2 shadow-xs text-slate-700 hover:text-sky-700 hover:border-sky-300 transition"
                >
                  <Icon name="mail" className="h-4 w-4 text-sky-600" />
                  <span>minhvd@neu.edu.vn</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm flex flex-col justify-center">
              <h3 className="font-editorial text-xl font-bold text-slate-950 mb-3">
                Research Engagement Tracks
              </h3>
              <ul className="space-y-3.5 font-editorial text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 font-semibold">Undergraduate Scholars:</strong> Mentorship in Python solvers, OR-Tools, and paper co-authorship.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 font-semibold">Graduate &amp; PhD Tracks:</strong> Joint international supervision, Q1 journal pipelines, and global scholarship prep.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="check_circle" className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 font-semibold">Industry Collaboration:</strong> Fleet dispatching, inventory optimization, and urban infrastructure analytics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
