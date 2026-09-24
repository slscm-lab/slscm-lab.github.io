import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { Project } from '../types';
import { PaperCard } from '../components/PaperCard';
import { getProjects } from '../repositories';

export const ProjectsPage: React.FC = () => {
  const projects = getProjects();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains = [
    { id: 'all', label: 'All Projects' },
    { id: 'drone', label: 'Drones & Green Logistics' },
    { id: 'exact', label: 'Exact Algorithms & Conic OR' },
    { id: 'water', label: 'Urban IoT & Smart Cities' },
    { id: 'sched', label: 'Industrial Scheduling' },
    { id: 'training', label: 'Executive Training' },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesDomain =
      selectedDomain === 'all' ||
      (selectedDomain === 'drone' && (project.id.includes('fstsp') || project.tags?.some((t) => t.toLowerCase().includes('drone')))) ||
      (selectedDomain === 'exact' && (project.id.includes('cfl') || project.tags?.some((t) => t.toLowerCase().includes('informs')))) ||
      (selectedDomain === 'water' && (project.id.includes('water') || project.tags?.some((t) => t.toLowerCase().includes('water')))) ||
      (selectedDomain === 'sched' && (project.id.includes('sched') || project.id.includes('arc') || project.id.includes('inventory'))) ||
      (selectedDomain === 'training' && project.id.includes('training'));

    const matchesSearch =
      searchQuery.trim() === '' ||
      (project.title_en && project.title_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description_en && project.description_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.leads?.some((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesSearch;
  });

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <Icon name="work" className="h-3.5 w-3.5 text-sky-600" />
          <span>Research Grants &amp; Projects Vault</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Projects &amp; Associated Publications
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          SLSCM Lab leads cutting-edge research initiatives bridging theoretical mathematical optimization
          with real-world logistical operations. Every project directly yields high-impact international
          publications and actionable open-source algorithms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-200/90 bg-white/85 p-4 shadow-xs backdrop-blur-md">
        {/* Domain Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {domains.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDomain(d.id)}
              className={`rounded-xl px-3 py-1.5 font-editorial text-xs font-semibold transition ${
                selectedDomain === d.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, leads, keywords..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-4 font-editorial text-xs text-slate-800 placeholder:text-slate-400 focus-ring"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="mt-8 space-y-10">
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-12 text-center">
            <p className="font-editorial text-base text-slate-500">
              No projects found matching your filter or keyword.
            </p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <section
              key={project.id}
              id={project.id}
              className="soft-card p-6 sm:p-8 bg-white/95 relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  {/* Category & Grant ID Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-lg bg-sky-100/90 text-sky-900 px-2.5 py-0.5 font-mono text-[11px] font-bold">
                      {project.category_en || project.category}
                    </span>
                    {project.grant_code && (
                      <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[11px] text-slate-700 font-medium">
                        Code: {project.grant_code}
                      </span>
                    )}
                    <span className="rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 font-mono text-[11px] font-bold">
                      {project.status}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500 ml-auto">
                      <Icon name="calendar_today" className="h-3 w-3" />
                      {project.period}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-950 leading-snug">
                    {project.title_en}
                  </h2>

                  {/* Sponsor / Collaboration Info */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-editorial">
                    {project.sponsor && (
                      <span className="inline-flex items-center gap-1 font-semibold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200/80">
                        <Icon name="workspace_premium" className="h-3.5 w-3.5 text-sky-600" />
                        Sponsor: {project.sponsor}
                      </span>
                    )}
                    {project.collaboration && (
                      <span className="text-slate-600">
                        {project.collaboration}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-4 font-editorial text-sm sm:text-base leading-relaxed text-slate-700">
                    {project.description_en}
                  </p>

                  {/* Methodology Note */}
                  {project.methodology && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 text-xs">
                      <span className="font-mono font-bold uppercase text-slate-500 mr-2">Methodology:</span>
                      <span className="font-editorial text-slate-700">{project.methodology}</span>
                    </div>
                  )}

                  {/* Key Outcomes */}
                  {project.outcomes_en && project.outcomes_en.length > 0 && (
                    <div className="mt-5">
                      <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                        Key Outcomes &amp; Deliverables
                      </h4>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {project.outcomes_en.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2 font-editorial text-xs text-slate-700">
                            <Icon name="check_circle" className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {project.tags && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Team / Leads Sidebar */}
                <div className="w-full lg:w-72 shrink-0 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-1.5 mb-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Icon name="groups" className="h-4 w-4 text-sky-600" />
                    <span>Project Team</span>
                  </div>
                  <div className="space-y-3">
                    {project.leads?.map((lead, lIdx) => (
                      <div key={lIdx} className="border-b border-slate-200/60 pb-2.5 last:border-0 last:pb-0">
                        <p className="font-editorial text-sm font-bold text-slate-900">{lead.name}</p>
                        <p className="font-editorial text-xs text-sky-800">{lead.role}</p>
                        {lead.affiliation && (
                          <p className="font-editorial text-[11px] text-slate-500 mt-0.5">{lead.affiliation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Papers Section */}
              {project.related_publications && project.related_publications.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200/90">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="layers" className="h-4 w-4 text-sky-700" />
                      <h3 className="font-editorial text-lg font-bold text-slate-900">
                        Associated Publications ({project.related_publications.length})
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-slate-500">
                      Peer-reviewed research output
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {project.related_publications.map((paper) => (
                      <PaperCard key={paper.id} paper={paper} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
};
