import { Project } from '../types';
import projectsData from '../data/generated/projects.json';

const projects: Project[] = projectsData as unknown as Project[];

export function getProjects(): Project[] {
  return projects;
}

export function getActiveProjects(limit?: number): Project[] {
  const active = projects.filter((p) => p.status === 'Active');
  return limit ? active.slice(0, limit) : active;
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByCategory(category: string): Project[] {
  if (!category || category === 'all') return projects;
  return projects.filter(
    (p) => p.category === category || p.category_en === category
  );
}
