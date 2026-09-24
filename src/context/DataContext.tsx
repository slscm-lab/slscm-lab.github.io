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

// Static fallback data (zero layout shift, instant load)
import staticPublications from '../data/generated/publications.json';
import staticEvents from '../data/generated/events.json';
import staticPeople from '../data/generated/people.json';
import staticProjects from '../data/generated/projects.json';
import staticSeminars from '../data/generated/seminars.json';
import staticPillars from '../data/generated/research_pillars.json';
import staticOverview from '../data/generated/overview.json';
import staticSocial from '../data/generated/social_posts.json';

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
  events: EventBrief[];
  people: RawPeopleData;
  projects: Project[];
  seminars: Seminar[];
  pillars: ResearchPillar[];
  overview: LabOverview;
  socialPosts: SocialPost[];
  isLive: boolean;
  refreshAll: () => Promise<void>;
}

const initialPeopleData = staticPeople as unknown as RawPeopleData;

const DataContext = createContext<DataContextType>({
  publications: staticPublications as unknown as Publication[],
  events: staticEvents as unknown as EventBrief[],
  people: initialPeopleData,
  projects: staticProjects as unknown as Project[],
  seminars: staticSeminars as unknown as Seminar[],
  pillars: staticPillars as unknown as ResearchPillar[],
  overview: staticOverview as unknown as LabOverview,
  socialPosts: staticSocial as unknown as SocialPost[],
  isLive: false,
  refreshAll: async () => {},
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>(
    staticPublications as unknown as Publication[]
  );
  const [events, setEvents] = useState<EventBrief[]>(
    staticEvents as unknown as EventBrief[]
  );
  const [people, setPeople] = useState<RawPeopleData>(initialPeopleData);
  const [projects, setProjects] = useState<Project[]>(
    staticProjects as unknown as Project[]
  );
  const [seminars, setSeminars] = useState<Seminar[]>(
    staticSeminars as unknown as Seminar[]
  );
  const [pillars, setPillars] = useState<ResearchPillar[]>(
    staticPillars as unknown as ResearchPillar[]
  );
  const [overview, setOverview] = useState<LabOverview>(
    staticOverview as unknown as LabOverview
  );
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(
    staticSocial as unknown as SocialPost[]
  );
  const [isLive, setIsLive] = useState<boolean>(false);

  const refreshAll = useCallback(async () => {
    try {
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

      if (livePubs && livePubs.length > 0) setPublications(livePubs);
      if (liveEvents && liveEvents.length > 0) setEvents(liveEvents);
      if (livePeople) setPeople(livePeople);
      if (liveProjects && liveProjects.length > 0) setProjects(liveProjects);
      if (liveSeminars && liveSeminars.length > 0) setSeminars(liveSeminars);
      if (livePillars && livePillars.length > 0) setPillars(livePillars);
      if (liveOverview) {
        setOverview((prev) => ({
          ...prev,
          ...liveOverview,
          metrics: prev.metrics,
          research_pillars: livePillars && livePillars.length > 0 ? livePillars : prev.research_pillars,
        }));
      }
      if (liveSocial && liveSocial.length > 0) setSocialPosts(liveSocial);

      setIsLive(true);
    } catch (err) {
      console.warn('DataContext: background sync from Supabase encountered error:', err);
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
        events,
        people,
        projects,
        seminars,
        pillars,
        overview,
        socialPosts,
        isLive,
        refreshAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
export const usePublications = () => useContext(DataContext).publications;
export const useEvents = () => useContext(DataContext).events;
export const usePeople = () => useContext(DataContext).people;
export const useProjects = () => useContext(DataContext).projects;
export const useSeminars = () => useContext(DataContext).seminars;
export const useResearchPillars = () => useContext(DataContext).pillars;
export const useLabOverview = () => useContext(DataContext).overview;
export const useSocialPosts = () => useContext(DataContext).socialPosts;
