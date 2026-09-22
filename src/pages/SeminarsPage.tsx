import React, { useState } from 'react';
import { Presentation, Calendar, Clock, MapPin, Video, FileText, CheckCircle, Tag, Search, ArrowUpRight } from 'lucide-react';
import { Seminar } from '../types';
import seminarsData from '../data/slscm_seminars.json';

export const SeminarsPage: React.FC = () => {
  const seminars = seminarsData as unknown as Seminar[];
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'archived'>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tracks = [
    { id: 'all', label: 'All Tracks' },
    { id: 'opt', label: 'Operational Optimization' },
    { id: 'drone', label: 'Drone & Green Logistics' },
    { id: 'sched', label: 'Industrial Scheduling' },
    { id: 'smart', label: 'Smart Cities & AI' },
  ];

  const filteredSeminars = seminars.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'upcoming' && item.status === 'Upcoming') ||
      (activeTab === 'archived' && item.status === 'Archived');

    const matchesTrack =
      selectedTrack === 'all' ||
      (selectedTrack === 'opt' && item.track.toLowerCase().includes('optimization')) ||
      (selectedTrack === 'drone' && (item.track.toLowerCase().includes('drone') || item.track.toLowerCase().includes('transportation'))) ||
      (selectedTrack === 'sched' && item.track.toLowerCase().includes('scheduling')) ||
      (selectedTrack === 'smart' && item.track.toLowerCase().includes('smart'));

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title_vi && item.title_vi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.affiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesTrack && matchesSearch;
  });

  const upcomingCount = seminars.filter((s) => s.status === 'Upcoming').length;
  const archivedCount = seminars.filter((s) => s.status === 'Archived').length;

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <Presentation className="h-3.5 w-3.5 text-sky-600" />
          <span>Academic Colloquia &amp; Seminars</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Seminars &amp; Research Talks
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          SLSCM Lab hosts regular scholarly presentations, guest lectures, and doctoral defenses featuring
          prominent researchers from Singapore Management University, VNU-HUS, HUST, University of Udine,
          and CIRRELT Montréal.
        </p>
      </div>

      {/* Filter and Tab Bar */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/90 bg-white/85 p-4 shadow-xs backdrop-blur-md">
        {/* Status Tabs */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
              activeTab === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Talks ({seminars.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-lg px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
              activeTab === 'upcoming' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archived')}
            className={`rounded-lg px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
              activeTab === 'archived' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>

        {/* Track Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTrack(t.id)}
              className={`rounded-xl px-3 py-1 font-editorial text-xs font-medium transition ${
                selectedTrack === t.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search speaker, topic..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-4 font-editorial text-xs text-slate-800 placeholder:text-slate-400 focus-ring"
          />
        </div>
      </div>

      {/* Seminars Timeline List */}
      <div className="mt-8 space-y-6">
        {filteredSeminars.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-12 text-center">
            <p className="font-editorial text-base text-slate-500">
              No seminars found matching the current criteria.
            </p>
          </div>
        ) : (
          filteredSeminars.map((item) => (
            <article
              key={item.id}
              className="soft-card p-6 sm:p-7 bg-white/95 border-slate-200/90 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  {/* Category and Status Badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-900">
                      {item.category}
                    </span>
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                      {item.track}
                    </span>
                    {item.status === 'Upcoming' ? (
                      <span className="rounded-lg bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide animate-pulse">
                        Upcoming Event
                      </span>
                    ) : (
                      <span className="rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 font-mono text-[10px] font-semibold">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Talk Title */}
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                    {item.title}
                  </h3>
                  {item.title_vi && (
                    <p className="mt-1 font-editorial text-sm text-slate-500 italic">
                      {item.title_vi}
                    </p>
                  )}

                  {/* Speaker Info */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-sky-950 font-mono text-xs font-bold text-white shadow-xs">
                      {item.speaker.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-editorial text-base font-bold text-slate-900 leading-tight">
                        {item.speaker}
                      </p>
                      <p className="font-editorial text-xs text-sky-800">
                        {item.speaker_role || item.affiliation}
                      </p>
                    </div>
                  </div>

                  {/* Abstract */}
                  <div className="mt-4 rounded-xl bg-slate-50/80 p-4 border border-slate-200/60">
                    <p className="font-mono text-[10px] uppercase font-bold text-slate-400 mb-1.5">Talk Abstract</p>
                    <p className="font-editorial text-xs sm:text-sm leading-relaxed text-slate-700">
                      {item.abstract_en || item.abstract}
                    </p>
                  </div>

                  {/* Key Topics */}
                  {item.key_topics && (
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400 mr-1">Topics:</span>
                      {item.key_topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Logistics & Materials Sidebar */}
                <div className="w-full md:w-64 shrink-0 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 space-y-3 font-editorial text-xs">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                    <Calendar className="h-3.5 w-3.5 text-sky-600" />
                    <span>{item.date}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item.time}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item.venue}</span>
                  </div>

                  {/* Materials Badges */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <p className="font-mono text-[10px] font-bold uppercase text-slate-400">Materials</p>
                    <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                      {item.slides_available ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle className="h-3 w-3" /> Slides Archived
                        </span>
                      ) : (
                        <span className="text-slate-400">Slides upon request</span>
                      )}

                      {item.recording_available && (
                        <span className="inline-flex items-center gap-1 text-sky-700 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200">
                          <Video className="h-3 w-3" /> Recording Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
