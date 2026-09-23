import React, { useState } from 'react';
import {
  Presentation,
  Calendar,
  MapPin,
  ExternalLink,
  Search,
  FileText,
  Tag,
  Mic,
  Globe,
  Award,
  ChevronRight,
  Check,
} from 'lucide-react';
import { ConferenceTalk } from '../types';
import { getConferenceTalks } from '../repositories';

export const ConferencesTalksPage: React.FC = () => {
  const talks = getConferenceTalks();
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const venueTabs = [
    { id: 'all', label: 'All Conferences' },
    { id: 'ijcai', label: 'IJCAI (CORE A*)' },
    { id: 'springer', label: 'Springer LNNS / LNCS / CCIS' },
    { id: 'csonet', label: 'CSoNet Workshops' },
  ];

  const years = ['all', '2026', '2025'];

  const filteredTalks = talks.filter((item) => {
    const matchesYear = selectedYear === 'all' || item.year.toString() === selectedYear;

    let matchesVenue = true;
    if (selectedVenue === 'ijcai') {
      matchesVenue = item.event_name.includes('IJCAI');
    } else if (selectedVenue === 'springer') {
      matchesVenue =
        item.event_name.includes('COMOSA') ||
        item.event_name.includes('CITA') ||
        item.event_name.includes('SOICT') ||
        (item.series && item.series.includes('Springer')) ||
        item.event_name.includes('CSoNet 2024');
    } else if (selectedVenue === 'csonet') {
      matchesVenue = item.event_name.includes('CSoNet');
    }

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.event_name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      (item.series && item.series.toLowerCase().includes(query)) ||
      item.speakers.some((s) => s.name.toLowerCase().includes(query) || (s.affiliation && s.affiliation.toLowerCase().includes(query))) ||
      item.abstract.toLowerCase().includes(query) ||
      (item.key_topics && item.key_topics.some((t) => t.toLowerCase().includes(query)));

    return matchesYear && matchesVenue && matchesSearch;
  });

  const getVenueCount = (venueId: string) => {
    if (venueId === 'all') return talks.length;
    if (venueId === 'ijcai') return talks.filter((t) => t.event_name.includes('IJCAI')).length;
    if (venueId === 'springer')
      return talks.filter(
        (t) =>
          t.event_name.includes('COMOSA') ||
          t.event_name.includes('CITA') ||
          t.event_name.includes('SOICT') ||
          (t.series && t.series.includes('Springer')) ||
          t.event_name.includes('CSoNet 2024')
      ).length;
    if (venueId === 'csonet') return talks.filter((t) => t.event_name.includes('CSoNet')).length;
    return 0;
  };

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <Presentation className="h-3.5 w-3.5 text-sky-600" />
          <span>Academic Conferences &amp; Proceedings</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Conferences &amp; Proceedings
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          Peer-reviewed papers and oral presentations delivered by SLSCM Lab researchers at prestigious international
          conferences, including IJCAI (CORE A*), COMOSA, CITA (Springer LNNS), SOICT, and CSoNet.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/90 bg-white/85 p-4 shadow-xs backdrop-blur-md">
          {/* Venue Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/80 p-1">
            {venueTabs.map((tab) => {
              const count = getVenueCount(tab.id);
              const isActive = selectedVenue === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedVenue(tab.id)}
                  className={`rounded-lg px-3 py-1.5 font-editorial text-xs font-semibold transition ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1.5 font-mono text-[10px] text-slate-400">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Year Filter Chips */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-slate-400 mr-1">Year:</span>
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setSelectedYear(y)}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs font-medium transition ${
                  selectedYear === y
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {y === 'all' ? 'All' : y}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conference presentations by paper title, authors, conference, publisher, or topics..."
            className="w-full rounded-2xl border border-slate-200/90 bg-white/90 py-3.5 pl-11 pr-4 font-editorial text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 shadow-xs"
          />
        </div>
      </div>

      {/* Conference Cards List */}
      <div className="mt-8 space-y-6">
        {filteredTalks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
            <p className="font-editorial text-base text-slate-500">
              No conference presentations found matching your search or filters.
            </p>
          </div>
        ) : (
          filteredTalks.map((item) => (
            <div
              key={item.id}
              className="soft-card p-6 sm:p-7 bg-white/95 transition-all duration-200 hover:shadow-soft"
            >
              {/* Header Badges & Venue */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-900">
                    {item.type_badge}
                  </span>
                  <span className="rounded-lg bg-slate-100 border border-slate-200/70 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700 flex items-center gap-1">
                    <Globe className="h-3 w-3 text-slate-500" />
                    <span>{item.event_name}</span>
                  </span>
                  {item.series && (
                    <span className="font-mono text-[10px] text-slate-500 hidden md:inline-block">
                      · {item.series}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-sky-600" />
                    {item.date}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {item.format}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                {item.title}
              </h2>

              {/* Authors & Presenters */}
              <div className="mt-3.5 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs font-editorial">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                  <Mic className="h-3 w-3" />
                  Authors &amp; Presenters:
                </span>
                {item.speakers.map((s, idx) => (
                  <span key={idx} className="text-slate-800 font-semibold">
                    {s.name}
                    {s.role && (
                      <span className="text-slate-500 font-normal ml-1">
                        ({s.role})
                      </span>
                    )}
                    {s.affiliation && (
                      <span className="text-sky-700/80 font-normal ml-1">
                        · {s.affiliation}
                      </span>
                    )}
                    {idx < item.speakers.length - 1 && (
                      <span className="text-slate-300 ml-2 font-light">|</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Location */}
              <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{item.location}</span>
              </p>

              {/* Abstract */}
              <p className="mt-4 font-editorial text-sm text-slate-600 leading-relaxed">
                {item.abstract}
              </p>

              {/* Key Topics Chips */}
              {item.key_topics && item.key_topics.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Topics:
                  </span>
                  {item.key_topics.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-lg bg-slate-100 border border-slate-200/60 px-2 py-0.5 font-mono text-[10px] text-slate-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {item.paper_url && (
                    <a
                      href={item.paper_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-1.5 font-editorial text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 hover:text-sky-700 transition"
                    >
                      <FileText className="h-3.5 w-3.5 text-sky-600" />
                      <span>{item.paper_doi ? `DOI: ${item.paper_doi}` : 'Published Proceedings'}</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  )}

                  {item.slides_available && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-800">
                      <Check className="h-3 w-3 text-emerald-700" />
                      <span>Slides Available</span>
                    </span>
                  )}
                </div>

                <a
                  href="mailto:minhvd@neu.edu.vn?subject=Inquiry%20regarding%20SLSCM%20Conference%20Paper"
                  className="inline-flex items-center gap-1 font-editorial text-xs font-bold text-sky-700 hover:text-sky-900 transition"
                >
                  <span>Inquire with Authors</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
