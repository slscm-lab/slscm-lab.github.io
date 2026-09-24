// ==============================================================================
// SLSCM Lab — TypeScript Domain & Presentation Models
// ==============================================================================

// Research Pillars Taxonomy
export type LegacyPublicationPillarId =
  | 'operational_optimization'
  | 'ml_optimization'
  | 'green_transportation';

export type ResearchPillarId =
  | 'supply_chain_optimization'
  | 'ai_supply_chain_intelligence'
  | 'decision_analytics';

export type PillarId = ResearchPillarId;

export type ResearchPillar = {
  id: ResearchPillarId | string;
  title: string;
  title_en?: string;
  description: string;
  topics: string[];
  featured_venues?: string[];
  featured_journals?: string[];
};

export type SiteMetrics = {
  total_publications: number;
  q1_journals: number;
  active_projects: number;
  phd_msc_scholarships: number;
  valedictorians: number;
  student_researchers: number;
  international_partner_countries: number;
};

export type LabOverview = {
  name: string;
  abbreviation: string;
  affiliation: string;
  faculty_department: string;
  address: string;
  head_of_lab: {
    name: string;
    email: string;
    title: string;
    office: string;
  };
  metrics: SiteMetrics;
  research_pillars: ResearchPillar[];
  social?: Record<string, string>;
  official_kpi_2025?: Record<string, unknown>;
};

export type Lead = {
  name: string;
  email?: string;
  role?: string;
  affiliation?: string;
};

export type RelatedPublication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  badge?: string | null;
  doi?: string | null;
  link?: string | null;
  abstract?: string | null;
  bibtex?: string | null;
  highlighted_authors?: string[];
};

export type Project = {
  id: string;
  title_en: string;
  title_vi?: string;
  category: string;
  category_en?: string;
  sponsor?: string | null;
  grant_code?: string | null;
  period: string;
  status: string;
  research_domain?: string | null;
  collaboration?: string | null;
  leads?: Lead[] | null;
  description_en: string;
  description_vi?: string;
  methodology?: string | null;
  outcomes?: string[];
  outcomes_en?: string[];
  tags?: string[];
  related_publications?: RelatedPublication[];
  pillars?: {
    pillar: string;
    description_vi?: string;
    description_en?: string;
  }[];
  curriculum?: {
    module_vi?: string;
    module_en?: string;
    content_vi?: string;
  }[];
};

export type Seminar = {
  id: string;
  title: string;
  title_vi?: string;
  speaker: string;
  speaker_role?: string;
  affiliation: string;
  date: string;
  time?: string;
  venue: string;
  venue_type: 'In-Person' | 'Online' | 'Hybrid' | string;
  status: 'Upcoming' | 'Archived' | string;
  category?: string;
  track?: string;
  abstract: string;
  abstract_en?: string;
  key_topics?: string[];
  related_paper_id?: string | null;
  related_project_id?: string | null;
  slides_available?: boolean;
  recording_available?: boolean;
};

export type EventBrief = {
  id: string;
  title: string;
  title_vi?: string;
  date: string;
  category: string;
  category_vi?: string;
  badge?: string | null;
  summary: string;
  summary_vi?: string;
  summary_en?: string;
  content_vi?: string;
  content_en?: string;
  tags?: string[];
  link?: string | null;
  link_label?: string | null;
  featured?: boolean;
};

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  doi?: string | null;
  link?: string | null;
  research_pillar: LegacyPublicationPillarId | string;
  primary_pillar_id?: ResearchPillarId | string | null;
  abstract?: string | null;
  bibtex?: string | null;
  is_featured?: boolean;
  highlighted_authors?: string[];
  badge?: string | null;
};

export type Person = {
  id: string;
  name: string;
  name_en?: string;
  title?: string;
  role_badge?: string;
  affiliation?: string;
  email?: string;
  office?: string;
  research_interests?: string[];
  bio?: string;
  bio_en?: string;
  avatar?: string;
};

export type WebTechLead = {
  id: string;
  name: string;
  avatar?: string;
  role_badge?: string;
  role?: string;
  affiliation?: string;
  current_status?: string;
  featured_publications?: string[];
  research_interests?: string[];
  email?: string;
};

export type StudentResearcher = {
  id?: string;
  name: string;
  name_en?: string;
  major?: string;
  institution?: string;
  avatar?: string;
  email?: string;
  current_status?: string;
  featured_publications?: string[];
  research_interests?: string[];
};

export type HallEntry = {
  id: string;
  name: string;
  name_en?: string;
  avatar?: string;
  achievement: string;
  achievement_en?: string;
  destination_institution: string;
  country: string;
  year: number | string;
  award_type?: string;
  field?: string;
  former_background_en?: string;
  advisors?: string;
};

export type AlumniMember = {
  id: string;
  name: string;
  name_en?: string;
  avatar?: string;
  period?: string;
  former_role?: string;
  former_role_en?: string;
  current_position?: string;
  current_position_en?: string;
  institution?: string;
  email?: string;
};

export type PartnerInstitution = {
  name: string;
  short_name?: string;
  logo: string;
  website?: string;
};

export type AcademicPartner = {
  country: string;
  institution: string;
  institutions?: PartnerInstitution[];
  collaborators?: string;
  key_collaborators?: string[];
  scope?: string;
  research_focus?: string;
};

export type SocialPost = {
  type: string;
  title: string;
  abstract?: string | null;
  journal?: string | null;
  paper_title?: string | null;
  authors?: string[] | null;
  organizer?: string | null;
  collaboration?: string | null;
  name?: string;
  link?: string | null;
  action_label?: string | null;
  venue?: string | null;
};

export type ConferenceTalkSpeaker = {
  name: string;
  role?: string;
  affiliation?: string;
};

export type ConferenceTalk = {
  id: string;
  title: string;
  type: 'conference' | 'invited_talk' | 'keynote' | 'seminar';
  type_badge: string;
  event_name: string;
  series?: string;
  speakers: ConferenceTalkSpeaker[];
  date: string;
  year: number;
  location: string;
  format: 'In-Person' | 'Online' | 'Hybrid';
  abstract: string;
  key_topics?: string[];
  paper_doi?: string | null;
  paper_url?: string | null;
  slides_available?: boolean;
};

export type PageRoute =
  | 'home'
  | 'publications'
  | 'people'
  | 'alumni'
  | 'events'
  | 'lab-life';
