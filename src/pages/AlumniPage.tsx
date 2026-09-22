import React from 'react';
import { Award, GraduationCap, MapPin, Globe, ArrowUpRight, Sparkles } from 'lucide-react';
import { HallEntry, AlumniMember } from '../types';
import peopleData from '../data/slscm_people.json';

export const AlumniPage: React.FC = () => {
  const people = peopleData as unknown as {
    hall_of_fame: HallEntry[];
    alumni: AlumniMember[];
  };

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-4">
          <Award className="h-3.5 w-3.5 text-amber-600" />
          <span>Hall of Fame &amp; Global Placements</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Alumni &amp; Scholar Success
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          SLSCM Lab takes pride in mentoring outstanding students who earn university valedictorian honors,
          author top-tier international papers, and secure fully-funded PhD scholarships at world-class
          institutions across Singapore, the United Kingdom, and the United States.
        </p>
      </div>

      {/* Hall of Fame Highlights */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {people.hall_of_fame.map((entry) => (
          <article
            key={entry.id}
            className="soft-card p-6 bg-white/95 border-amber-200/60 shadow-xs flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded-lg bg-amber-100 text-amber-950 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide">
                  {entry.award_type || 'Excellence Award'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {entry.year}
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                {entry.avatar ? (
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-200 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 font-mono text-sm font-bold text-white shadow-sm shrink-0">
                    {entry.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-editorial text-lg font-bold text-slate-950">
                    {entry.name_en || entry.name}
                  </h3>
                  <p className="font-editorial text-xs font-semibold text-amber-900 flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    <span>{entry.destination_institution}</span>
                  </p>
                </div>
              </div>

              <p className="mt-4 font-editorial text-xs sm:text-sm text-slate-700 leading-relaxed">
                {entry.achievement_en}
              </p>

              <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-200/60 text-xs">
                <p className="font-mono text-[10px] uppercase font-bold text-slate-400 mb-1">Focus Field</p>
                <p className="font-editorial font-semibold text-slate-800">{entry.field}</p>
                {entry.advisors && (
                  <p className="font-editorial text-[11px] text-slate-500 mt-1">
                    Advisors: {entry.advisors}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-amber-600" />
                {entry.country}
              </span>
              <span className="text-emerald-700 font-semibold">Verified Placement</span>
            </div>
          </article>
        ))}
      </div>

      {/* Alumni Roster Section */}
      <section className="mt-16">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-editorial text-2xl font-bold text-slate-950">Alumni Career Trajectories</h2>
          <span className="font-mono text-xs text-slate-500">{people.alumni.length} Alumni Records</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.alumni.map((alum) => (
            <div
              key={alum.id}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2 font-mono text-[10px] text-slate-400">
                  <span>{alum.period}</span>
                  <span className="text-sky-700 font-bold uppercase">{alum.former_role_en}</span>
                </div>
                <h4 className="font-editorial text-base font-bold text-slate-950">
                  {alum.name_en || alum.name}
                </h4>
                <p className="font-editorial text-xs font-semibold text-sky-800 mt-0.5">
                  {alum.current_position_en}
                </p>
                <p className="font-editorial text-xs text-slate-600 mt-1">
                  {alum.institution_en}
                </p>
                {alum.research_focus && (
                  <p className="mt-2.5 rounded-lg bg-slate-50 p-2 font-editorial text-[11px] text-slate-600 border border-slate-100">
                    Focus: {alum.research_focus}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
