import React, { useState } from 'react';
import { BookOpen, Search, Filter, Sparkles } from 'lucide-react';
import { Publication, PillarId } from '../types';
import { PaperCard } from '../components/PaperCard';
import publicationsData from '../data/slscm_publications_2025_2026.json';

export const PublicationsPage: React.FC = () => {
  const publications = publicationsData as unknown as Publication[];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const years = ['all', '2026', '2025'];
  const pillars = [
    { id: 'all', label: 'All Domains' },
    { id: 'operational_optimization', label: 'Operations & Algorithms' },
    { id: 'ml_optimization', label: 'AI & Data Science' },
    { id: 'green_transportation', label: 'Green Logistics & Drones' },
  ];
  const types = [
    { id: 'all', label: 'All Formats' },
    { id: 'journal', label: 'Journals (Q1/Q2)' },
    { id: 'conference', label: 'Conferences' },
    { id: 'book', label: 'Book Chapters' },
  ];

  const filteredPublications = publications.filter((paper) => {
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;
    const matchesPillar = selectedPillar === 'all' || paper.research_pillar === selectedPillar;
    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'journal' && (paper.type.toLowerCase().includes('journal') || paper.type.toLowerCase().includes('article'))) ||
      (selectedType === 'conference' && paper.type.toLowerCase().includes('conference')) ||
      (selectedType === 'book' && (paper.type.toLowerCase().includes('book') || paper.type.toLowerCase().includes('chapter')));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      paper.title.toLowerCase().includes(query) ||
      paper.authors.some((author) => author.toLowerCase().includes(query)) ||
      paper.venue.toLowerCase().includes(query) ||
      (paper.abstract && paper.abstract.toLowerCase().includes(query)) ||
      (paper.doi && paper.doi.toLowerCase().includes(query));

    return matchesYear && matchesPillar && matchesType && matchesSearch;
  });

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <BookOpen className="h-3.5 w-3.5 text-sky-600" />
          <span>Scholarly Research Archive</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Publications Vault
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          Comprehensive, searchable catalog of peer-reviewed journal papers, conference proceedings, and book
          chapters published by the faculty, researchers, and students of SLSCM Lab (2025–2026).
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white/85 p-5 shadow-xs backdrop-blur-md space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author name, journal venue, DOI or topic..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 font-editorial text-sm text-slate-800 placeholder:text-slate-400 focus-ring"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Year Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase text-slate-400 mr-1">Year:</span>
            {years.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`rounded-lg px-2.5 py-1 font-editorial text-xs font-semibold transition ${
                  selectedYear === yr
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {yr === 'all' ? 'All' : yr}
              </button>
            ))}
          </div>

          {/* Pillar Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase text-slate-400 mr-1">Pillar:</span>
            {pillars.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPillar(p.id)}
                className={`rounded-lg px-2.5 py-1 font-editorial text-xs font-semibold transition ${
                  selectedPillar === p.id
                    ? 'bg-sky-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Type Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase text-slate-400 mr-1">Type:</span>
            {types.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`rounded-lg px-2.5 py-1 font-editorial text-xs font-semibold transition ${
                  selectedType === t.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-6 flex items-center justify-between font-mono text-xs text-slate-500">
        <span>Displaying {filteredPublications.length} of {publications.length} publications</span>
        {(selectedYear !== 'all' || selectedPillar !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
          <button
            type="button"
            onClick={() => {
              setSelectedYear('all');
              setSelectedPillar('all');
              setSelectedType('all');
              setSearchQuery('');
            }}
            className="text-sky-700 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Publications Grid */}
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {filteredPublications.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white/80 p-12 text-center">
            <p className="font-editorial text-base text-slate-500">
              No publications match your selected filter criteria.
            </p>
          </div>
        ) : (
          filteredPublications.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))
        )}
      </div>
    </div>
  );
};
