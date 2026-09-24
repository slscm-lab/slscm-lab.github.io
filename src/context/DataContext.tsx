import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Publication,
  EventBrief,
  Project,
  Seminar,
  ResearchPillar,
  LabOverview,
  SocialPost,
} from '../types';

import { supabase } from '../lib/supabase';
import {
  RawPeopleData,
  fetchPublicationsFromSupabase,
  fetchEventsFromSupabase,
  fetchPeopleFromSupabase,
  fetchProjectsFromSupabase,
  fetchSeminarsFromSupabase,
  fetchResearchPillarsFromSupabase,
  fetchLabOverviewFromSupabase,
  fetchSocialPostsFromSupabase,
} from '../services/supabaseService';

interface DataContextType {
  publications: Publication[];
  topicPublications: Publication[];
  events: EventBrief[];
  people: RawPeopleData;
  projects: Project[];
  seminars: Seminar[];
  pillars: ResearchPillar[];
  overview: LabOverview;
  socialPosts: SocialPost[];
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
}

const emptyPeopleData: RawPeopleData = {
  leadership_and_faculty: [],
  web_tech_lead: [],
  hall_of_fame: [],
  graduate_and_undergraduate_student_researchers: [],
  alumni: [],
  global_academic_partners: [],
};

const emptyOverview: LabOverview = {
  name: '',
  abbreviation: '',
  affiliation: '',
  faculty_department: '',
  address: '',
  head_of_lab: { name: '', email: '', title: '', office: '' },
  metrics: {
    total_publications: 0,
    journal_articles: 0,
    q1_journals: 0,
    active_projects: 0,
    phd_msc_scholarships: 0,
    valedictorians: 0,
    student_researchers: 0,
    international_partner_countries: 0,
  },
  research_pillars: [],
};

const DataContext = createContext<DataContextType>({
  publications: [],
  topicPublications: [],
  events: [],
  people: emptyPeopleData,
  projects: [],
  seminars: [],
  pillars: [],
  overview: emptyOverview,
  socialPosts: [],
  isLive: false,
  isLoading: true,
  error: null,
  refreshAll: async () => {},
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [topicPublications, setTopicPublications] = useState<Publication[]>([]);
  const [events, setEvents] = useState<EventBrief[]>([]);
  const [people, setPeople] = useState<RawPeopleData>(emptyPeopleData);
  const [projects, setProjects] = useState<Project[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [pillars, setPillars] = useState<ResearchPillar[]>([]);
  const [overview, setOverview] = useState<LabOverview>(emptyOverview);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    try {
      setError(null);
      const [
        livePubs,
        liveEvents,
        livePeople,
        liveProjects,
        liveSeminars,
        livePillars,
        liveOverview,
        liveSocial,
      ] = await Promise.all([
        fetchPublicationsFromSupabase(),
        fetchEventsFromSupabase(),
        fetchPeopleFromSupabase(),
        fetchProjectsFromSupabase(),
        fetchSeminarsFromSupabase(),
        fetchResearchPillarsFromSupabase(),
        fetchLabOverviewFromSupabase(),
        fetchSocialPostsFromSupabase(),
      ]);

      if (!livePubs || !liveEvents || !livePeople || !liveProjects || !liveSeminars || !livePillars || !liveOverview || !liveSocial) {
        throw new Error('One or more Supabase queries failed.');
      }

      setPublications(livePubs.filter((paper) => paper.status !== 'topic_only'));
      setTopicPublications(livePubs);
      setEvents(liveEvents);
      setPeople(livePeople);
      setProjects(liveProjects);
      setSeminars(liveSeminars);
      setPillars(livePillars);
      setOverview({ ...liveOverview, research_pillars: livePillars });
      setSocialPosts(liveSocial);

      setIsLive(true);
    } catch (err) {
      console.warn('DataContext: background sync from Supabase encountered error:', err);
      setIsLive(false);
      setError('Unable to load content from Supabase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch in background
    refreshAll();

    // Subscribe to real-time changes across public schema
    const channel = supabase
      .channel('slscm-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          refreshAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAll]);

  return (
    <DataContext.Provider
      value={{
        publications,
        topicPublications,
        events,
        people,
        projects,
        seminars,
        pillars,
        overview,
        socialPosts,
        isLive,
        isLoading,
        error,
        refreshAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
export const usePublications = () => useContext(DataContext).publications;
export const useTopicPublications = () => useContext(DataContext).topicPublications;
export const useEvents = () => useContext(DataContext).events;
export const usePeople = () => useContext(DataContext).people;
export const useProjects = () => useContext(DataContext).projects;
export const useSeminars = () => useContext(DataContext).seminars;
export const useResearchPillars = () => useContext(DataContext).pillars;
export const useLabOverview = () => useContext(DataContext).overview;
export const useSocialPosts = () => useContext(DataContext).socialPosts;
