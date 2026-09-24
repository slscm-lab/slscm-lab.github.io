import { supabase } from '../lib/supabase';
import {
  Publication,
  EventBrief,
  Person,
  WebTechLead,
  StudentResearcher,
  HallEntry,
  AlumniMember,
  AcademicPartner,
  Project,
  Seminar,
  ResearchPillar,
  LabOverview,
  SocialPost,
} from '../types';

export interface RawPeopleData {
  leadership_and_faculty: Person[];
  web_tech_lead: WebTechLead[];
  hall_of_fame: HallEntry[];
  graduate_and_undergraduate_student_researchers: StudentResearcher[];
  alumni: AlumniMember[];
  global_academic_partners: AcademicPartner[];
}

// ------------------------------------------------------------------------------
// 1. Publications
// ------------------------------------------------------------------------------
export async function fetchPublicationsFromSupabase(): Promise<Publication[] | null> {
  try {
    const { data, error } = await supabase
      .from('publications')
      .select(`
        *,
        authors:publication_authors(
          author_name,
          author_order,
          is_highlighted
        )
      `)
      .order('year', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetchPublications error:', error?.message);
      return null;
    }

    return data.map((item) => {
      const sortedAuthors = (item.authors || []).sort(
        (a: { author_order: number }, b: { author_order: number }) =>
          a.author_order - b.author_order
      );
      const authors = sortedAuthors.map((a: { author_name: string }) => a.author_name);
      const highlighted_authors = sortedAuthors
        .filter((a: { is_highlighted: boolean }) => a.is_highlighted)
        .map((a: { author_name: string }) => a.author_name);

      return {
        id: item.id,
        title: item.title,
        authors,
        venue: item.venue,
        year: item.year,
        type: item.type,
        doi: item.doi || null,
        link: item.link || null,
        research_pillar: item.research_pillar,
        primary_pillar_id: item.primary_pillar_id || null,
        keywords: item.keywords || [],
        abstract: item.abstract || null,
        abstract_source: item.abstract_source || null,
        bibtex: item.bibtex || null,
        is_featured: Boolean(item.is_featured),
        highlighted_authors,
        badge: item.badge || null,
      };
    });
  } catch (err) {
    console.warn('Failed to query publications from Supabase:', err);
    return null;
  }
}

// ------------------------------------------------------------------------------
// 2. Events & News Briefs
// ------------------------------------------------------------------------------
export async function fetchEventsFromSupabase(): Promise<EventBrief[] | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        tags:event_tags(tag)
      `)
      .order('event_date', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetchEvents error:', error?.message);
      return null;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      title_vi: item.title_vi || undefined,
      date: item.event_date,
      category: item.category,
      category_vi: item.category_vi || undefined,
      badge: item.badge || null,
      summary: item.summary,
      summary_vi: item.summary_vi || undefined,
      summary_en: item.summary_en || undefined,
      content_vi: item.content_vi || undefined,
      content_en: item.content_en || undefined,
      tags: (item.tags || []).map((t: { tag: string }) => t.tag),
      link: item.link || null,
      link_label: item.link_label || null,
      featured: Boolean(item.featured),
    }));
  } catch (err) {
    console.warn('Failed to query events from Supabase:', err);
    return null;
  }
}

// ------------------------------------------------------------------------------
// 3. People & Roster
// ------------------------------------------------------------------------------
export async function fetchPeopleFromSupabase(): Promise<RawPeopleData | null> {
  try {
    const [peopleRes, achievementsRes, partnersRes] = await Promise.all([
      supabase.from('people').select(`
        *,
        institutions(name, short_name),
        interests:person_research_interests(interest, order_index),
        featured_pubs:person_featured_publications(publication_title, order_index)
      `).order('display_order', { ascending: true }),
      supabase.from('achievements').select('*').order('display_order', { ascending: true }),
      supabase.from('global_academic_partners').select('*').order('order_index', { ascending: true }),
    ]);

    if (peopleRes.error || !peopleRes.data) {
      console.warn('Supabase fetchPeople error:', peopleRes.error?.message);
      return null;
    }

    const peopleRows = peopleRes.data;

    const leadership_and_faculty: Person[] = [];
    const web_tech_lead: WebTechLead[] = [];
    const graduate_and_undergraduate_student_researchers: StudentResearcher[] = [];
    const alumni: AlumniMember[] = [];

    for (const p of peopleRows) {
      const research_interests = (p.interests || [])
        .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
        .map((i: { interest: string }) => i.interest);

      const featured_publications = (p.featured_pubs || [])
        .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
        .map((f: { publication_title: string }) => f.publication_title);

      const affiliation = p.institutions?.short_name || p.institutions?.name || p.affiliation || '';

      if (p.category === 'faculty') {
        leadership_and_faculty.push({
          id: p.id,
          name: p.name,
          name_en: p.name_en || p.name,
          title: p.title || '',
          role_badge: p.role_badge || '',
          affiliation,
          email: p.email || '',
          office: p.office || '',
          bio: p.bio || '',
          bio_en: p.bio || '',
          avatar: p.avatar || '',
          research_interests,
        });
      } else if (p.category === 'web_tech_lead') {
        web_tech_lead.push({
          id: p.id,
          name: p.name,
          avatar: p.avatar || '',
          role_badge: p.role_badge || '',
          role: p.role_badge || '',
          affiliation,
          current_status: p.current_status || '',
          email: p.email || '',
          research_interests,
          featured_publications,
        });
      } else if (p.category === 'student_researcher') {
        graduate_and_undergraduate_student_researchers.push({
          id: p.id,
          name: p.name,
          name_en: p.name_en || p.name,
          major: p.major || '',
          institution: affiliation,
          avatar: p.avatar || '',
          email: p.email || '',
          current_status: p.current_status || '',
          research_interests,
          featured_publications,
        });
      } else if (p.category === 'alumni') {
        alumni.push({
          id: p.id,
          name: p.name,
          name_en: p.name_en || p.name,
          avatar: p.avatar || '',
          period: p.current_status || '',
          institution: affiliation,
          former_role: p.role_badge || '',
          former_role_en: p.role_badge || '',
          current_position: p.current_status || '',
          current_position_en: p.current_status || '',
        });
      }
    }

    const hall_of_fame: HallEntry[] = (achievementsRes.data || []).map((a) => ({
      id: a.id,
      name: a.name,
      name_en: a.name_en || a.name,
      avatar: a.avatar || '',
      achievement: a.achievement,
      achievement_en: a.achievement_en || a.achievement,
      destination_institution: a.destination_institution,
      country: a.country,
      year: a.year,
      award_type: a.award_type || '',
      former_background_en: a.former_background_en || undefined,
    }));

    const global_academic_partners: AcademicPartner[] = (partnersRes.data || []).map((gp) => ({
      id: gp.id,
      institution: gp.institution,
      country: gp.country,
      key_collaborators: gp.key_collaborators ? gp.key_collaborators.split(', ') : [],
      research_focus: gp.research_focus || '',
    }));

    return {
      leadership_and_faculty,
      web_tech_lead,
      hall_of_fame,
      graduate_and_undergraduate_student_researchers,
      alumni,
      global_academic_partners,
    };
  } catch (err) {
    console.warn('Failed to query people from Supabase:', err);
    return null;
  }
}

// ------------------------------------------------------------------------------
// 4. Research Pillars
// ------------------------------------------------------------------------------
export async function fetchResearchPillarsFromSupabase(): Promise<ResearchPillar[] | null> {
  try {
    const { data, error } = await supabase
      .from('research_pillars')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetchResearchPillars error:', error?.message);
      return null;
    }

    return data.map((rp) => ({
      id: rp.id,
      title: rp.title,
      title_en: rp.title,
      description: rp.description,
      topics: rp.topics || [],
      featured_venues: rp.featured_venues || [],
      featured_journals: rp.featured_venues || [],
    }));
  } catch (err) {
    console.warn('Failed to query research_pillars from Supabase:', err);
    return null;
  }
}

// ------------------------------------------------------------------------------
// 5. Research Projects
// ------------------------------------------------------------------------------
export async function fetchProjectsFromSupabase(): Promise<Project[] | null> {
  try {
    const { data, error } = await supabase.from('projects').select(`
      *,
      leads:project_leads(name, email, role, affiliation, order_index),
      outcomes:project_outcomes(outcome_en, outcome_vi, order_index),
      tags:project_tags(tag)
    `);

    if (error || !data) {
      console.warn('Supabase fetchProjects error:', error?.message);
      return null;
    }

    return data.map((proj) => {
      const sortedLeads = (proj.leads || []).sort(
        (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
      );
      const sortedOutcomes = (proj.outcomes || []).sort(
        (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
      );

      return {
        id: proj.id,
        title_en: proj.title_en,
        title_vi: proj.title_vi || undefined,
        category: proj.category,
        category_en: proj.category_en || undefined,
        sponsor: proj.sponsor || null,
        grant_code: proj.grant_code || null,
        period: proj.period,
        status: proj.status,
        research_domain: proj.research_domain || null,
        collaboration: proj.collaboration || null,
        leads: sortedLeads.map((l: { name: string; email?: string; role?: string; affiliation?: string }) => ({
          name: l.name,
          email: l.email || undefined,
          role: l.role || undefined,
          affiliation: l.affiliation || undefined,
        })),
        description_en: proj.description_en,
        description_vi: proj.description_vi || undefined,
        methodology: proj.methodology || null,
        outcomes: sortedOutcomes.map((o: { outcome_en: string }) => o.outcome_en),
        outcomes_en: sortedOutcomes.map((o: { outcome_en: string }) => o.outcome_en),
        tags: (proj.tags || []).map((t: { tag: string }) => t.tag),
      };
    });
  } catch (err) {
    console.warn('Failed to query projects from Supabase:', err);
    return null;
  }
}

// ------------------------------------------------------------------------------
// 6. Seminars
// ------------------------------------------------------------------------------
export async function fetchSeminarsFromSupabase(): Promise<Seminar[] | null> {
  try {
    const { data, error } = await supabase.from('seminars').select(`
      *,
      topics:seminar_topics(topic)
    `).order('date', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetchSeminars error:', error?.message);
      return null;
    }

    return data.map((sem) => ({
      id: sem.id,
      title: sem.title,
      title_vi: sem.title_vi || undefined,
      speaker: sem.speaker,
      speaker_role: sem.speaker_role || undefined,
      affiliation: sem.affiliation,
      date: sem.date,
      time: sem.time || undefined,
      venue: sem.venue,
      venue_type: sem.venue_type,
      status: sem.status,
      category: sem.category || undefined,
      track: sem.track || undefined,
      abstract: sem.abstract,
      abstract_en: sem.abstract_en || undefined,
      key_topics: (sem.topics || []).map((t: { topic: string }) => t.topic),
      related_paper_id: sem.related_paper_id || null,
      related_project_id: sem.related_project_id || null,
      slides_available: Boolean(sem.slides_available),
      recording_available: Boolean(sem.recording_available),
    }));
  } catch (err) {
    console.warn('Failed to query seminars from Supabase:', err);
    return null;
  }
}

// ------------------------------------------------------------------------------
// 7. Lab Overview
// ------------------------------------------------------------------------------
export async function fetchLabOverviewFromSupabase(): Promise<LabOverview | null> {
  try {
    const { data, error } = await supabase.from('lab_overview').select('*');
    if (error || !data) {
      console.warn('Supabase fetchLabOverview error:', error?.message);
      return null;
    }

    const dict: Record<string, string> = {};
    for (const row of data) {
      dict[row.key] = row.value;
    }

    const head_of_lab = dict.head_of_lab ? JSON.parse(dict.head_of_lab) : {
      name: 'Dr. Duc Minh Vu',
      email: 'minhvd@neu.edu.vn',
      title: 'Lab Head / Faculty Member',
      office: 'Room 1613, Building A1',
    };

    const metrics = dict.metrics ? JSON.parse(dict.metrics) : undefined;
    const social = dict.social ? JSON.parse(dict.social) : undefined;

    return {
      name: dict.name || 'Smart Logistics and Supply Chain Management Laboratory',
      abbreviation: dict.abbreviation || 'SLSCM Lab',
      affiliation: dict.affiliation || 'College of Technology, National Economics University (NEU)',
      faculty_department: dict.faculty_department || 'Faculty of Data Science and Artificial Intelligence (FDA)',
      address: dict.address || 'Room 1613, A1 Building, National Economics University, 207 Giai Phong, Hanoi, Vietnam',
      head_of_lab,
      metrics,
      research_pillars: [],
      social,
    } as LabOverview;
  } catch (err) {
    console.warn('Failed to query lab_overview from Supabase:', err);
    return null;
  }
}

// ------------------------------------------------------------------------------
// 8. Social Posts (Lab Life)
// ------------------------------------------------------------------------------
export async function fetchSocialPostsFromSupabase(): Promise<SocialPost[] | null> {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetchSocialPosts error:', error?.message);
      return null;
    }

    return data as unknown as SocialPost[];
  } catch (err) {
    console.warn('Failed to query social_posts from Supabase:', err);
    return null;
  }
}
