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
type Person = { id: string; name: string; title_vi: string; affiliation_vi: string; email?: string; bio_vi: string; research_interests: string[] };
type HallEntry = { id: string; name: string; destination_institution: string; country: string; achievement_vi: string; field: string; year: number };
type Project = { id: string; title_vi: string; description_vi: string; period: string; status: string; collaboration?: string | null; leads?: { name: string }[] | null };
type Post = { type: string; title: string; abstract?: string; journal?: string; organizer?: string; collaboration?: string; name?: string; link?: string };

const overview = overviewData as typeof overviewData;
const people = peopleData as unknown as { leadership_and_faculty: Person[]; hall_of_fame: HallEntry[]; young_researchers_and_authors: { name: string; role_vi?: string }[] };
const projects = projectsData as unknown as Project[];
const publications = publicationsData as Publication[];
const posts = postsData as Post[];

const pillarNames: Record<PillarId, string> = {
  operational_optimization: 'Vận hành & Thuật toán',
  ml_optimization: 'Dữ liệu & AI',
  green_transportation: 'Vận tải xanh',
};

const navLinks = [
  ['Nghiên cứu', '#research'], ['Dự án', '#impact'], ['Kho công bố', '#publications'],
  ['Đội ngũ', '#people'], ['Lab life', '#lab-life'],
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
  return <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
    <div className="font-mono text-3xl font-semibold tracking-tight text-slate-900">{value}{suffix}</div>
    <div className="mt-1 text-sm font-semibold text-slate-800">{label}</div>
    <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">{detail}</div>
  </div>;
}

function HanoiClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const update = () => setTime(formatter.format(new Date()));
    update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer);
  }, []);
  return <span className="hidden items-center gap-1.5 md:inline-flex"><Clock3 className="h-3.5 w-3.5" />Hà Nội {time}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header>
    <div className="bg-slate-950 px-4 py-2 font-mono text-[10px] tracking-wide text-slate-300 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <span className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>STATUS: ACTIVE / P1613 A1</span>
        <span className="hidden items-center gap-1.5 lg:flex"><MapPin className="h-3.5 w-3.5" />207 Giải Phóng, Hà Nội</span>
        <HanoiClock />
        <a className="hidden hover:text-white sm:block" href="mailto:minhvd@neu.edu.vn">minhvd@neu.edu.vn</a>
      </div>
    </div>
    <nav aria-label="Điều hướng chính" className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="section-shell flex h-[72px] items-center justify-between gap-5">
        <a href="#top" className="focus-ring flex min-w-0 items-center gap-3 rounded-xl">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-700 to-cyan-500 font-mono text-sm font-bold text-white shadow-lg shadow-sky-200">SL</span>
          <span className="min-w-0"><span className="block font-editorial text-xl leading-none text-slate-950">SLSCM Lab</span><span className="hidden text-[10px] text-slate-500 sm:block">Smart Logistics & Supply Chain · NEU</span></span>
        </a>
        <div className="hidden items-center gap-5 lg:flex">{navLinks.map(([label, href]) => <a key={href} className="focus-ring rounded text-sm font-medium text-slate-600 transition hover:text-sky-700" href={href}>{label}</a>)}</div>
        <div className="flex items-center gap-2"><a href="#join" className="focus-ring hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 sm:inline-flex">Gia nhập Lab <ArrowRight className="ml-1 h-4 w-4" /></a>
          <button aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open} className="focus-ring rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
      </div>
      <AnimatePresence>{open && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-slate-100 bg-white lg:hidden">
        <div className="section-shell grid gap-1 py-4">{navLinks.concat([['Gia nhập Lab', '#join']]).map(([label, href]) => <a onClick={() => setOpen(false)} key={href} href={href} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{label}</a>)}</div>
      </motion.div>}</AnimatePresence>
    </nav>
  </header>;
}

function Hero() {
  return <section id="top" className="mesh overflow-hidden bg-white py-20 sm:py-28"><div className="section-shell">
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="max-w-4xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-sky-800"><Sparkles className="h-3.5 w-3.5" />Trường Công nghệ · Đại học Kinh tế Quốc dân</div>
      <h1 className="mt-6 max-w-4xl font-editorial text-5xl leading-[1.04] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">The <em className="bg-gradient-to-r from-sky-800 to-cyan-600 bg-clip-text text-transparent">Optimizing Frontier</em> for resilient supply chains.</h1>
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">Nơi giao thoa giữa Vận trù học hiện đại, Trí tuệ Nhân tạo và Vận tải thế hệ mới - biến các bài toán phức tạp thành hạ tầng thông minh, bền vững.</p>
      <div className="mt-8 flex flex-wrap gap-3"><a href="#research" className="focus-ring inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60 transition hover:bg-sky-700">Khám phá nghiên cứu <ArrowRight className="ml-2 h-4 w-4" /></a><a href="#publications" className="focus-ring inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50">Mở Research Vault</a></div>
    </motion.div>
    <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4"><Counter target={19} suffix="" label="Công bố quốc tế" detail="2025 - 2026" /><Counter target={11} suffix="" label="Tạp chí Q1" detail="journal articles" /><Counter target={3} suffix="" label="Học bổng PhD" detail="SMU · UCONN · LJMU" /><Counter target={4} suffix="" label="Dự án đang hoạt động" detail="real-world impact" /></div>
    <div className="mt-6 flex flex-wrap gap-2">{['VRP & Drone Routing', 'MetaPerceptron AI', 'EVRP-TW', 'Học bổng SMU', 'Nước thông minh Hà Nội'].map((chip) => <span key={chip} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 font-mono text-[11px] text-slate-600">{chip}</span>)}</div>
  </div></section>;
}

function ResearchAndProjects() {
  const icons = [Truck, Bot, Leaf];
  const treatments = ['border-sky-200 bg-sky-50/55 text-sky-800', 'border-cyan-200 bg-cyan-50/55 text-cyan-800', 'border-emerald-200 bg-emerald-50/55 text-emerald-800'];
  return <><section id="research" className="bg-slate-50 py-20"><div className="section-shell"><SectionHead eyebrow="RESEARCH ARCHITECTURE" title="Ba trụ cột, một tiêu chuẩn khoa học nghiêm cẩn." text="Từ thuật toán chính xác đến hệ thống ra quyết định triển khai trong thế giới thực." />
    <div className="mt-10 grid gap-5 md:grid-cols-3">{overview.research_pillars.map((pillar, index) => { const Icon = icons[index]; return <motion.article whileHover={{ y: -5 }} key={pillar.id} className={`rounded-3xl border p-6 shadow-soft ${treatments[index]}`}><Icon className="h-7 w-7" /><p className="mt-5 font-mono text-[10px] font-semibold tracking-widest opacity-70">0{index + 1} / {index === 0 ? 'EXACT + HEURISTIC' : index === 1 ? 'AI / OR INTERSECTION' : 'GREEN LOGISTICS'}</p><h3 className="mt-2 text-xl font-bold leading-snug text-slate-900">{pillar.title_en}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{pillar.description_vi}</p><pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-[10px] leading-relaxed text-cyan-200">{index === 0 ? 'min Σ cᵢⱼxᵢⱼ  |  x ∈ feasible routes' : index === 1 ? 'min_W 𝓛(y, f(X; W)) + λ||W||²' : 'SOCᵢ₊₁ = SOCᵢ - P · Δt + Echarge'}</pre><div className="mt-5 flex flex-wrap gap-1.5">{pillar.topics.slice(0, 3).map((topic) => <span key={topic} className="rounded-md bg-white/80 px-2 py-1 font-mono text-[10px] text-slate-600">{topic}</span>)}</div></motion.article>})}</div>
  </div></section>
  <section id="impact" className="bg-white py-20"><div className="section-shell"><SectionHead eyebrow="FROM MODELS TO IMPACT" title="Thuật toán tạo giá trị ngoài phòng lab." text="Các dự án liên kết hạ tầng đô thị, logistics tự hành và khoa học quyết định." />
    <div className="mt-10 grid gap-5 lg:grid-cols-3">{projects.slice(0, 3).map((project, i) => <article key={project.id} className="soft-card flex flex-col p-6"><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sky-700">0{i + 1} / {project.status}</span><h3 className="mt-4 text-xl font-bold leading-snug text-slate-900">{project.title_vi}</h3><p className="mt-3 line-clamp-5 text-sm leading-relaxed text-slate-600">{project.description_vi}</p><div className="mt-auto pt-6"><div className="border-t border-slate-100 pt-4 font-mono text-[10px] text-slate-500">{project.period}</div>{project.collaboration && <p className="mt-2 text-xs text-slate-500">{project.collaboration}</p>}</div></article>)}</div>
  </div></section></>;
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition ${active ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{children}</button>;
}

function PublicationsVault() {
  const [query, setQuery] = useState(''); const [year, setYear] = useState('all'); const [type, setType] = useState('all'); const [pillar, setPillar] = useState('all'); const [selected, setSelected] = useState<Publication | null>(null); const [copied, setCopied] = useState(false);
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  const filtered = useMemo(() => publications.filter((paper) => { const haystack = [paper.title, paper.authors.join(' '), paper.venue, paper.doi].join(' ').toLocaleLowerCase(); return haystack.includes(query.toLocaleLowerCase()) && (year === 'all' || String(paper.year) === year) && (type === 'all' || paper.type === type) && (pillar === 'all' || paper.research_pillar === pillar); }), [query, year, type, pillar]);
  const copy = async (bibtex: string) => { try { await navigator.clipboard.writeText(bibtex); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } };
  return <section id="publications" className="bg-slate-50 py-20"><div className="section-shell"><SectionHead eyebrow="RESEARCH VAULT / 19 RECORDS" title="Công bố có thể khám phá, trích dẫn và đối thoại." text="Tìm kiếm đầy đủ theo tiêu đề, tác giả, venue hoặc DOI; lọc trực tiếp trên danh mục đã xác thực." />
    <div className="mt-9 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6"><div className="relative"><Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" /><input aria-label="Tìm kiếm bài báo khoa học" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm bài báo, tác giả, tạp chí hoặc DOI..." className="focus-ring w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400" /></div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3"><FilterGroup title="Năm">{['all', '2026', '2025'].map((value) => <FilterPill key={value} active={year === value} onClick={() => setYear(value)}>{value === 'all' ? 'Tất cả' : value}</FilterPill>)}</FilterGroup><FilterGroup title="Loại">{['all', 'Journal', 'Conference', 'Book Chapter'].map((value) => <FilterPill key={value} active={type === value} onClick={() => setType(value)}>{value === 'all' ? 'Tất cả' : value === 'Journal' ? 'Q1 Journal' : value}</FilterPill>)}</FilterGroup><FilterGroup title="Pillar">{(['all', ...Object.keys(pillarNames)] as ('all' | PillarId)[]).map((value) => <FilterPill key={value} active={pillar === value} onClick={() => setPillar(value)}>{value === 'all' ? 'Tất cả' : pillarNames[value]}</FilterPill>)}</FilterGroup></div>
    </div>
    <p className="mt-5 font-mono text-xs text-slate-500">{filtered.length} / {publications.length} publications</p><div className="mt-4 grid gap-3">{filtered.map((paper) => <article key={paper.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:border-sky-200 hover:shadow-lift"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2 font-mono text-[10px]"><span className="rounded-full bg-sky-50 px-2 py-1 text-sky-800">{paper.type === 'Journal' ? 'Q1 JOURNAL' : paper.type.toUpperCase()}</span><span className="text-slate-500">{paper.year}</span><span className="text-emerald-700">{pillarNames[paper.research_pillar]}</span></div><h3 className="mt-3 text-base font-bold leading-snug text-slate-900 sm:text-lg">{paper.title}</h3><p className="mt-2 text-sm text-slate-600">{paper.authors.join(', ')}</p><p className="mt-1 font-editorial text-base italic text-slate-700">{paper.venue}</p><p className="mt-2 font-mono text-[10px] text-slate-500">DOI: {paper.doi}</p></div><div className="flex shrink-0 items-start gap-2"><a aria-label={`Mở DOI ${paper.title}`} href={paper.link} target="_blank" rel="noreferrer" className="focus-ring rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"><ExternalLink className="h-4 w-4" /></a><button onClick={() => { setSelected(paper); setCopied(false); }} className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-sky-700"><FileText className="h-4 w-4" />BibTeX</button></div></div></article>)}</div>{filtered.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">Không tìm thấy công bố phù hợp.</p>}
  </div><AnimatePresence>{selected && <motion.div role="dialog" aria-modal="true" aria-labelledby="paper-modal-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={() => setSelected(null)}><motion.div initial={{ scale: .96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .96, y: 12 }} onMouseDown={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[10px] uppercase tracking-widest text-sky-700">{selected.type} / {selected.year}</p><h2 id="paper-modal-title" className="mt-2 text-xl font-bold leading-snug text-slate-900">{selected.title}</h2></div><button aria-label="Đóng cửa sổ" className="focus-ring rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" onClick={() => setSelected(null)}><X /></button></div><p className="mt-5 text-sm leading-relaxed text-slate-600">{selected.abstract}</p><div className="mt-6 flex items-center justify-between"><span className="font-mono text-xs font-medium text-slate-600">BibTeX citation</span><button onClick={() => copy(selected.bibtex)} className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">{copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? 'Đã sao chép!' : 'Sao chép BibTeX'}</button></div><pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-200">{selected.bibtex}</pre></motion.div></motion.div>}</AnimatePresence></section>;
}

function PeopleAndLife() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return <><section id="people" className="bg-white py-20"><div className="section-shell"><SectionHead eyebrow="MENTORSHIP + TRAJECTORIES" title="Nghiêm cẩn trong hướng dẫn, rộng mở trong hành trình." text="Một cộng đồng giáo sư, nghiên cứu viên và sinh viên mang nghiên cứu Việt Nam tới các diễn đàn quốc tế." />
    <div className="mt-10 grid gap-5 lg:grid-cols-3">{people.leadership_and_faculty.map((person, index) => <article key={person.id} className={`soft-card p-6 ${index === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-8' : ''}`}><div><span className="font-mono text-[10px] uppercase tracking-widest text-amber-700">{index === 0 ? 'HEAD OF LAB' : 'FACULTY + ADVISOR'}</span><div className="mt-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-sky-700 font-editorial text-2xl text-white">{person.name.split(' ').slice(-1)[0][0]}</div><h3 className="mt-4 text-xl font-bold text-slate-900">{person.name}</h3><p className="mt-1 text-sm font-medium text-sky-800">{person.title_vi}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{person.affiliation_vi}</p></div><div className={index === 0 ? 'mt-5 lg:mt-0' : 'mt-5'}><p className="text-sm leading-relaxed text-slate-600">{person.bio_vi}</p><div className="mt-4 flex flex-wrap gap-1.5">{person.research_interests.slice(0, 3).map((interest) => <span key={interest} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{interest}</span>)}</div>{person.email && <a className="focus-ring mt-5 inline-flex items-center text-sm font-semibold text-sky-700 hover:underline" href={`mailto:${person.email}`}><Mail className="mr-2 h-4 w-4" />{person.email}</a>}</div></article>)}</div>
    <div className="mt-14"><div className="flex items-end justify-between gap-5"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-700">HALL OF FAME</p><h3 className="mt-2 font-editorial text-3xl text-slate-900">Placements without borders.</h3></div><Trophy className="hidden h-10 w-10 text-amber-500 sm:block" /></div><div className="mt-6 grid gap-4 md:grid-cols-3">{people.hall_of_fame.map((entry) => <article key={entry.id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5"><GraduationCap className="h-6 w-6 text-amber-700" /><p className="mt-4 font-mono text-[10px] text-amber-800">PHD SCHOLARSHIP / {entry.year}</p><h4 className="mt-2 text-lg font-bold text-slate-900">{entry.destination_institution}</h4><p className="mt-1 text-sm font-semibold text-slate-700">{entry.name} · {entry.country}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{entry.achievement_vi}</p></article>)}</div></div>
  </div></section>
  <section id="lab-life" className="bg-slate-50 py-20"><div className="section-shell"><SectionHead eyebrow="LAB LIFE / CURATED FACEBOOK DIGEST" title="Một lab đang sống, học và công bố." text="Các cập nhật thực tế được tuyển chọn từ fanpage chính thức của SLSCM Lab." /><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{posts.map((post, index) => <article key={`${post.type}-${index}`} className="soft-card flex flex-col p-6"><span className="font-mono text-[10px] uppercase tracking-widest text-cyan-700">{post.type.replace('_', ' ')}</span><h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">{post.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{post.abstract || post.collaboration || post.organizer || post.name || post.journal}</p>{post.link ? <a className="focus-ring mt-auto pt-5 text-sm font-semibold text-sky-700 hover:underline" href={post.link} target="_blank" rel="noreferrer">Đọc công bố <ExternalLink className="ml-1 inline h-3.5 w-3.5" /></a> : <a className="focus-ring mt-auto pt-5 text-sm font-semibold text-sky-700 hover:underline" href="https://www.facebook.com/slscm.lab" target="_blank" rel="noreferrer">Mở fanpage <ExternalLink className="ml-1 inline h-3.5 w-3.5" /></a>}</article>)}</div><a className="focus-ring mt-8 inline-flex items-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 hover:bg-sky-100" href="https://www.facebook.com/slscm.lab" target="_blank" rel="noreferrer">Ghé thăm facebook.com/slscm.lab <ExternalLink className="ml-2 h-4 w-4" /></a></div></section>
  <section id="join" className="bg-white py-20"><div className="section-shell"><div className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-2xl sm:p-10"><div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]"><div><p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">OPEN OPPORTUNITIES</p><h2 className="mt-3 max-w-xl font-editorial text-4xl leading-tight">Giải bài toán lớn cùng chúng tôi.</h2><p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">SLSCM Lab chào đón những người yêu toán tối ưu, AI và các hệ thống logistics nhân văn hơn.</p><div className="mt-7 grid gap-3 sm:grid-cols-3">{[['Undergraduate', 'Toán nền tảng, Python, khao khát nghiên cứu.'], ['Graduate / PhD', 'Đề tài thực chiến, công bố và đồng hướng dẫn.'], ['Industry', 'Tối ưu mạng lưới, điều vận và dự báo.']].map(([title, text]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4"><Users className="h-5 w-5 text-emerald-300" /><h3 className="mt-3 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{text}</p></div>)}</div><div className="mt-8 flex flex-wrap gap-4 font-mono text-xs text-slate-300"><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-300" />P1613, Tòa A1, NEU</span><a className="focus-ring flex items-center gap-2 text-white hover:text-cyan-200" href="mailto:minhvd@neu.edu.vn"><Mail className="h-4 w-4 text-cyan-300" />minhvd@neu.edu.vn</a></div></div><form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur"><h3 className="text-lg font-bold">Bắt đầu cuộc trò chuyện</h3><label className="mt-5 block text-xs font-medium text-slate-300">HỌ VÀ TÊN<input required className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white" placeholder="Nguyễn Văn A" /></label><label className="mt-4 block text-xs font-medium text-slate-300">EMAIL<input required type="email" className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white" placeholder="you@neu.edu.vn" /></label><label className="mt-4 block text-xs font-medium text-slate-300">ĐỊNH HƯỚNG<select className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2.5 text-sm text-white"><option>Undergraduate researcher</option><option>Graduate researcher</option><option>Industry partnership</option></select></label><button className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"><Send className="mr-2 h-4 w-4" />{submitted ? 'Đã ghi nhận - xin cảm ơn!' : 'Gửi quan tâm'}</button></form></div></div></div></section></>;
}

function Footer() { return <footer className="bg-slate-950 py-14 text-slate-400"><div className="section-shell"><div className="grid gap-9 md:grid-cols-[1.2fr_.7fr_.7fr]"><div><div className="flex items-center gap-3 text-white"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 font-mono text-xs font-bold">SL</span><span className="font-editorial text-xl">SLSCM Lab</span></div><p className="mt-4 max-w-md text-sm leading-relaxed">Smart Logistics & Supply Chain Management Lab<br />Trường Công nghệ · Đại học Kinh tế Quốc dân</p><p className="mt-4 flex items-start gap-2 font-mono text-[11px]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />P1613, Tòa nhà A1, 207 Giải Phóng, Hà Nội</p></div><div><h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">Khám phá</h3><div className="mt-4 grid gap-2 text-sm">{navLinks.map(([label, href]) => <a className="hover:text-white" key={href} href={href}>{label}</a>)}</div></div><div><h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">Liên kết</h3><div className="mt-4 grid gap-2 text-sm"><a className="hover:text-white" href="https://fda.neu.edu.vn/slscm/" target="_blank" rel="noreferrer">FDA · NEU <ExternalLink className="inline h-3 w-3" /></a><a className="hover:text-white" href="https://www.facebook.com/slscm.lab" target="_blank" rel="noreferrer">Facebook <ExternalLink className="inline h-3 w-3" /></a><a className="hover:text-white" href="https://maps.google.com/?q=National+Economics+University+Hanoi" target="_blank" rel="noreferrer">Bản đồ P1613 <ExternalLink className="inline h-3 w-3" /></a></div></div></div><div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-800 pt-6 font-mono text-[10px] sm:flex-row"><span>© 2025-2026 SLSCM Lab · NEU. All rights reserved.</span><span>Typeset in Onest · Faculty Glyphic · JetBrains Mono</span></div></div></footer>; }

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="max-w-2xl"><p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-sky-700">{eyebrow}</p><h2 className="mt-3 font-editorial text-4xl leading-tight text-slate-950 sm:text-5xl">{title}</h2><p className="mt-4 text-base leading-relaxed text-slate-600">{text}</p></div>; }
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) { return <div><p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">{title}</p><div className="flex flex-wrap gap-1.5">{children}</div></div>; }

export default function App() { return <><Header /><main><Hero /><ResearchAndProjects /><PublicationsVault /><PeopleAndLife /></main><Footer /></>; }
