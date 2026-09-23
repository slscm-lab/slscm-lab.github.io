import { HallEntry } from '../types';
import achievementsData from '../data/generated/achievements.json';

const achievements: HallEntry[] = achievementsData as unknown as HallEntry[];

export function getAchievements(): HallEntry[] {
  return achievements;
}

export function getFeaturedAchievements(limit = 4): HallEntry[] {
  return achievements.slice(0, limit);
}

export function getAchievementsByYear(): Record<string, HallEntry[]> {
  return achievements.reduce<Record<string, HallEntry[]>>((groups, entry) => {
    const year = String(entry.year);
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(entry);
    return groups;
  }, {});
}
