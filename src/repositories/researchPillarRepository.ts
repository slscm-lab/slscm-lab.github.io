import { ResearchPillar } from '../types';
import pillarsData from '../data/generated/research_pillars.json';

const pillars: ResearchPillar[] = pillarsData as unknown as ResearchPillar[];

export function getResearchPillars(): ResearchPillar[] {
  return pillars;
}

export function getResearchPillarById(id: string): ResearchPillar | undefined {
  return pillars.find((p) => p.id === id);
}
