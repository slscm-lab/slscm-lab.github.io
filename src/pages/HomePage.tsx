import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Layers,
  Presentation,
  Newspaper,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { PageRoute, PillarId, Project, Seminar, EventBrief, Publication, Person, HallEntry } from '../types';
import { PaperCard } from '../components/PaperCard';
import overviewData from '../data/slscm_overview.json';
import projectsData from '../data/slscm_projects.json';
import seminarsData from '../data/slscm_seminars.json';
import eventsData from '../data/slscm_events.json';
import publicationsData from '../data/slscm_publications_2025_2026.json';
import peopleData from '../data/slscm_people.json';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const overview = overviewData as typeof overviewData;
  const projects = projectsData as unknown as Project[];
  const seminars = seminarsData as unknown as Seminar[];
  const events = eventsData as unknown as EventBrief[];
  const publications = publicationsData as unknown as Publication[];
  const people = peopleData as unknown as {
    leadership_and_faculty: Person[];
    hall_of_fame: HallEntry[];
  };

  const [selectedPillar, setSelectedPillar] = useState<PillarId>('operational_optimization');

  const featuredProjects = projects.slice(0, 3);
  const featuredSeminars = seminars.slice(0, 3);
  const featuredEvents = events.slice(0, 4);
  const featuredPapers = publications.filter((p) => p.is_featured).slice(0, 4);

  const pillarDetails: Record<PillarId, { icon: string; color: string; desc: string }> = {
    operational_optimization: {
      icon: '📐',
      color: 'from-sky-500/10 to-sky-600/5 border-sky-200',
      desc: 'Analysis and algorithmic design of exact methods (Branch-and-Cut, Conic Outer Approximation) and high-performance metaheuristics for complex routing (VRP, CARP), parallel machine scheduling, and competitive facility location.',
    },
    ml_optimization: {
      icon: '🧠',
      color: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200',
      desc: 'Developing gradient-free optimization frameworks, metaheuristic-driven neural architectures (MetaPerceptron, GrafoRVFL), and predictive-prescriptive models for intelligent decision support.',
    },
    green_transportation: {
      icon: '⚡',
      color: 'from-amber-500/10 to-amber-600/5 border-amber-200',
      desc: 'Formulating next-generation sustainable logistics networks, coordinating multi-trip truck-and-drone deliveries, energy-aware electric vehicle routing, and resilient transit scheduling.',
    },
  };

  return (
    <div className="space-y-24 py-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="section-shell pt-6 pb-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-white/90 px-4 py-1.5 font-mono text-xs font-semibold text-sky-900 shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>College of Technology · National Economics University (NEU)</span>
          </div>

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
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 font-editorial text-sm font-bold text-white shadow-lift hover:bg-sky-950 transition hover:-translate-y-0.5 focus-ring"
            >
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Explore Research Projects</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('publications')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white/90 px-6 py-3.5 font-editorial text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition hover:-translate-y-0.5 focus-ring"
            >
              <BookOpen className="h-4 w-4 text-sky-700" />
              <span>Publications Vault</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('seminars')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/90 bg-white/90 px-6 py-3.5 font-editorial text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition hover:-translate-y-0.5 focus-ring"
            >
              <Presentation className="h-4 w-4 text-emerald-700" />
              <span>Seminars &amp; Talks</span>
            </button>
          </div>
        </div>

        {/* Telemetry Counter Cards */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-xs text-center">
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              {overview.metrics.total_publications_2025_2026}
            </p>
            <p className="mt-1 font-editorial text-xs sm:text-sm font-semibold text-slate-600">
              Publications (2025–2026)
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
              {overview.metrics.active_projects}
            </p>
            <p className="mt-1 font-editorial text-xs sm:text-sm font-semibold text-slate-600">
              Active Grants &amp; Projects
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-xs text-center">
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-700 tracking-tight">
              {overview.metrics.phd_scholarships}
            </p>
            <p className="mt-1 font-editorial text-xs sm:text-sm font-semibold text-slate-600">
              Global PhD Scholarships
            </p>
          </div>
        </div>

        {/* Institutional & Global Research Network Strip */}
        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white/70 p-5 sm:p-6 backdrop-blur-md shadow-xs">
          <p className="text-center font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Institutional Research &amp; Doctoral Placement Network
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              National Economics University (NEU)
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block" />
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              Singapore Management University (SMU)
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block" />
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              VNU University of Science (VNU-HUS)
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block" />
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              Hanoi University of Science &amp; Technology (HUST)
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block" />
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              University of Connecticut (UConn)
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block" />
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              Liverpool John Moores University (LJMU)
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block" />
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              University of Warwick (WMG)
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block" />
            <span className="font-editorial text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-800 transition">
              University of Udine
            </span>
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
                <div className="text-3xl mb-4">{detail.icon}</div>
                <h3 className="font-editorial text-xl font-bold text-slate-950 leading-snug">
                  {pillar.title_en}
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

      {/* Featured Projects with Linked Papers */}
      <section className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
              DISCOVERY &amp; IMPACT
            </p>
            <h2 className="mt-1 font-editorial text-3xl sm:text-4xl font-bold text-slate-950">
              Featured Research Projects
            </h2>
            <p className="mt-2 font-editorial text-base text-slate-600">
              Directly linking funded projects to their peer-reviewed papers and algorithm repositories.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-1.5 font-editorial text-sm font-bold text-sky-700 hover:text-sky-900 transition self-start sm:self-auto"
          >
            <span>View All Projects ({projects.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="soft-card p-6 bg-white/95 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-900">
                    {project.category_en || project.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {project.period}
                  </span>
                </div>

                <h3 className="font-editorial text-lg font-bold text-slate-950 leading-snug">
                  {project.title_en}
                </h3>
                {project.sponsor && (
                  <p className="mt-1.5 font-editorial text-xs font-semibold text-sky-800">
                    Sponsor: {project.sponsor}
                  </p>
                )}
                <p className="mt-3 font-editorial text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {project.description_en}
                </p>

                {/* Related Papers Preview */}
                {project.related_publications && project.related_publications.length > 0 && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                    <p className="font-mono text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Related Paper:
                    </p>
                    <p className="font-editorial text-xs font-bold text-slate-900 line-clamp-2">
                      {project.related_publications[0].title}
                    </p>
                    <span className="inline-block mt-1 rounded bg-sky-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-sky-900">
                      {project.related_publications[0].badge || project.related_publications[0].venue}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">
                  {project.leads?.length} Investigators
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="font-editorial text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1"
                >
                  <span>Project Details</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seminars & Colloquia Preview */}
      <section className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
              ACADEMIC COLLOQUIA
            </p>
            <h2 className="mt-1 font-editorial text-3xl sm:text-4xl font-bold text-slate-950">
              Seminars &amp; Research Talks
            </h2>
            <p className="mt-2 font-editorial text-base text-slate-600">
              Invited talks and research colloquia from internal scholars and global collaborators.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('seminars')}
            className="inline-flex items-center gap-1.5 font-editorial text-sm font-bold text-sky-700 hover:text-sky-900 transition self-start sm:self-auto"
          >
            <span>Explore All Talks ({seminars.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredSeminars.map((item) => (
            <div
              key={item.id}
              className="soft-card p-6 bg-white/95 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-900">
                    {item.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </span>
                </div>

                <h3 className="font-editorial text-base font-bold text-slate-950 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 font-editorial text-xs font-bold text-sky-800">
                  Speaker: {item.speaker}
                </p>
                <p className="font-editorial text-[11px] text-slate-500">
                  {item.affiliation}
                </p>

                <p className="mt-3 font-editorial text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.abstract}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">
                  {item.venue_type} · {item.venue.split(',')[0]}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('seminars')}
                  className="font-editorial text-xs font-bold text-sky-700 hover:text-sky-900"
                >
                  View Abstract →
                </button>
              </div>
            </div>
          ))}
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
            <ChevronRight className="h-4 w-4" />
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
            <span>Open Publications Vault ({publications.length})</span>
            <ChevronRight className="h-4 w-4" />
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
              <span className="rounded-full border border-amber-300 bg-amber-100/80 px-3 py-1 font-mono text-[11px] font-bold uppercase text-amber-900">
                ⭐ Mentorship Excellence &amp; Hall of Fame
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
              <Award className="h-4 w-4 text-amber-400" />
              <span>Explore Hall of Fame</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Join Us / Callout */}
      <section className="section-shell">
        <div className="rounded-3xl border border-slate-900 bg-slate-950 p-8 sm:p-12 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
                OPPORTUNITIES FOR RESEARCHERS &amp; STUDENTS
              </p>
              <h2 className="mt-3 font-editorial text-3xl sm:text-4xl font-bold text-white leading-tight">
                Tackle Grand Challenges with SLSCM Lab
              </h2>
              <p className="mt-4 font-editorial text-base text-slate-300 leading-relaxed">
                We welcome undergraduate researchers, graduate scholars, and industry partners who share a
                passion for operations research, intelligent algorithms, and sustainable supply chain systems.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs text-slate-300">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  Room P1613, Building A1, NEU
                </span>
                <a
                  href="mailto:minhvd@neu.edu.vn"
                  className="flex items-center gap-2 text-white hover:text-cyan-200 transition"
                >
                  <Mail className="h-4 w-4 text-cyan-300" />
                  minhvd@neu.edu.vn
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur flex flex-col justify-center">
              <h3 className="font-editorial text-xl font-bold text-white mb-3">
                Research Engagement Tracks
              </h3>
              <ul className="space-y-3 font-editorial text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Undergraduate Scholars:</strong> Mentorship in Python solvers, OR-Tools, and paper co-authorship.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Graduate &amp; PhD Tracks:</strong> Joint international supervision, Q1 journal pipelines, and global scholarship prep.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Industry Collaboration:</strong> Fleet dispatching, inventory optimization, and urban infrastructure analytics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
