import React, { useState } from 'react';
import { Newspaper, Calendar, Tag, ExternalLink, Search, Sparkles, Award } from 'lucide-react';
import { EventBrief } from '../types';
import eventsData from '../data/slscm_events.json';

export const EventsPage: React.FC = () => {
  const events = eventsData as unknown as EventBrief[];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All News & Briefs' },
    { id: 'breakthrough', label: 'Scientific Breakthroughs' },
    { id: 'placement', label: 'Scholarships & Placements' },
    { id: 'project', label: 'Project Launches' },
    { id: 'workshop', label: 'Workshops & Training' },
  ];

  const filteredEvents = events.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'breakthrough' && (item.category.includes('Breakthrough') || item.category.includes('Publication'))) ||
      (selectedCategory === 'placement' && item.category.includes('Placement')) ||
      (selectedCategory === 'project' && item.category.includes('Collaboration')) ||
      (selectedCategory === 'workshop' && item.category.includes('Transfer'));

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title_vi && item.title_vi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary_vi && item.summary_vi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content_vi && item.content_vi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <Newspaper className="h-3.5 w-3.5 text-sky-600" />
          <span>Events &amp; Research Briefs</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          News Briefs &amp; Milestones
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          Stay updated with the latest breakthroughs, international journal publications, top-tier scholarships,
          and knowledge exchange initiatives driven by the faculty and researchers of SLSCM Lab.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-200/90 bg-white/85 p-4 shadow-xs backdrop-blur-md">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-xl px-3 py-1.5 font-editorial text-xs font-semibold transition ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search briefs, keywords..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-4 font-editorial text-xs text-slate-800 placeholder:text-slate-400 focus-ring"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredEvents.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white/80 p-12 text-center">
            <p className="font-editorial text-base text-slate-500">
              No news briefs found matching your search.
            </p>
          </div>
        ) : (
          filteredEvents.map((item) => (
            <article
              key={item.id}
              className={`soft-card p-6 sm:p-7 bg-white/95 flex flex-col justify-between relative overflow-hidden ${
                item.featured ? 'border-sky-300 ring-1 ring-sky-200/50' : ''
              }`}
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-900">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-editorial text-xl font-bold text-slate-950 leading-snug">
                  {item.title}
                </h3>
                {item.title_vi && (
                  <p className="mt-1 font-editorial text-xs text-slate-500 italic">
                    {item.title_vi}
                  </p>
                )}

                {/* Summary */}
                <p className="mt-3 font-editorial text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {item.summary}
                </p>

                {/* Extended Content if available */}
                {item.content_vi && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3.5 border border-slate-200/60 font-editorial text-xs text-slate-600 leading-relaxed">
                    {item.content_vi}
                  </div>
                )}
              </div>

              {/* Tags & Action Link */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[9px] font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-sky-700 hover:bg-sky-100 transition"
                  >
                    <span>{item.link_label || 'Learn More'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
