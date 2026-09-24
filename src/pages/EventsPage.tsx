import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { EventBrief } from '../types';
import { getEvents } from '../repositories';

export const EventsPage: React.FC = () => {
  const events = getEvents();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['brief-ep20-workshop-series-2026'])
  );
  const [langMap, setLangMap] = useState<Record<string, 'en' | 'vi'>>({});

  const categories = [
    { id: 'all', label: 'All News & Briefs' },
    { id: 'workshop', label: 'Workshops & Training' },
    { id: 'breakthrough', label: 'Scientific Breakthroughs' },
    { id: 'placement', label: 'Scholarships & Placements' },
    { id: 'project', label: 'Project Launches' },
  ];

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return events.length;
    return events.filter((item) => {
      if (catId === 'breakthrough') {
        return item.category.includes('Breakthrough') || item.category.includes('Publication');
      }
      if (catId === 'placement') {
        return item.category.includes('Placement');
      }
      if (catId === 'project') {
        return item.category.includes('Collaboration');
      }
      if (catId === 'workshop') {
        return (
          item.category.toLowerCase().includes('workshop') ||
          item.category.toLowerCase().includes('training') ||
          item.category.toLowerCase().includes('transfer') ||
          item.tags?.some(
            (t) =>
              t.toLowerCase().includes('workshop') ||
              t.toLowerCase().includes('training')
          )
        );
      }
      return false;
    }).length;
  };

  const filteredEvents = events.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'breakthrough' &&
        (item.category.includes('Breakthrough') ||
          item.category.includes('Publication'))) ||
      (selectedCategory === 'placement' &&
        item.category.includes('Placement')) ||
      (selectedCategory === 'project' &&
        item.category.includes('Collaboration')) ||
      (selectedCategory === 'workshop' &&
        (item.category.toLowerCase().includes('workshop') ||
          item.category.toLowerCase().includes('training') ||
          item.category.toLowerCase().includes('transfer') ||
          item.tags?.some(
            (t) =>
              t.toLowerCase().includes('workshop') ||
              t.toLowerCase().includes('training')
          )));

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title_vi && item.title_vi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary_en && item.summary_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.summary_vi && item.summary_vi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content_en && item.content_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content_vi && item.content_vi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleLang = (id: string) => {
    setLangMap((prev) => ({
      ...prev,
      [id]: prev[id] === 'vi' ? 'en' : 'vi',
    }));
  };

  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return (
      <div className="space-y-3 font-editorial text-xs sm:text-[13px] leading-relaxed text-slate-700">
        {paragraphs.map((para, pIdx) => {
          if (para.startsWith('### ')) {
            return (
              <h4
                key={pIdx}
                className="font-bold text-sm text-slate-950 pt-2 border-t border-slate-200/60 first:pt-0 first:border-0"
              >
                {para.replace('### ', '')}
              </h4>
            );
          }
          if (para.includes('\n• ') || para.startsWith('• ')) {
            const lines = para.split('\n');
            const header = lines[0].startsWith('• ') ? null : lines[0];
            const bulletLines = lines.filter((l) => l.startsWith('• '));
            return (
              <div key={pIdx} className="space-y-1.5">
                {header && <p className="font-semibold text-slate-900">{header}</p>}
                <ul className="space-y-1 pl-1">
                  {bulletLines.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                      <span>{b.replace('• ', '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          return <p key={pIdx}>{para}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <Icon name="newspaper" className="h-3.5 w-3.5 text-sky-600" />
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
          {categories.map((c) => {
            const count = getCategoryCount(c.id);
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-editorial text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{c.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                    isSelected
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search briefs, tags (e.g. EP20)..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-8 font-editorial text-xs text-slate-800 placeholder:text-slate-400 focus-ring"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-mono text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredEvents.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white/80 p-12 text-center">
            <p className="font-editorial text-base text-slate-500">
              No news briefs found matching your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-sky-700 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredEvents.map((item) => {
            const hasVi = Boolean(item.content_vi || item.summary_vi);
            const isVi = langMap[item.id] === 'vi' && hasVi;
            const displayTitle = isVi && item.title_vi ? item.title_vi : item.title;
            const displaySummary =
              isVi && item.summary_vi ? item.summary_vi : item.summary_en || item.summary;
            const displayContent =
              isVi && item.content_vi ? item.content_vi : item.content_en;

            const isExpanded = expandedItems.has(item.id);
            const hasExtendedContent = Boolean(displayContent);

            return (
              <article
                key={item.id}
                className={`soft-card p-6 sm:p-7 bg-white/95 flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
                  item.featured
                    ? 'border-sky-300 ring-2 ring-sky-200/50 shadow-sm'
                    : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-900">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasVi && (
                        <button
                          type="button"
                          onClick={() => toggleLang(item.id)}
                          className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 hover:bg-slate-100 transition"
                          title="Toggle Language EN / VI"
                        >
                          {isVi ? 'VI' : 'EN'}
                        </button>
                      )}
                      <div className="flex items-center gap-1 font-mono text-xs text-slate-500">
                        <Icon name="calendar_today" className="h-3 w-3 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-editorial text-xl font-bold text-slate-950 leading-snug">
                    {displayTitle}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 font-editorial text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {displaySummary}
                  </p>

                  {/* Extended Content if available */}
                  {hasExtendedContent && displayContent && (
                    <div className="mt-4">
                      {isExpanded ? (
                        <div className="rounded-xl bg-slate-50/90 p-4 border border-slate-200/70">
                          {renderFormattedContent(displayContent)}
                          <button
                            type="button"
                            onClick={() => toggleExpand(item.id)}
                            className="mt-3 inline-flex items-center gap-1 font-editorial text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                          >
                            <span>Collapse announcement</span>
                            <Icon name="expand_less" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/60 px-3 py-1.5 font-editorial text-xs font-semibold text-sky-800 hover:bg-sky-100 transition"
                        >
                          <Icon name="article" className="h-3.5 w-3.5 text-sky-600" />
                          <span>View Full Workshop Overview &amp; Topics</span>
                          <Icon name="expand_more" className="h-3.5 w-3.5 text-sky-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags & Action Link */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags?.map((tag) => {
                      const isWorkshopTag =
                        tag.toLowerCase().includes('workshop') ||
                        tag.toLowerCase().includes('training');
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isWorkshopTag) {
                              setSelectedCategory('workshop');
                            } else {
                              setSearchQuery(tag);
                            }
                          }}
                          title={`Filter by #${tag}`}
                          className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-medium transition cursor-pointer ${
                            isWorkshopTag
                              ? 'bg-amber-100 text-amber-900 border border-amber-300/80 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-sky-700 hover:bg-sky-100 transition"
                    >
                      <span>{item.link_label || 'Learn More'}</span>
                      <Icon name="open_in_new" className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
