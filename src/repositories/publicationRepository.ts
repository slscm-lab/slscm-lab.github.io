import { Publication } from '../types';
import publicationsData from '../data/generated/publications.json';

const publications: Publication[] = publicationsData as unknown as Publication[];

export function getPublications(): Publication[] {
  return publications;
}

export function getFeaturedPublications(limit = 4): Publication[] {
  return publications.filter((p) => p.is_featured).slice(0, limit);
}

export function getPublicationById(id: string): Publication | undefined {
  return publications.find((p) => p.id === id);
}

export function getPublicationsByPillar(pillarId: string): Publication[] {
  if (!pillarId || pillarId === 'all') return publications;
  return publications.filter(
    (p) => p.research_pillar === pillarId || p.primary_pillar_id === pillarId
  );
}

export function getPublicationsByYear(year: number | string): Publication[] {
  if (!year || year === 'all') return publications;
  const targetYear = typeof year === 'string' ? parseInt(year, 10) : year;
  return publications.filter((p) => p.year === targetYear);
}

export function getPublicationsByKeyword(keywordId: string): Publication[] {
  if (!keywordId || keywordId === 'all') return publications;
  return publications.filter((publication) => publication.keywords?.includes(keywordId));
}
