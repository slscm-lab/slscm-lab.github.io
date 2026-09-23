import { Seminar } from '../types';
import seminarsData from '../data/generated/seminars.json';

const seminars: Seminar[] = seminarsData as unknown as Seminar[];

export function getSeminars(): Seminar[] {
  return seminars;
}

export function getUpcomingSeminars(limit?: number): Seminar[] {
  const upcoming = seminars.filter((s) => s.status === 'Upcoming');
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getRecentSeminars(limit = 3): Seminar[] {
  return seminars.slice(0, limit);
}

export function getSeminarById(id: string): Seminar | undefined {
  return seminars.find((s) => s.id === id);
}
