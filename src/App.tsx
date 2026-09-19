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
  bio_en?: string; research_interests: string[];
};
type HallEntry = {
  id: string; name: string; name_en?: string; destination_institution: string;
  country: string; achievement_vi: string; achievement_en?: string; field: string; year: number;
};
type Project = {
  id: string; title_vi: string; title_en?: string; description_vi: string;
  description_en?: string; period: string; status: string;
  collaboration?: string | null; leads?: { name: string }[] | null;
};
type Post = {
  type: string; title: string; abstract?: string; journal?: string;
  organizer?: string; collaboration?: string; name?: string; link?: string;
};

const overview = overviewData as typeof overviewData;
const people = peopleData as unknown as {
  leadership_and_faculty: Person[];
  hall_of_fame: HallEntry[];
  young_researchers_and_authors: { name: string; role_vi?: string }[];
};
const projects = projectsData as unknown as Project[];
const publications = publicationsData as Publication[];
const posts = postsData as Post[];

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
              src="/assets/images/slscm_logo.png"
              alt="SLSCM Lab Logo"
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200 shadow-sm transition group-hover:scale-105"
            />
            <span className="min-w-0">
              <span className="block font-editorial text-xl font-bold leading-none text-slate-950 group-hover:text-sky-800 transition">SLSCM Lab</span>
              <span className="hidden font-editorial text-xs font-normal tracking-wide text-slate-500 sm:block mt-1">Smart Logistics &amp; Supply Chain · NEU</span>
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
            The <em className="bg-gradient-to-r from-sky-900 via-sky-800 to-cyan bg-clip-text text-transparent">Optimizing Frontier</em> for resilient supply chains.
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
                      <span key={topic} className="rounded-md bg-white/80 px-2 py-1 font-mono text-[10px] text-slate-600">
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
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {people.leadership_and_faculty.map((person, index) => {
              const name = person.name_en || person.name;
              const title = person.title_en || person.title_vi;
              const affiliation = person.affiliation_en || person.affiliation_vi;
              const bio = person.bio_en || person.bio_vi;
              return (
                <article key={person.id} className={`soft-card p-6 ${index === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-8' : ''}`}>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700">
                      {index === 0 ? 'HEAD OF LAB' : 'FACULTY & ADVISOR'}
                    </span>
                    <div className="mt-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-sky-700 font-editorial text-2xl text-white">
                      {name.split(' ').slice(-1)[0][0]}
                    </div>
                    <h3 className="mt-4 font-editorial text-2xl font-bold text-slate-900">{name}</h3>
                    <p className="mt-1 font-editorial text-sm font-medium text-sky-800">{title}</p>
                    <p className="mt-3 font-editorial text-sm leading-relaxed text-slate-600">{affiliation}</p>
                  </div>
                  <div className={index === 0 ? 'mt-5 lg:mt-0' : 'mt-5'}>
                    <p className="font-editorial text-sm leading-relaxed text-slate-600">{bio}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {person.research_interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600">
                          {interest}
                        </span>
                      ))}
                    </div>
                    {person.email && (
                      <a className="focus-ring mt-5 inline-flex items-center text-sm font-semibold text-sky-700 hover:underline" href={`mailto:${person.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        {person.email}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-14">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-700">HALL OF FAME</p>
                <h3 className="mt-2 font-editorial text-3xl text-slate-900">Placements without borders.</h3>
              </div>
              <Trophy className="hidden h-10 w-10 text-amber-500 sm:block" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {people.hall_of_fame.map((entry) => {
                const achievement = entry.achievement_en || entry.achievement_vi;
                const name = entry.name_en || entry.name;
                return (
                  <article key={entry.id} className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 backdrop-blur-sm shadow-soft transition hover:shadow-lift">
                    <GraduationCap className="h-6 w-6 text-amber-700" />
                    <p className="mt-4 font-mono text-[10px] text-amber-800">PH.D. SCHOLARSHIP / {entry.year}</p>
                    <h4 className="mt-2 font-editorial text-xl font-bold text-slate-900">{entry.destination_institution}</h4>
                    <p className="mt-1 font-editorial text-sm font-semibold text-slate-700">{name} · {entry.country}</p>
                    <p className="mt-3 font-editorial text-sm leading-relaxed text-slate-600">{achievement}</p>
                  </article>
                );
              })}
            </div>
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
            {posts.map((post, index) => (
              <article key={`${post.type}-${index}`} className="soft-card flex flex-col p-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-700">
                  {post.type.replace('_', ' ')}
                </span>
                <h3 className="mt-3 font-editorial text-xl font-bold leading-snug text-slate-900">{post.title}</h3>
                <p className="mt-3 font-editorial text-sm leading-relaxed text-slate-600">
                  {post.abstract || post.collaboration || post.organizer || post.name || post.journal}
                </p>
                {post.link ? (
                  <a className="focus-ring mt-auto pt-5 font-editorial text-sm font-semibold text-sky-700 hover:underline" href={post.link} target="_blank" rel="noreferrer">
                    Read Publication <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
                  </a>
                ) : (
                  <a className="focus-ring mt-auto pt-5 font-editorial text-sm font-semibold text-sky-700 hover:underline" href="https://www.facebook.com/slscm.lab" target="_blank" rel="noreferrer">
                    Visit Fanpage <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
          <a
            className="focus-ring mt-8 inline-flex items-center rounded-xl border border-sky-200/80 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-sky-800 hover:bg-white shadow-soft"
            href="https://www.facebook.com/slscm.lab"
            target="_blank"
            rel="noreferrer"
          >
            Explore facebook.com/slscm.lab <ExternalLink className="ml-2 h-4 w-4" />
          </a>
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

              <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <h3 className="text-lg font-bold">Start a Conversation</h3>
                <label className="mt-5 block text-xs font-medium text-slate-300">
                  FULL NAME
                  <input
                    required
                    className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-500"
                    placeholder="e.g., Alex Hoang"
                  />
                </label>
                <label className="mt-4 block text-xs font-medium text-slate-300">
                  EMAIL ADDRESS
                  <input
                    required
                    type="email"
                    className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-500"
                    placeholder="you@university.edu"
                  />
                </label>
                <label className="mt-4 block text-xs font-medium text-slate-300">
                  INTENDED TRACK
                  <select className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white">
                    <option>Undergraduate Research Assistant</option>
                    <option>Graduate / Ph.D. Candidate</option>
                    <option>Industry Research Partnership</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Send className="mr-2 h-4 w-4" />
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
                src="/assets/images/slscm_logo.png"
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
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-800 pt-6 font-mono text-[10px] sm:flex-row">
          <span>© 2025-2026 SLSCM Lab · National Economics University. All rights reserved.</span>
          <span>Typeset in Faculty Glyphic · Onest · JetBrains Mono</span>
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
