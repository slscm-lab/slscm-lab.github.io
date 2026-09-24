import React from 'react';
import { Icon } from '../components/Icon';
import { getHallOfFame } from '../repositories';
import { HallEntry } from '../types';

export const AlumniPage: React.FC = () => {
  const hallOfFame = getHallOfFame();

  const hallOfFameByYear = hallOfFame.reduce<
    Record<string, HallEntry[]>
  >((groups, entry) => {
    const year = String(entry.year);

    if (!groups[year]) {
      groups[year] = [];
    }

    groups[year].push(entry);
    return groups;
  }, {});

  const sortedYears = Object.keys(hallOfFameByYear).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      <div className="max-w-4xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-900">
          <Icon name="workspace_premium" className="h-3.5 w-3.5 text-amber-600" />
          <span>Hall of Fame &amp; Global Placements</span>
        </div>

        <h1 className="font-editorial text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Alumni &amp; Scholar Success
        </h1>

        <p className="mt-4 max-w-3xl font-editorial text-lg leading-relaxed text-slate-600">
          SLSCM Lab takes pride in mentoring outstanding students who earn
          university valedictorian honors, author top-tier international papers,
          and secure scholarships and research placements at leading institutions.
        </p>
      </div>

      <div className="mt-12 space-y-14">
        {sortedYears.map((year) => (
          <section key={year}>
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-editorial text-2xl font-bold text-slate-950 sm:text-3xl">
                {year}
              </h2>

              <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />

              <span className="font-mono text-[11px] font-semibold text-slate-400">
                {hallOfFameByYear[year].length}{' '}
                {hallOfFameByYear[year].length === 1 ? 'Scholar' : 'Scholars'}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hallOfFameByYear[year].map((entry) => (
                <article
                  key={entry.id}
                  className="soft-card relative flex flex-col justify-between overflow-hidden border-amber-200/60 bg-white/95 p-6 shadow-xs"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-amber-950">
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
                          className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-sm ring-2 ring-amber-200"
                        />
                      ) : (
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 font-mono text-sm font-bold text-white shadow-sm">
                          {entry.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h3 className="font-editorial text-lg font-bold text-slate-950">
                          {entry.name}
                        </h3>

                        <p className="flex items-center gap-1 font-editorial text-xs font-semibold text-amber-900">
                          <Icon name="school" className="h-3 w-3 shrink-0" />
                          <span>{entry.destination_institution}</span>
                        </p>
                      </div>
                    </div>

                    {entry.former_background_en && (
                      <p className="mt-3 font-editorial text-[11px] font-medium text-slate-500">
                        {entry.former_background_en}
                      </p>
                    )}

                    <p className="mt-4 font-editorial text-xs leading-relaxed text-slate-700 sm:text-sm">
                      {entry.achievement}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Icon name="location_on" className="h-3 w-3 text-amber-600" />
                      {entry.country}
                    </span>

                    <span className="font-semibold text-emerald-700">
                      Verified Placement
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
