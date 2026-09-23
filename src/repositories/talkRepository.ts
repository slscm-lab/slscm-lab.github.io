import { ConferenceTalk } from '../types';
import talksData from '../data/generated/conferences_talks.json';

const talks: ConferenceTalk[] = talksData as unknown as ConferenceTalk[];

export function getConferenceTalks(): ConferenceTalk[] {
  return talks;
}

export function getTalksByType(type: ConferenceTalk['type']): ConferenceTalk[] {
  return talks.filter((t) => t.type === type);
}

export function getRecentTalks(limit = 4): ConferenceTalk[] {
  return talks.slice(0, limit);
}

export function getTalkById(id: string): ConferenceTalk | undefined {
  return talks.find((t) => t.id === id);
}
