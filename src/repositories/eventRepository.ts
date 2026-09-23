import { EventBrief } from '../types';
import eventsData from '../data/generated/events.json';

const events: EventBrief[] = eventsData as unknown as EventBrief[];

export function getEvents(): EventBrief[] {
  return events;
}

export function getRecentEvents(limit = 4): EventBrief[] {
  return events.slice(0, limit);
}

export function getFeaturedEvents(limit?: number): EventBrief[] {
  const featured = events.filter((e) => e.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export function getEventById(id: string): EventBrief | undefined {
  return events.find((e) => e.id === id);
}
