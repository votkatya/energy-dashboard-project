import { parseDate } from './dateUtils';

interface EnergyEntry {
  date: string;
  score: number;
  thoughts: string;
  category: string;
  week: string;
  month: string;
}

export interface StatsResult {
  good: number;
  neutral: number;
  bad: number;
  average: number;
  total: number;
}

export const calculateStats = (entries: EnergyEntry[]): StatsResult => {
  if (!entries || entries.length === 0) {
    return { good: 0, neutral: 0, bad: 0, average: 0, total: 0 };
  }

  const good = entries.filter(e => e.score >= 4).length;
  const neutral = entries.filter(e => e.score === 3).length;
  const bad = entries.filter(e => e.score <= 2).length;
  const total = entries.length;
  const average = total > 0 ? entries.reduce((sum, e) => sum + e.score, 0) / total : 0;

  return { good, neutral, bad, average, total };
};

export const filterEntriesByDays = (entries: EnergyEntry[], days: number): EnergyEntry[] => {
  if (!entries || entries.length === 0) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return entries.filter(entry => {
    const entryDate = parseDate(entry.date);
    return entryDate >= cutoffDate;
  });
};

export const filterEntriesByDateRange = (
  entries: EnergyEntry[], 
  startDate: Date, 
  endDate?: Date
): EnergyEntry[] => {
  if (!entries || entries.length === 0) return [];

  const end = endDate || new Date();
  
  return entries.filter(entry => {
    const entryDate = parseDate(entry.date);
    return entryDate >= startDate && entryDate <= end;
  });
};
