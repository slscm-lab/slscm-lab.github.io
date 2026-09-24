import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { usePeople } from '../context/DataContext';
import { AcademicPartner, PartnerInstitution } from '../types';

type FacultyMember = {
  id: string;
  name: string;
  role_badge?: string;
  email?: string;
  office?: string;
  research_interests?: string[];
  avatar?: string;
  title: string;
  affiliation: string;
  bio?: string;
};

type WebTechLead = {
  id: string;
  name: string;
  avatar?: string;
  role_badge?: string;
  role?: string;
  affiliation: string;
  current_status?: string;
  featured_publications?: string[];
  research_interests?: string[];
  email?: string;
};

type StudentResearcher = {
  id?: string;
  name: string;
  major: string;
  institution: string;
  avatar?: string;
  email?: string;
  current_status?: string;
  featured_publications?: string[];
  research_interests?: string[];
};

const UNIVERSITY_FALLBACKS: [string, string, string, string][] = [
  ['smu', 'Singapore Management University (SMU)', '/assets/images/universities/smu.svg', 'https://smu.edu.sg'],
  ['udine', 'University of Udine', '/assets/images/universities/udine.png', 'https://uniud.it'],
  ['graz', 'University of Graz & Austrian Partners', '/assets/images/universities/graz.svg', 'https://uni-graz.at'],
  ['austria', 'University of Graz & Austrian Partners', '/assets/images/universities/graz.svg', 'https://uni-graz.at'],
  ['cardiff', 'Cardiff University', '/assets/images/universities/cardiff.svg', 'https://www.cardiff.ac.uk'],
  ['lancaster', 'Lancaster University', '/assets/images/universities/lancaster.svg', 'https://www.lancaster.ac.uk'],
  ['ljmu', 'Liverpool John Moores University (LJMU)', '/assets/images/universities/ljmu.svg', 'https://www.ljmu.ac.uk'],
  ['liverpool', 'Liverpool John Moores University (LJMU)', '/assets/images/universities/ljmu.svg', 'https://www.ljmu.ac.uk'],
  ['uconn', 'University of Connecticut (UConn)', '/assets/images/universities/uconn.svg', 'https://uconn.edu'],
  ['connecticut', 'University of Connecticut (UConn)', '/assets/images/universities/uconn.svg', 'https://uconn.edu'],
  ['loyola', 'Loyola University Chicago', '/assets/images/universities/loyola_chicago.svg', 'https://www.luc.edu'],
  ['michigan', 'University of Michigan - Flint', '/assets/images/universities/um_flint.svg', 'https://www.umflint.edu'],
  ['montréal', 'Université de Montréal', '/assets/images/universities/udem.svg', 'https://www.umontreal.ca'],
  ['montreal', 'Université de Montréal', '/assets/images/universities/udem.svg', 'https://www.umontreal.ca'],
  ['cirrelt', 'CIRRELT (Centre interuniversitaire)', '/assets/images/universities/cirrelt.png', 'https://www.cirrelt.ca'],
  ['hust', 'Hanoi University of Science and Technology (HUST)', '/assets/images/universities/hust.svg', 'https://hust.edu.vn'],
  ['hus', 'VNU University of Science (VNU-HUS)', '/assets/images/universities/vnu_hus.svg', 'https://hus.vnu.edu.vn'],
  ['vnu', 'VNU University of Science (VNU-HUS)', '/assets/images/universities/vnu_hus.svg', 'https://hus.vnu.edu.vn'],
  ['phenikaa', 'Phenikaa University', '/assets/images/universities/phenikaa.png', 'https://phenikaa-uni.edu.vn'],
  ['vinuni', 'VinUniversity', '/assets/images/universities/vinuni.png', 'https://vinuni.edu.vn'],
];

function resolveInstitutions(partner: AcademicPartner): PartnerInstitution[] {
  if (partner.institutions && partner.institutions.length > 0) {
    return partner.institutions;
  }
  const rawTokens = (partner.institution || '').split(/[,/]/).map((s) => s.trim()).filter(Boolean);
  const result: PartnerInstitution[] = [];
  const seenLogos = new Set<string>();

  for (const token of rawTokens) {
    if (token.toLowerCase().includes('partner institutes')) continue;
    let matched = false;
    for (const [kw, name, logo, website] of UNIVERSITY_FALLBACKS) {
      if (token.toLowerCase().includes(kw) && !seenLogos.has(logo)) {
        seenLogos.add(logo);
        result.push({ name, logo, website });
        matched = true;
        break;
      }
    }
    if (!matched && token) {
      result.push({ name: token, logo: '/assets/images/branding/neu_logo.webp' });
    }
  }
  return result;
}

// Temporarily disabled per user request
const SHOW_ACADEMIC_PARTNERS = false;

type PeopleTab = 'all' | 'faculty' | 'students' | 'partners' | 'tech';

export const PeoplePage: React.FC = () => {
  const people = usePeople() as unknown as {
    leadership_and_faculty: FacultyMember[];
    web_tech_lead: WebTechLead[];
    graduate_and_undergraduate_student_researchers: StudentResearcher[];
    global_academic_partners: AcademicPartner[];
  };

  const [activeTab, setActiveTab] = useState<PeopleTab>('all');
  const [expandedFacultyIds, setExpandedFacultyIds] = useState<Set<string>>(new Set());

  const toggleFacultyBio = (facultyId: string) => {
    setExpandedFacultyIds((current) => {
      const next = new Set(current);
      if (next.has(facultyId)) {
        next.delete(facultyId);
      } else {
        next.add(facultyId);
      }
      return next;
    });
  };

  function getMemberInitials(name: string): string {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0) return 'MB';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    const p1 = parts[parts.length - 2];
    const p2 = parts[parts.length - 1];

    const clean1 = p1[0]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const clean2 = p2[0]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return (clean1 + clean2).toUpperCase();
  }

  function getInstitutionShortName(institution: string): string {
    const normalized = institution.trim().toLowerCase();
    const knownShortNames: [string, string][] = [
      ['vnu university of engineering and technology', 'VNU-UET'],
      ['vnu school of engineering and technology', 'VNU-UET'],
      ['vnu university of science', 'VNU-HUS'],
      ['hanoi university of science and technology', 'HUST'],
      ['national economics university', 'NEU'],
    ];
    const knownInstitution = knownShortNames.find(([name]) => normalized.includes(name));
    if (knownInstitution) return knownInstitution[1];

    const acronym = institution.match(/\(([A-Z][A-Z0-9-]{1,})\)\s*$/)?.[1];
    return acronym || institution;
  }


  const memberCount =
    people.leadership_and_faculty.length +
    people.web_tech_lead.length +
    people.graduate_and_undergraduate_student_researchers.length;

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800">
          <Icon name="groups" className="h-3.5 w-3.5 text-sky-600" />
          <span>People &amp; Mentorship Network</span>
        </div>

        <h1 className="font-editorial text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Faculty, Researchers &amp; Scholars
        </h1>

        <p className="mt-4 max-w-3xl font-editorial text-lg leading-relaxed text-slate-600">
          Meet the multidisciplinary faculty, graduate and undergraduate student
          research assistants, and technical team of SLSCM Lab, collaborating
          across NEU, VNU-HUS, HUST, SMU, and international partner institutions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/85 p-2 shadow-xs backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Members ({memberCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faculty')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'faculty'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Leadership &amp; Faculty ({people.leadership_and_faculty.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'students'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Graduate &amp; Undergraduate Student Research Assistants (
          {people.graduate_and_undergraduate_student_researchers.length})
        </button>

        {SHOW_ACADEMIC_PARTNERS && (
          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
              activeTab === 'partners'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global Academic Partners ({people.global_academic_partners.length})
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('tech')}
          className={`rounded-xl px-3.5 py-1.5 font-editorial text-xs font-semibold transition ${
            activeTab === 'tech'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Web / Tech Lead ({people.web_tech_lead.length})
        </button>
      </div>

      {/* Leadership & Faculty */}
      {(activeTab === 'all' || activeTab === 'faculty') && (
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">
              Leadership &amp; Faculty
            </h2>

            <span className="font-mono text-xs text-slate-500">
              {people.leadership_and_faculty.length} Mentors
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.leadership_and_faculty.map((mentor) => {
              const initials = getMemberInitials(mentor.name);
              const isBioExpanded = expandedFacultyIds.has(mentor.id);

              return (
                <article
                  key={mentor.id}
                  className="soft-card flex flex-col justify-between bg-white/95 p-6"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      {mentor.avatar ? (
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm ring-2 ring-sky-200"
                        />
                      ) : (
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-800 font-mono text-base font-bold text-white shadow-sm ring-2 ring-sky-200/70">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        {mentor.role_badge && (
                          <span className="mb-1 inline-block rounded-md bg-sky-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-sky-900">
                            {mentor.role_badge}
                          </span>
                        )}

                        <h3 className="font-editorial text-lg font-bold leading-snug text-slate-950">
                          {mentor.name}
                        </h3>

                        {mentor.title && mentor.title.trim().toUpperCase() !== 'NEU' && (
                          <p className="font-editorial text-xs font-semibold text-sky-800">
                            {mentor.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {mentor.affiliation && mentor.affiliation.trim().toUpperCase() !== 'NEU' && (
                      <p className="mt-3 font-editorial text-xs leading-relaxed text-slate-600">
                        {mentor.affiliation}
                      </p>
                    )}

                    {mentor.bio && (
                      <div className="mt-3">
                        <p
                          id={`faculty-bio-${mentor.id}`}
                          className={`font-editorial text-xs leading-relaxed text-slate-600 ${
                            isBioExpanded ? '' : 'line-clamp-3'
                          }`}
                        >
                          {mentor.bio}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleFacultyBio(mentor.id)}
                          aria-expanded={isBioExpanded}
                          aria-controls={`faculty-bio-${mentor.id}`}
                          className="mt-2 inline-flex items-center gap-1 font-editorial text-xs font-bold text-sky-700 transition hover:text-sky-900 focus-ring"
                        >
                          {isBioExpanded ? 'Close' : 'Read full'}
                          <Icon
                            name={isBioExpanded ? 'expand_less' : 'expand_more'}
                            className="h-4 w-4"
                          />
                        </button>
                      </div>
                    )}

                    {mentor.research_interests &&
                      mentor.research_interests.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          {mentor.research_interests.map((interest) => (
                            <span
                              key={interest}
                              className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  {mentor.office && (
                    <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-400">
                      <Icon name="location_on" className="h-3.5 w-3.5 shrink-0 text-sky-600" />
                      <span className="truncate">{mentor.office}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Graduate & Undergraduate Student Research Assistants */}
      {(activeTab === 'all' || activeTab === 'students') && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">
              Graduate &amp; Undergraduate Student Research Assistants
            </h2>

            <span className="font-mono text-xs text-slate-500">
              {people.graduate_and_undergraduate_student_researchers.length}{' '}
              Assistants
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {people.graduate_and_undergraduate_student_researchers.map(
              (student, idx) => {
                return (
                  <div
                    key={student.id || `${student.name}-${idx}`}
                    className="rounded-xl border border-slate-200/80 bg-white/85 p-3 shadow-xs backdrop-blur-sm transition hover:border-sky-300"
                  >
                    <div className="flex items-center gap-2.5">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-2xs ring-1 ring-sky-200"
                        />
                      ) : (
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-sky-50 to-indigo-50/80 border border-sky-100/90 text-sky-700 shadow-2xs">
                          <Icon name="school" className="h-4.5 w-4.5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="truncate font-editorial text-sm font-bold text-slate-900">
                          {student.name}
                        </h4>

                        <p className="truncate font-editorial text-xs text-sky-800">
                          {student.major}
                        </p>

                        <p className="truncate font-editorial text-[11px] text-slate-500">
                          {getInstitutionShortName(student.institution)}
                        </p>
                      </div>
                    </div>

                    {student.current_status && (
                          <p className="mt-2 line-clamp-2 rounded-lg bg-slate-50 px-2 py-1.5 font-editorial text-[10px] leading-relaxed text-slate-600">
                        {student.current_status}
                      </p>
                    )}

                    {student.featured_publications &&
                      student.featured_publications.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {student.featured_publications.map((pub) => (
                            <span
                              key={pub}
                              className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-[9px] font-semibold text-sky-800"
                            >
                              {pub}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Global Academic Partners */}
      {SHOW_ACADEMIC_PARTNERS && (activeTab === 'all' || activeTab === 'partners') && (() => {
        const partnerCards = people.global_academic_partners.map((partner) => ({
          ...partner,
          resolvedInstitutions: resolveInstitutions(partner),
        }));

        return (
          <section className="mt-14">
            <div className="mb-6 border-b border-slate-200 pb-3">
              <h2 className="font-editorial text-2xl font-bold text-slate-950">
                Global Academic Collaborators
              </h2>
              <p className="mt-0.5 font-editorial text-xs text-slate-500">
                Joint research grants, doctoral mobility, and international co-authorship alliances
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {partnerCards.map((partner, pIdx) => (
                <div
                  key={`${partner.country}-${pIdx}`}
                  className="soft-card flex flex-col justify-between bg-white/95 p-5 sm:p-6 transition-all duration-200 hover:shadow-soft"
                >
                  <div>
                    {/* Country Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200/80 bg-sky-100/70 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-900">
                        <Icon name="location_on" className="h-3 w-3 text-sky-700" />
                        <span>{partner.country}</span>
                      </span>

                      <span className="font-mono text-[10px] text-slate-400">
                        {partner.resolvedInstitutions.length}{' '}
                        {partner.resolvedInstitutions.length === 1 ? 'Institution' : 'Institutions'}
                      </span>
                    </div>

                    {/* Universities List with Official Logos */}
                    <div className="space-y-3">
                      {partner.resolvedInstitutions.map((inst, idx) => (
                        <div
                          key={`${inst.name}-${idx}`}
                          className="flex items-center gap-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 transition hover:bg-slate-50 hover:border-slate-300"
                        >
                          <div className="h-11 w-11 shrink-0 rounded-lg border border-slate-200/80 bg-white p-1.5 shadow-2xs flex items-center justify-center overflow-hidden">
                            <img
                              src={inst.logo}
                              alt={`${inst.name} logo`}
                              className="h-full w-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-editorial text-xs sm:text-sm font-bold leading-snug text-slate-900">
                              {inst.name}
                            </h4>
                            {inst.website && (
                              <a
                                href={inst.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-sky-700 hover:text-sky-900 transition-colors"
                              >
                                <span>{inst.website.replace('https://', '').replace('www.', '').split('/')[0]}</span>
                                <Icon name="open_in_new" className="h-2.5 w-2.5 text-slate-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Web / Tech Lead */}
      {(activeTab === 'all' || activeTab === 'tech') && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">
              Web / Tech Lead
            </h2>

            <span className="font-mono text-xs text-slate-500">
              {people.web_tech_lead.length}{' '}
              {people.web_tech_lead.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {people.web_tech_lead.map((member) => {
              const initials = getMemberInitials(member.name);

              return (
                <article
                  key={member.id}
                  className="soft-card flex flex-col justify-between bg-white/95 p-6"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-sm ring-2 ring-sky-200"
                        />
                      ) : (
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-sky-900 font-mono text-sm font-bold text-white shadow-sm">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        {member.role_badge && (
                          <span className="mb-1 inline-block rounded-md border border-sky-200/80 bg-sky-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-sky-900">
                            {member.role_badge}
                          </span>
                        )}

                        <h3 className="font-editorial text-xl font-bold text-slate-950">
                          {member.name}
                        </h3>

                        <p className="font-editorial text-xs font-semibold text-slate-600">
                          {[member.role, member.affiliation].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>

                    {member.current_status && (
                      <p className="mt-4 rounded-xl border border-sky-100 bg-sky-50/80 p-3 font-editorial text-xs font-medium leading-relaxed text-sky-950">
                        · {member.current_status}
                      </p>
                    )}

                    {member.featured_publications &&
                      member.featured_publications.length > 0 && (
                        <div className="mt-3">
                          {/* <p className="mb-1 font-mono text-[10px] font-bold uppercase text-slate-400">
                            Publications
                          </p> */}

                          <div className="flex flex-wrap gap-1">
                            {member.featured_publications.map((pub) => (
                              <span
                                key={pub}
                                className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-800"
                              >
                                {pub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {member.email && (
                    <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 font-mono text-xs text-sky-700">
                      <Icon name="mail" className="h-3.5 w-3.5" />
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
