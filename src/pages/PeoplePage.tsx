import React, { useState } from 'react';
import { Users, Mail, MapPin, Globe, ExternalLink, GraduationCap } from 'lucide-react';
import { Person, YoungResearcher, StudentResearcher, AcademicPartner } from '../types';
import peopleData from '../data/slscm_people.json';

export const PeoplePage: React.FC = () => {
  const people = peopleData as unknown as {
    leadership_and_faculty: Person[];
    young_researchers_and_authors: YoungResearcher[];
    student_researchers: StudentResearcher[];
    global_academic_partners: AcademicPartner[];
  };

  const [activeTab, setActiveTab] = useState<'all' | 'faculty' | 'researchers' | 'students' | 'partners'>('all');

  function getMemberInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'MB';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    const p1 = parts[parts.length - 2];
    const p2 = parts[parts.length - 1];
    const clean1 = p1[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const clean2 = p2[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (clean1 + clean2).toUpperCase();
  }

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <Users className="h-3.5 w-3.5 text-sky-600" />
          <span>People &amp; Mentorship Network</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Faculty, Researchers &amp; Scholars
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          Meet the multidisciplinary scholars, research fellows, and talented student researchers of
          SLSCM Lab, collaborating across NEU, VNU-HUS, HUST, SMU, and international partner institutions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/85 p-2 shadow-xs backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Members ({people.leadership_and_faculty.length + people.young_researchers_and_authors.length + people.student_researchers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faculty')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'faculty' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Leadership &amp; Faculty ({people.leadership_and_faculty.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('researchers')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'researchers' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Young Researchers ({people.young_researchers_and_authors.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'students' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Student Researchers ({people.student_researchers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'partners' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Global Academic Partners ({people.global_academic_partners.length})
        </button>
      </div>

      {/* Leadership & Faculty Section */}
      {(activeTab === 'all' || activeTab === 'faculty') && (
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">Leadership &amp; Faculty</h2>
            <span className="font-mono text-xs text-slate-500">{people.leadership_and_faculty.length} Mentors</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.leadership_and_faculty.map((mentor) => {
              const name = mentor.name_en || mentor.name;
              const initials = getMemberInitials(name);
              return (
                <article
                  key={mentor.id}
                  className="soft-card p-6 bg-white/95 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      {mentor.avatar ? (
                        <img
                          src={mentor.avatar}
                          alt={name}
                          className="h-16 w-16 rounded-2xl object-cover ring-2 ring-sky-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-800 font-mono text-base font-bold text-white shadow-sm ring-2 ring-sky-200/70 shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        {mentor.role_badge && (
                          <span className="inline-block rounded-md bg-sky-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-sky-900 mb-1">
                            {mentor.role_badge}
                          </span>
                        )}
                        <h3 className="font-editorial text-lg font-bold text-slate-950 leading-snug">
                          {name}
                        </h3>
                        <p className="font-editorial text-xs font-semibold text-sky-800">
                          {mentor.title_en}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 font-editorial text-xs text-slate-600 leading-relaxed">
                      {mentor.affiliation_en}
                    </p>

                    {mentor.bio_en && (
                      <p className="mt-3 font-editorial text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {mentor.bio_en}
                      </p>
                    )}

                    {mentor.research_interests && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {mentor.research_interests.map((interest) => (
                          <span
                            key={interest}
                            className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700 font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {mentor.office && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{mentor.office}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Young Researchers & Authors */}
      {(activeTab === 'all' || activeTab === 'researchers') && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">Young Researchers &amp; Authors</h2>
            <span className="font-mono text-xs text-slate-500">{people.young_researchers_and_authors.length} Authors</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {people.young_researchers_and_authors.map((member) => {
              const name = member.name_en || member.name;
              const initials = getMemberInitials(name);
              return (
                <article
                  key={member.id}
                  className="soft-card p-6 bg-white/95 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={name}
                          className="h-14 w-14 rounded-2xl object-cover ring-2 ring-sky-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-sky-900 font-mono text-sm font-bold text-white shadow-sm shrink-0">
                          {initials}
                        </div>
                      )}
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-800">
                          {member.role_en || 'Researcher / Author'}
                        </span>
                        <h3 className="font-editorial text-xl font-bold text-slate-950">
                          {name}
                        </h3>
                        <p className="font-editorial text-xs font-semibold text-slate-600">
                          {member.affiliation_en || member.affiliation}
                        </p>
                      </div>
                    </div>

                    {member.current_status_en && (
                      <p className="mt-4 rounded-xl bg-sky-50/80 p-3 border border-sky-100 font-editorial text-xs font-medium text-sky-950 leading-relaxed">
                        {member.current_status_en}
                      </p>
                    )}

                    {member.featured_publications && member.featured_publications.length > 0 && (
                      <div className="mt-3">
                        <p className="font-mono text-[10px] uppercase font-bold text-slate-400 mb-1">Publications</p>
                        <div className="flex flex-wrap gap-1">
                          {member.featured_publications.map((pub) => (
                            <span
                              key={pub}
                              className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-800 font-semibold"
                            >
                              {pub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {member.email && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 font-mono text-xs text-sky-700">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Student Researchers */}
      {(activeTab === 'all' || activeTab === 'students') && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">Student Researchers &amp; Assistants</h2>
            <span className="font-mono text-xs text-slate-500">{people.student_researchers.length} Students</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.student_researchers.map((student, idx) => {
              const name = student.name_en || student.name;
              const initials = getMemberInitials(name);
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 backdrop-blur-sm shadow-xs hover:border-sky-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-800 shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-editorial text-sm font-bold text-slate-900 truncate">
                        {name}
                      </h4>
                      <p className="font-editorial text-xs text-sky-800 truncate">
                        {student.major_en || student.major}
                      </p>
                      <p className="font-editorial text-[11px] text-slate-500 truncate">
                        {student.institution_en || student.institution}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Global Academic Partners */}
      {(activeTab === 'all' || activeTab === 'partners') && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">Global Academic Collaborators</h2>
            <span className="font-mono text-xs text-slate-500">{people.global_academic_partners.length} Institutions</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.global_academic_partners.map((partner, pIdx) => (
              <div
                key={pIdx}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-lg bg-sky-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-900">
                    {partner.country}
                  </span>
                  <Globe className="h-4 w-4 text-sky-600" />
                </div>
                <h4 className="font-editorial text-base font-bold text-slate-900 leading-snug">
                  {partner.institution}
                </h4>
                <div className="mt-2 text-xs text-slate-600 font-editorial">
                  <p className="font-semibold text-slate-800">Collaborators:</p>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                    {partner.key_collaborators.map((collab, cIdx) => (
                      <li key={cIdx} className="text-slate-600 truncate">{collab}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-3 font-editorial text-xs text-slate-500 italic">
                  Focus: {partner.research_focus}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
