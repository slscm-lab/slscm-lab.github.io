export type PillarId = 'operational_optimization' | 'ml_optimization' | 'green_transportation';

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
  badge?: string;
  doi?: string;
  link?: string;
  abstract?: string;
  bibtex?: string;
};

export type Project = {
  id: string;
  title_vi: string;
  title_en?: string;
  category: string;
  category_en?: string;
  sponsor?: string;
  grant_code?: string;
  period: string;
  status: string;
  research_domain?: string;
  collaboration?: string | null;
  leads?: Lead[] | null;
  description_vi: string;
  description_en?: string;
  methodology?: string;
  outcomes?: string[];
  outcomes_en?: string[];
  tags?: string[];
  related_publications?: RelatedPublication[];
  pillars?: {
    pillar: string;
    description_vi: string;
    description_en?: string;
  }[];
  curriculum?: {
    module_vi: string;
    module_en?: string;
    content_vi: string;
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
  time: string;
  venue: string;
  venue_type: 'In-Person' | 'Online' | 'Hybrid';
  status: 'Upcoming' | 'Archived';
  category: string;
  track: string;
  abstract: string;
  abstract_en?: string;
  key_topics?: string[];
  related_paper_id?: string;
  related_project_id?: string;
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
  badge?: string;
  summary: string;
  summary_vi?: string;
  summary_en?: string;
  content_vi?: string;
  content_en?: string;
  tags?: string[];
  link?: string;
  link_label?: string;
  featured?: boolean;
};

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  doi?: string;
  link?: string;
  research_pillar: PillarId;
  abstract?: string;
  bibtex?: string;
  is_featured?: boolean;
};

export type Person = {
  id: string;
  name: string;
  name_en?: string;
  title_vi: string;
  title_en: string;
  role_badge?: string;
  affiliation_vi: string;
  affiliation_en: string;
  email?: string;
  office?: string;
  research_interests?: string[];
  bio_vi?: string;
  bio_en?: string;
  avatar?: string;
};

export type YoungResearcher = {
  id: string;
  name: string;
  name_en?: string;
  avatar?: string;
  role_vi?: string;
  role_en?: string;
  current_status_vi?: string;
  current_status_en?: string;
  affiliation?: string;
  affiliation_en?: string;
  email?: string;
  featured_publications?: string[];
  research_interests?: string[];
};

export type StudentResearcher = {
  name: string;
  name_en?: string;
  major: string;
  major_en?: string;
  institution: string;
  institution_en?: string;
  email?: string;
  avatar?: string;
  affiliation?: string;
};

export type HallEntry = {
  id: string;
  name: string;
  name_en?: string;
  avatar?: string;
  achievement_vi: string;
  achievement_en?: string;
  destination_institution: string;
  country: string;
  year: number;
  award_type?: string;
  field: string;
  advisors?: string;
};

export type AlumniMember = {
  id: string;
  name: string;
  name_en?: string;
  avatar?: string;
  period: string;
  former_role_vi: string;
  former_role_en?: string;
  current_position_vi: string;
  current_position_en?: string;
  institution: string;
  institution_en?: string;
  research_focus?: string;
  email?: string;
  linkedin?: string;
};

export type AcademicPartner = {
  country: string;
  institution: string;
  key_collaborators: string[];
  research_focus: string;
};

export type SocialPost = {
  type: string;
  title: string;
  abstract?: string;
  journal?: string;
  paper_title?: string;
  authors?: string[];
  organizer?: string;
  collaboration?: string;
  name?: string;
  link?: string;
  action_label?: string;
  venue?: string;
};

export type PageRoute = 
  | 'home'
  | 'projects'
  | 'seminars'
  | 'events'
  | 'publications'
  | 'people'
  | 'alumni'
  | 'lab-life';
