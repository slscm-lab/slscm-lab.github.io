import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, BookOpen, Bot, Building2, Check, ChevronDown, Clipboard,
  Clock3, ExternalLink, FileText, GraduationCap, Leaf, Mail, MapPin,
  Menu, Network, Search, Send, Sparkles, Trophy, Truck, Users, X,
} from 'lucide-react';
import overviewData from './data/slscm_overview.json';
import peopleData from './data/slscm_people.json';
import projectsData from './data/slscm_projects.json';
import publicationsData from './data/slscm_publications_2025_2026.json';
import postsData from './data/slscm_facebook_posts.json';

type PillarId = 'operational_optimization' | 'ml_optimization' | 'green_transportation';
type Publication = {
  id: string; title: string; authors: string[]; venue: string; year: number;
  type: 'Journal' | 'Conference' | 'Book Chapter'; doi: string; link: string;
  research_pillar: PillarId; abstract: string; bibtex: string; is_featured: boolean;
};
type Person = {
  id: string; name: string; name_en?: string; title_vi: string; title_en?: string;
  affiliation_vi: string; affiliation_en?: string; email?: string; bio_vi: string;
  bio_en?: string; research_interests: string[]; avatar?: string;
};
type HallEntry = {
  id: string; name: string; name_en?: string; destination_institution: string;
  country: string; achievement_vi: string; achievement_en?: string; field: string; year: number;
  avatar?: string; award_type?: string; advisors?: string;
};
type Project = {
  id: string; title_vi: string; title_en?: string; description_vi: string;
  description_en?: string; period: string; status: string;
  collaboration?: string | null; leads?: { name: string }[] | null;
};
type Post = {
  type: string; title: string; abstract?: string; journal?: string;
  organizer?: string; collaboration?: string; name?: string; link?: string;
  action_label?: string;
};
type YoungResearcher = {
  id: string; name: string; name_en?: string; role_vi?: string; role_en?: string;
  affiliation_vi?: string; affiliation_en?: string; email?: string;
  current_status_vi?: string; current_status_en?: string;
  featured_publications?: string[]; research_interests?: string[];
  avatar?: string; affiliation?: string;
};
type StudentResearcher = {
  name: string; name_en?: string; major: string; major_en?: string;
  institution: string; institution_en?: string; email?: string; avatar?: string;
  affiliation?: string;
};
type AlumniMember = {
  id: string; name: string; name_en?: string;
  avatar?: string; period: string;
  former_role_vi: string; former_role_en?: string;
  current_position_vi: string; current_position_en?: string;
  institution: string; institution_en?: string;
  research_focus?: string; email?: string; linkedin?: string;
};

const overview = overviewData as typeof overviewData;
const people = peopleData as unknown as {
  leadership_and_faculty: Person[];
  hall_of_fame: HallEntry[];
  young_researchers_and_authors: YoungResearcher[];
  student_researchers: StudentResearcher[];
  alumni: AlumniMember[];
};
const projects = projectsData as unknown as Project[];
const publications = publicationsData as Publication[];
const posts = postsData as Post[];

function getMemberInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'MB';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const p1 = parts[parts.length - 2];
  const p2 = parts[parts.length - 1];
  const clean1 = p1[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const clean2 = p2[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return (clean1 + clean2).toUpperCase();
}

const pillarNames: Record<PillarId, string> = {
  operational_optimization: 'Operations & Algorithms',
  ml_optimization: 'Data Science & AI',
  green_transportation: 'Green Logistics',
};

const navLinks = [
  ['Research', '#research'],
  ['Projects', '#impact'],
  ['Publications Vault', '#publications'],
  ['People', '#people'],
  ['Alumni', '#alumni'],
  ['Lab Life', '#lab-life'],
];

function useCounter(target: number) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? target : 0);
  useEffect(() => {
    if (reduceMotion) return;
    const started = performance.now();
    const duration = 1000;
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, reduceMotion]);
  return value;
}

function Counter({ target, suffix, label, detail }: { target: number; suffix: string; label: string; detail: string }) {
  const value = useCounter(target);
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="font-mono text-3xl font-semibold tracking-tight text-slate-900">{value}{suffix}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{label}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">{detail}</div>
    </div>
  );
}

function HanoiClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span className="hidden items-center gap-1.5 md:inline-flex">
      <Clock3 className="h-3.5 w-3.5" />
      Hanoi {time}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="bg-slate-950 px-4 py-2 font-mono text-[10px] tracking-wide text-slate-300 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            STATUS: ACTIVE / ROOM P1613 A1
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <MapPin className="h-3.5 w-3.5" />
            207 Giai Phong Road, Hanoi, Vietnam
          </span>
          <HanoiClock />
          <a className="hidden hover:text-white sm:block" href="mailto:minhvd@neu.edu.vn">
            minhvd@neu.edu.vn
          </a>
        </div>
      </div>
      <nav aria-label="Main Navigation" className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="section-shell flex h-[76px] items-center justify-between gap-5">
          <a href="#top" className="focus-ring group flex min-w-0 items-center gap-3 rounded-xl">
            <img
              src="/assets/images/slscm_logo.svg"
              alt="SLSCM Lab Logo"
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200 shadow-sm transition group-hover:scale-105"
            />
            <span className="min-w-0">
              <span className="block font-editorial text-xl font-bold leading-none text-slate-950 group-hover:text-sky-800 transition">SLSCM Lab</span>
              <span className="hidden font-editorial text-xs font-normal tracking-wide text-slate-500 sm:block mt-1">Smart Logistics &amp; Supply Chain Management Lab · NEU</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} className="focus-ring font-editorial text-[15px] font-medium tracking-wide text-slate-700 transition hover:text-sky-700" href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href="#join" className="focus-ring hidden rounded-xl bg-slate-900 px-4 py-2 font-editorial text-sm font-medium tracking-wide text-white transition hover:bg-sky-700 sm:inline-flex">
              Join Lab <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="focus-ring rounded-lg p-2 lg:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
            >
              <div className="section-shell grid gap-1 py-4">
                {navLinks.concat([['Join Lab', '#join']]).map(([label, href]) => (
                  <a
                    onClick={() => setOpen(false)}
                    key={href}
                    href={href}
                    className="rounded-xl px-3 py-2.5 font-editorial text-base font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="overflow-hidden py-20 sm:py-28">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-sky-800">
            <Sparkles className="h-3.5 w-3.5" />
            COLLEGE OF TECHNOLOGY · NATIONAL ECONOMICS UNIVERSITY
          </div>
          <h1 className="mt-6 max-w-4xl font-editorial text-5xl leading-[1.04] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            The{' '}
            <em
              className="metallic-gradient-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 25%, #0284c7 45%, #0891b2 70%, #22d3ee 85%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Optimizing Frontier
            </em>{' '}
            for resilient supply chains.
          </h1>
          <p className="mt-7 max-w-3xl font-editorial text-xl sm:text-2xl leading-relaxed text-slate-600 font-normal">
            At the intersection of modern Operations Research, Artificial Intelligence, and Next-Generation Transportation — transforming complex mathematical challenges into intelligent, sustainable infrastructure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#research" className="focus-ring inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 font-editorial text-sm font-medium tracking-wide text-white shadow-lg shadow-slate-300/60 transition hover:bg-sky-700">
              Explore Research <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a href="#publications" className="focus-ring inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-editorial text-sm font-medium tracking-wide text-slate-700 transition hover:border-sky-300 hover:bg-sky-50">
              Open Research Vault
            </a>
          </div>
        </motion.div>
        <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Counter target={19} suffix="" label="International Publications" detail="2025 - 2026 CATALOG" />
          <Counter target={11} suffix="" label="Q1 Journal Articles" detail="PREMIER SCHOLARSHIP" />
          <Counter target={3} suffix="" label="Ph.D. Placements" detail="SMU · UCONN · LJMU" />
          <Counter target={4} suffix="" label="Active Impact Projects" detail="REAL-WORLD VALUE" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {['VRP & Drone Routing', 'MetaPerceptron AI', 'EVRP-TW', 'SMU Ph.D. Scholarship', 'Hanoi Smart Water Network'].map((chip) => (
            <span key={chip} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 font-mono text-[11px] text-slate-600">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchAndProjects() {
  const icons = [Truck, Bot, Leaf];
  const treatments = [
    'border-sky-200/90 bg-sky-50/70 text-sky-800 backdrop-blur-sm',
    'border-cyan-200/90 bg-cyan-50/70 text-cyan-800 backdrop-blur-sm',
    'border-emerald-200/90 bg-emerald-50/70 text-emerald-800 backdrop-blur-sm',
  ];
  const tagTreatments = [
    'border-sky-200/90 bg-white/95 text-sky-950 shadow-xs hover:border-sky-300',
    'border-cyan-200/90 bg-white/95 text-cyan-950 shadow-xs hover:border-cyan-300',
    'border-emerald-200/90 bg-white/95 text-emerald-950 shadow-xs hover:border-emerald-300',
  ];
  return (
    <>
      <section id="research" className="py-20">
        <div className="section-shell">
          <SectionHead
            eyebrow="RESEARCH ARCHITECTURE"
            title="Three pillars, one rigorous scientific standard."
            text="From exact combinatorial formulations to autonomous decision-making systems deployed in the physical world."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {overview.research_pillars.map((pillar, index) => {
              const Icon = icons[index];
              const desc = (pillar as unknown as { description_en?: string }).description_en || pillar.description_vi;
              return (
                <motion.article whileHover={{ y: -5 }} key={pillar.id} className={`rounded-3xl border p-6 shadow-soft ${treatments[index]}`}>
                  <Icon className="h-7 w-7" />
                  <p className="mt-5 font-mono text-[10px] font-semibold tracking-widest opacity-70">
                    0{index + 1} / {index === 0 ? 'EXACT + HEURISTIC' : index === 1 ? 'AI / OR INTERSECTION' : 'GREEN LOGISTICS'}
                  </p>
                  <h3 className="mt-2 font-editorial text-2xl font-bold leading-snug text-slate-900">{pillar.title_en}</h3>
                  <p className="mt-3 font-editorial text-base leading-relaxed text-slate-600">{desc}</p>
                  <div className="mt-5 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-sm backdrop-blur">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      <span>MATHEMATICAL FORMULATION</span>
                      <span className="text-sky-700">CORE MODEL</span>
                    </div>
                    <div className="mt-2 overflow-x-auto font-mono text-xs font-semibold text-slate-900">
                      {index === 0 ? 'min Σ cᵢⱼxᵢⱼ  |  x ∈ feasible routes' : index === 1 ? 'min_W 𝓛(y, f(X; W)) + λ||W||²' : 'SOCᵢ₊₁ = SOCᵢ - P · Δt + Echarge'}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {pillar.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors ${tagTreatments[index]}`}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="impact" className="py-20">
        <div className="section-shell">
          <SectionHead
            eyebrow="FROM MODELS TO IMPACT"
            title="Algorithms creating real-world value."
            text="Bridging the gap between mathematical optimization, municipal infrastructure, and autonomous logistics."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, i) => {
              const title = project.title_en || project.title_vi;
              const desc = project.description_en || project.description_vi;
              return (
                <article key={project.id} className="soft-card flex flex-col p-6">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sky-700">
                    0{i + 1} / {project.status.toUpperCase()}
                  </span>
                  <h3 className="mt-4 font-editorial text-2xl font-bold leading-snug text-slate-900">{title}</h3>
                  <p className="mt-3 line-clamp-5 font-editorial text-base leading-relaxed text-slate-600">{desc}</p>
                  <div className="mt-auto pt-6">
                    <div className="border-t border-slate-100 pt-4 font-mono text-[11px] font-medium text-slate-500">{project.period}</div>
                    {project.collaboration && <p className="mt-2 font-editorial text-xs leading-normal text-slate-500">{project.collaboration}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function PublicationsVault() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [type, setType] = useState('all');
  const [pillar, setPillar] = useState('all');
  const [selected, setSelected] = useState<Publication | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const filtered = useMemo(() => publications.filter((paper) => {
    const haystack = [paper.title, paper.authors.join(' '), paper.venue, paper.doi].join(' ').toLocaleLowerCase();
    return haystack.includes(query.toLocaleLowerCase()) &&
      (year === 'all' || String(paper.year) === year) &&
      (type === 'all' || paper.type === type) &&
      (pillar === 'all' || paper.research_pillar === pillar);
  }), [query, year, type, pillar]);

  const copy = async (bibtex: string) => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="publications" className="py-20">
      <div className="section-shell">
        <SectionHead
          eyebrow="RESEARCH VAULT / 19 RECORDS"
          title="Discoverable, citable, and verifiable scholarship."
          text="Comprehensive search across all 19 publications by title, author, venue, or DOI. Direct 1-click BibTeX export."
        />
        <div className="mt-9 rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-soft backdrop-blur-md sm:p-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              aria-label="Search scientific publications"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search papers, authors, journals, or DOI..."
              className="focus-ring w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <FilterGroup title="Year">
              {['all', '2026', '2025'].map((value) => (
                <FilterPill key={value} active={year === value} onClick={() => setYear(value)}>
                  {value === 'all' ? 'All' : value}
                </FilterPill>
              ))}
            </FilterGroup>
            <FilterGroup title="Type">
              {['all', 'Journal', 'Conference', 'Book Chapter'].map((value) => (
                <FilterPill key={value} active={type === value} onClick={() => setType(value)}>
                  {value === 'all' ? 'All' : value === 'Journal' ? 'Q1 Journal' : value}
                </FilterPill>
              ))}
            </FilterGroup>
            <FilterGroup title="Research Pillar">
              {(['all', ...Object.keys(pillarNames)] as ('all' | PillarId)[]).map((value) => (
                <FilterPill key={value} active={pillar === value} onClick={() => setPillar(value)}>
                  {value === 'all' ? 'All' : pillarNames[value]}
                </FilterPill>
              ))}
            </FilterGroup>
          </div>
        </div>

        <p className="mt-5 font-mono text-xs text-slate-500">{filtered.length} / {publications.length} publications found</p>
        <div className="mt-4 grid gap-3">
          {filtered.map((paper) => (
            <article key={paper.id} className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-soft backdrop-blur-sm transition hover:border-sky-300 hover:bg-white/95 hover:shadow-lift">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span className="rounded-full bg-sky-50 px-2 py-1 font-semibold text-sky-800">
                      {paper.type === 'Journal' ? 'Q1 JOURNAL' : paper.type.toUpperCase()}
                    </span>
                    <span className="text-slate-500">{paper.year}</span>
                    <span className="text-emerald-700">{pillarNames[paper.research_pillar]}</span>
                  </div>
                  <h3 className="mt-3 font-editorial text-lg font-bold leading-snug text-slate-900 sm:text-xl">{paper.title}</h3>
                  <p className="mt-2 font-editorial text-sm text-slate-600">{paper.authors.join(', ')}</p>
                  <p className="mt-1 font-editorial text-base italic text-slate-700">{paper.venue}</p>
                  <p className="mt-2 font-mono text-[10px] text-slate-500">DOI: {paper.doi}</p>
                </div>
                <div className="flex shrink-0 items-start gap-2">
                  <a
                    aria-label={`Open DOI for ${paper.title}`}
                    href={paper.link}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => { setSelected(paper); setCopied(false); }}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-sky-700"
                  >
                    <FileText className="h-4 w-4" />
                    BibTeX
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white/80 backdrop-blur-sm py-12 text-center text-slate-500">
            No matching publications found.
          </p>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="paper-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: .96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: .96, y: 12 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-sky-700">
                    {selected.type.toUpperCase()} / {selected.year}
                  </p>
                  <h2 id="paper-modal-title" className="mt-2 text-xl font-bold leading-snug text-slate-900">
                    {selected.title}
                  </h2>
                </div>
                <button
                  aria-label="Close dialog"
                  className="focus-ring rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                  onClick={() => setSelected(null)}
                >
                  <X />
                </button>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-slate-600">{selected.abstract}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-slate-600">BibTeX Citation</span>
                <button
                  onClick={() => copy(selected.bibtex)}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy BibTeX'}
                </button>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-200">
                {selected.bibtex}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PeopleAndLife() {
  const [submitted, setSubmitted] = useState(false);
  const [memberTab, setMemberTab] = useState<'all' | 'researchers' | 'students'>('all');
  const [alumniTab, setAlumniTab] = useState<'all' | 'phd'>('phd');

  const hofMap = useMemo(() => {
    const map = new Map<string, typeof people.hall_of_fame[0]>();
    people.hall_of_fame.forEach((hof) => {
      map.set(hof.name.toLowerCase(), hof);
      if (hof.name_en) map.set(hof.name_en.toLowerCase(), hof);
    });
    return map;
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section id="people" className="py-20">
        <div className="section-shell">
          <SectionHead
            eyebrow="MENTORSHIP & TRAJECTORIES"
            title="Rigorous in mentorship, borderless in trajectory."
            text="A scholarly community of professors, researchers, and students advancing Vietnamese scientific excellence on global stages."
          />
          <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {people.leadership_and_faculty.map((person, index) => {
              const name = person.name_en || person.name;
              const title = person.title_en || person.title_vi;
              const affiliation = person.affiliation_en || person.affiliation_vi;
              const bio = person.bio_en || person.bio_vi;
              const roleLabel = (person as { role_badge?: string }).role_badge || (index === 0
                ? 'HEAD OF LAB'
                : index === 1
                ? 'SCIENTIFIC ADVISOR'
                : 'RESEARCH FELLOW');

              return (
                <article
                  key={person.id}
                  className="soft-card flex flex-col justify-between p-6 transition hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      {person.avatar ? (
                        <img
                          src={person.avatar}
                          alt={name}
                          className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-sky-700 font-editorial text-lg font-bold text-white shrink-0 tracking-wider">
                          {getMemberInitials(name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex items-center rounded-md border border-sky-200/80 bg-sky-50/90 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-800">
                          {roleLabel}
                        </span>
                        <h3 className="mt-1 font-editorial text-xl font-bold text-slate-900 leading-snug">{name}</h3>
                        <p className="mt-0.5 font-editorial text-xs font-semibold text-sky-800 leading-snug">{title}</p>
                      </div>
                    </div>

                    {person.email && (
                      <div className="mt-3.5 flex items-center">
                        <a
                          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 font-mono text-xs font-medium text-slate-600 hover:border-sky-300 hover:bg-white hover:text-sky-700 transition"
                          href={`mailto:${person.email}`}
                        >
                          <Mail className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                          <span>{person.email}</span>
                        </a>
                      </div>
                    )}

                    <div className="mt-3.5 pt-3 border-t border-slate-100/90">
                      <p className="font-editorial text-xs font-semibold text-slate-500 leading-snug">{affiliation}</p>
                      <p className="mt-2 font-editorial text-sm leading-relaxed text-slate-600">{bio}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100/80">
                    <div className="flex flex-wrap gap-1.5">
                      {person.research_interests.slice(0, 4).map((interest) => (
                        <span
                          key={interest}
                          className="rounded-lg border border-slate-200/80 bg-white/95 px-2.5 py-1 font-editorial text-xs font-medium text-slate-700 shadow-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* LAB MEMBERS */}
          <div className="mt-16" id="members">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sky-700">LAB MEMBERS</p>
                <h3 className="mt-2 font-editorial text-3xl text-slate-900">Researchers &amp; Student Scholars.</h3>
              </div>
              <div className="flex items-center rounded-xl border border-slate-200/80 bg-white/80 p-1 backdrop-blur-sm shadow-xs flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setMemberTab('all')}
                  className={`rounded-lg px-3 py-1.5 font-editorial text-xs font-semibold transition ${
                    memberTab === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({people.young_researchers_and_authors.length + people.student_researchers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMemberTab('researchers')}
                  className={`rounded-lg px-3 py-1.5 font-editorial text-xs font-semibold transition ${
                    memberTab === 'researchers'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Researchers &amp; Authors ({people.young_researchers_and_authors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMemberTab('students')}
                  className={`rounded-lg px-3 py-1.5 font-editorial text-xs font-semibold transition ${
                    memberTab === 'students'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student Researchers ({people.student_researchers.length})
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(memberTab === 'all' || memberTab === 'researchers') &&
                people.young_researchers_and_authors.map((member) => {
                  const name = member.name_en || member.name;
                  const initials = getMemberInitials(name);
                  const role = member.role_en || 'Researcher / Author';
                  return (
                    <article
                      key={member.id}
                      className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur-sm shadow-soft transition hover:shadow-lift flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3.5">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={name}
                              className="h-12 w-12 rounded-xl object-cover ring-2 ring-sky-200 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-800 font-mono text-sm font-bold text-white shadow-sm ring-2 ring-sky-200/70 shrink-0 tracking-wider">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-editorial text-xs font-semibold tracking-wide text-sky-800 truncate">
                              {role}
                            </p>
                            <h4 className="font-editorial text-lg font-bold text-slate-900 leading-snug truncate">
                              {name}
                            </h4>
                            {member.affiliation_en && (
                              <p className="font-editorial text-xs font-medium text-slate-500 truncate">
                                {member.affiliation_en}
                              </p>
                            )}
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-sky-700 hover:text-sky-900 truncate"
                              >
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100/90">
                          {member.current_status_en && (
                            <p className="font-editorial text-xs font-medium text-slate-700 leading-relaxed line-clamp-2">
                              {member.current_status_en}
                            </p>
                          )}
                          {member.featured_publications && member.featured_publications.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {member.featured_publications.map((pub) => (
                                <span
                                  key={pub}
                                  className="rounded-md border border-sky-200/80 bg-sky-50/70 px-2 py-0.5 font-mono text-[10px] font-medium text-sky-900"
                                >
                                  {pub}
                                </span>
                              ))}
                            </div>
                          )}
                          {member.research_interests && member.research_interests.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {member.research_interests.slice(0, 3).map((item) => (
                                <span
                                  key={item}
                                  className="rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 font-editorial text-[11px] font-medium text-slate-600"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}

              {(memberTab === 'all' || memberTab === 'students') &&
                people.student_researchers.map((student) => {
                  const name = student.name_en || student.name;
                  const initials = getMemberInitials(name);
                  const major = student.major_en || student.major;
                  const institution = student.institution_en || student.institution;
                  return (
                    <article
                      key={name}
                      className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 backdrop-blur-sm shadow-soft transition hover:shadow-lift flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3.5">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={name}
                              className="h-12 w-12 rounded-xl object-cover ring-2 ring-emerald-200 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-800 font-mono text-sm font-bold text-emerald-200 shadow-sm ring-2 ring-emerald-200/60 shrink-0 tracking-wider">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-editorial text-xs font-semibold tracking-wide text-emerald-800 truncate">
                              Student Researcher
                            </p>
                            <h4 className="font-editorial text-lg font-bold text-slate-900 leading-snug truncate">
                              {name}
                            </h4>
                            <p className="font-editorial text-xs font-medium text-slate-500 truncate">
                              {institution}
                            </p>
                            {student.email && (
                              <a
                                href={`mailto:${student.email}`}
                                className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 hover:text-emerald-900 truncate"
                              >
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate">{student.email}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100/90">
                          <p className="font-editorial text-sm font-semibold text-slate-800">{major}</p>
                          <p className="mt-1 font-editorial text-xs text-slate-500">{institution}</p>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            <span className="rounded-md border border-emerald-200/80 bg-emerald-50/70 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-800">
                              Undergraduate Research Scholar
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>

          {/* MERGED: PLACEMENTS WITHOUT BORDERS · SCHOLARS & ALUMNI WORLDWIDE */}
          <div className="mt-16" id="alumni">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80 inline-flex items-center gap-1.5">
                    <Trophy className="h-3 w-3 text-amber-600" />
                    HALL OF FAME
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200/80 inline-flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                    ALUMNI NETWORK
                  </span>
                </div>
                <h3 className="mt-2.5 font-editorial text-3xl text-slate-900">
                  Placements without borders.
                </h3>
                <p className="mt-1 font-editorial text-lg font-medium text-slate-700">
                  Scholars &amp; Alumni Worldwide
                </p>
                <p className="mt-2 font-editorial text-sm text-slate-600 max-w-2xl">
                  Honoring former researchers and student scholars of SLSCM Lab who contributed to our scientific foundations and are now pursuing fully-funded doctorates, advanced research, and leadership careers at leading global institutions and enterprises.
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 p-1 backdrop-blur-sm shadow-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAlumniTab('phd')}
                  className={`rounded-lg px-3 py-1.5 font-editorial text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                    alumniTab === 'phd'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-800 hover:text-amber-950 bg-amber-50/60'
                  }`}
                >
                  <Trophy className="h-3 w-3" />
                  Placements &amp; Scholarships ({people.hall_of_fame.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAlumniTab('all')}
                  className={`rounded-lg px-3 py-1.5 font-editorial text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                    alumniTab === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="h-3 w-3" />
                  All Alumni ({people.alumni?.length || 0})
                </button>
              </div>
            </div>

            {/* When viewing Ph.D. & Master Placements (Hall of Fame) */}
            {alumniTab === 'phd' && (
              <div className="mt-6 space-y-8">
                {([2026, 2025, 2024] as const).map((yr) => {
                  const entries = people.hall_of_fame.filter((entry) => entry.year === yr);
                  if (entries.length === 0) return null;
                  return (
                    <div key={yr}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                          <Trophy className="h-3.5 w-3.5 text-amber-600" />
                          Class of {yr} · {entries.length} {entries.length > 1 ? 'Placements' : 'Placement'}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-amber-200/80 via-amber-100/40 to-transparent" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {entries.map((entry) => {
                          const achievement = entry.achievement_en || entry.achievement_vi;
                          const name = entry.name_en || entry.name;
                          return (
                            <article
                              key={entry.id}
                              className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 backdrop-blur-sm shadow-soft transition hover:shadow-lift flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center gap-3.5">
                                  {entry.avatar ? (
                                    <img
                                      src={entry.avatar}
                                      alt={name}
                                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-amber-300/80 shadow-sm shrink-0"
                                    />
                                  ) : (
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-200/80 text-amber-900 shrink-0">
                                      <GraduationCap className="h-6 w-6" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded">
                                      <Trophy className="h-3 w-3 text-amber-600" /> {entry.award_type || 'Scholarship'} · {entry.year}
                                    </span>
                                    <h4 className="mt-1 font-editorial text-lg font-bold text-slate-900 leading-snug">
                                      {name}
                                    </h4>
                                    <p className="font-editorial text-xs font-medium text-slate-600">
                                      {entry.country}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-amber-200/60">
                                  <p className="font-editorial text-sm font-semibold text-slate-800">
                                    {entry.destination_institution}
                                  </p>
                                  <p className="mt-2 font-editorial text-xs leading-relaxed text-slate-600">
                                    {achievement}
                                  </p>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* When viewing All Alumni (with integrated Ph.D. Scholarship badges) */}
            {alumniTab === 'all' && (
              <div className="mt-6 space-y-8">
                {([2026, 2025, 2024] as const).map((yr) => {
                  const cohort = people.alumni.filter((alum) => alum.period.includes(String(yr)));
                  if (cohort.length === 0) return null;
                  return (
                    <div key={yr}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-300 shadow-2xs">
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                          Class of {yr} · {cohort.length} {cohort.length > 1 ? 'Scholars' : 'Scholar'}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {cohort.map((alum) => {
                          const name = alum.name_en || alum.name;
                          const initials = getMemberInitials(name);
                          const formerRole = alum.former_role_en || alum.former_role_vi;
                          const currentPos = alum.current_position_en || alum.current_position_vi;
                          const institution = alum.institution_en || alum.institution;
                          const hofMatch =
                            hofMap.get(alum.name.toLowerCase()) ||
                            (alum.name_en ? hofMap.get(alum.name_en.toLowerCase()) : undefined);

                          return (
                            <article
                              key={alum.id}
                              className={`rounded-2xl border p-5 backdrop-blur-sm shadow-soft transition hover:shadow-lift flex flex-col justify-between ${
                                hofMatch
                                  ? 'border-amber-200/90 bg-gradient-to-br from-white/95 via-amber-50/25 to-white/90 ring-1 ring-amber-200/50'
                                  : 'border-indigo-200/70 bg-gradient-to-br from-white/95 via-indigo-50/30 to-white/90'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-3.5">
                                  {alum.avatar ? (
                                    <img
                                      src={alum.avatar}
                                      alt={name}
                                      className={`h-12 w-12 rounded-xl object-cover shadow-sm shrink-0 ring-2 ${
                                        hofMatch ? 'ring-amber-300' : 'ring-indigo-200'
                                      }`}
                                    />
                                  ) : (
                                    <div
                                      className={`grid h-12 w-12 place-items-center rounded-xl font-mono text-sm font-bold shadow-sm ring-2 shrink-0 tracking-wider ${
                                        hofMatch
                                          ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-amber-200 ring-amber-300/60'
                                          : 'bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-indigo-200 ring-indigo-200/60'
                                      }`}
                                    >
                                      {initials}
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <p className="font-editorial text-xs font-semibold tracking-wide text-slate-700 truncate">
                                        {formerRole}
                                      </p>
                                      <span className="font-mono text-[10px] font-semibold text-slate-600 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
                                        {alum.period}
                                      </span>
                                    </div>
                                    <h4 className="font-editorial text-lg font-bold text-slate-900 leading-snug truncate">
                                      {name}
                                    </h4>
                                    <p className="font-editorial text-xs font-medium text-slate-500 truncate">
                                      {institution}
                                    </p>
                                  </div>
                                </div>

                                {hofMatch && (
                                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-amber-200/80 bg-amber-50/90 px-2.5 py-1 text-[11px] font-editorial font-semibold text-amber-900">
                                    <Trophy className="h-3 w-3 text-amber-600 shrink-0" />
                                    <span>
                                      {hofMatch.award_type
                                        ? hofMatch.award_type
                                            .replace(' & Program Valedictorian', '')
                                            .replace(' & Valedictorian', '')
                                        : 'Placement'}{' '}
                                      · {hofMatch.destination_institution}
                                    </span>
                                  </div>
                                )}

                                <div className="mt-3.5 pt-3 border-t border-slate-100/90">
                                  <p className="font-editorial text-xs font-semibold text-slate-900">
                                    {currentPos}
                                  </p>
                                  <p className="mt-0.5 font-editorial text-xs text-slate-600">
                                    {institution}
                                  </p>
                                  {alum.research_focus && (
                                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                                      <span className="rounded-md border border-slate-200/80 bg-white/90 px-2 py-0.5 font-editorial text-[11px] font-medium text-slate-700">
                                        Focus: {alum.research_focus}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="lab-life" className="py-20">
        <div className="section-shell">
          <SectionHead
            eyebrow="LAB LIFE / CURATED NEWS DIGEST"
            title="A vibrant lab researching, discovering, and publishing."
            text="Real-world milestones and research updates curated from the official SLSCM Lab channel."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => {
              const typeBadge = post.type === 'publication_news'
                ? 'PUBLICATION HIGHLIGHT'
                : post.type === 'recruitment_project'
                ? 'ACTIVE INITIATIVE'
                : 'WORKSHOP & SYMPOSIUM';
              return (
                <article key={`${post.type}-${index}`} className="soft-card flex flex-col justify-between p-6">
                  <div>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 w-fit">
                      {typeBadge}
                    </span>
                    <h3 className="mt-3.5 font-editorial text-xl font-bold leading-snug text-slate-900">{post.title}</h3>
                    <p className="mt-2.5 font-editorial text-sm leading-relaxed text-slate-600">
                      {post.abstract}
                    </p>
                  </div>
                  {post.link && (
                    <a
                      className="focus-ring mt-5 pt-4 border-t border-slate-100 font-editorial text-sm font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1.5"
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {post.action_label || 'Read Details'} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="join" className="py-20">
        <div className="section-shell">
          <div className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-2xl sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">OPEN OPPORTUNITIES</p>
                <h2 className="mt-3 max-w-xl font-editorial text-4xl leading-tight">Tackle Grand Challenges with Us.</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                  SLSCM Lab welcomes inquisitive minds who love mathematical optimization, Artificial Intelligence, and human-centric logistics infrastructure.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Undergraduate Researchers', 'Foundational mathematics, Python proficiency, and a drive for scientific inquiry.'],
                    ['Graduate & Ph.D. Scholars', 'High-impact research themes, top-tier international publication tracks, and co-advising.'],
                    ['Industry Partners', 'Supply chain network optimization, fleet dispatching, and intelligent prescriptive analytics.'],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Users className="h-5 w-5 text-emerald-300" />
                      <h3 className="mt-3 text-sm font-bold">{title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-300" />
                    Room P1613, Building A1, NEU
                  </span>
                  <a className="focus-ring flex items-center gap-2 text-white hover:text-cyan-200" href="mailto:minhvd@neu.edu.vn">
                    <Mail className="h-4 w-4 text-cyan-300" />
                    minhvd@neu.edu.vn
                  </a>
                </div>
              </div>

              <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <h3 className="font-editorial text-2xl font-bold text-white">Start a Conversation</h3>
                <label className="mt-5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  FULL NAME
                  <input
                    required
                    className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3.5 py-2.5 font-editorial text-sm text-white placeholder:text-slate-400"
                    placeholder="Your Full Name"
                  />
                </label>
                <label className="mt-4 block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  EMAIL ADDRESS
                  <input
                    required
                    type="email"
                    className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3.5 py-2.5 font-editorial text-sm text-white placeholder:text-slate-400"
                    placeholder="you@university.edu"
                  />
                </label>
                <label className="mt-4 block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  INTENDED TRACK
                  <select className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3.5 py-2.5 font-editorial text-sm text-white">
                    <option>Undergraduate Research Assistant</option>
                    <option>Graduate / Ph.D. Candidate</option>
                    <option>Industry Research Partnership</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 font-editorial text-sm font-bold text-slate-950 shadow-xl shadow-black/20 hover:bg-sky-50 hover:text-sky-950 transition-all hover:-translate-y-0.5"
                >
                  <Send className="mr-2 h-4 w-4 text-slate-950" />
                  {submitted ? 'Inquiry Recorded — Thank You!' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 py-14 text-slate-400">
      <div className="section-shell">
        <div className="grid gap-9 md:grid-cols-[1.2fr_.7fr_.7fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <img
                src="/assets/images/slscm_logo.svg"
                alt="SLSCM Lab Logo"
                className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
              />
              <span className="font-editorial text-xl font-bold tracking-tight">SLSCM Lab</span>
            </div>
            <p className="mt-4 max-w-md font-editorial text-sm leading-relaxed text-slate-300">
              Smart Logistics &amp; Supply Chain Management Lab<br />
              College of Technology · National Economics University
            </p>
            <p className="mt-4 flex items-start gap-2 font-mono text-[11px]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              Room P1613, Building A1, 207 Giai Phong Road, Hai Ba Trung, Hanoi, Vietnam
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">Explore</h3>
            <div className="mt-4 grid gap-2 font-editorial text-sm">
              {navLinks.map(([label, href]) => (
                <a className="text-slate-400 transition hover:text-white" key={href} href={href}>
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">Institutional Links</h3>
            <div className="mt-4 grid gap-2 text-sm">
              <a className="hover:text-white" href="https://fda.neu.edu.vn/slscm/" target="_blank" rel="noreferrer">
                FDA · NEU <ExternalLink className="inline h-3 w-3" />
              </a>
              <a className="hover:text-white" href="https://www.facebook.com/slscm.lab" target="_blank" rel="noreferrer">
                Facebook Fanpage <ExternalLink className="inline h-3 w-3" />
              </a>
              <a className="hover:text-white" href="https://maps.google.com/?q=National+Economics+University+Hanoi" target="_blank" rel="noreferrer">
                Campus Map P1613 <ExternalLink className="inline h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-800 pt-6 font-mono text-[11px] text-slate-400 sm:flex-row sm:items-end">
          <span>© 2025–2026 SLSCM Lab · National Economics University. All rights reserved.</span>
          <div className="flex flex-col sm:items-end gap-1">
            <span>Developed and maintained by Le Huu Trung @ Warwick</span>
            <span>Supervised by Dr. Duc-Minh Vu @ NEU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-sky-700">{eyebrow}</p>
      <h2 className="mt-3 font-editorial text-4xl leading-tight text-slate-950 sm:text-5xl">{title}</h2>
      <p className="mt-4 font-editorial text-lg sm:text-xl leading-relaxed text-slate-600 font-normal">{text}</p>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function AmbientGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-400/15 blur-[120px]" />
      <div className="absolute top-[20%] -right-40 h-[600px] w-[600px] rounded-full bg-emerald-400/12 blur-[140px]" />
      <div className="absolute top-[50%] left-[10%] h-[500px] w-[500px] rounded-full bg-amber-300/10 blur-[130px]" />
      <div className="absolute top-[75%] -right-20 h-[550px] w-[550px] rounded-full bg-sky-400/14 blur-[130px]" />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AmbientGlow />
      <Header />
      <main>
        <Hero />
        <ResearchAndProjects />
        <PublicationsVault />
        <PeopleAndLife />
      </main>
      <Footer />
    </div>
  );
}
