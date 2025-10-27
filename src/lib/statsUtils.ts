import { getEntriesInRange } from './dateUtils';

export interface EnergyStats {
  good: number;
  neutral: number;
  bad: number;
  average: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
  streak: number;
}

export const calculateStats = (
  entries: Array<{ date: string; score: number }>,
  period: '3days' | 'week' | 'month' | 'year' = 'week'
): EnergyStats => {
  if (!entries || entries.length === 0) {
    return { 
      good: 0, 
      neutral: 0, 
      bad: 0, 
      average: 0, 
      total: 0,
      trend: 'stable',
      streak: 0
    };
  }

  // Фильтруем по периоду
  const filteredEntries = getEntriesInRange(entries, period);
  
  if (filteredEntries.length === 0) {
    return { 
      good: 0, 
      neutral: 0, 
      bad: 0, 
      average: 0, 
      total: 0,
      trend: 'stable',
      streak: 0
    };
  }

  const good = filteredEntries.filter(e => e.score >= 4).length;
  const neutral = filteredEntries.filter(e => e.score === 3).length;
  const bad = filteredEntries.filter(e => e.score <= 2).length;
  const total = filteredEntries.length;
  const average = filteredEntries.reduce((sum, e) => sum + e.score, 0) / total;

  // Рассчитываем тренд
  const trend = calculateTrend(filteredEntries);
  
  // Рассчитываем серию
  const streak = calculateStreak(entries);

  return { 
    good, 
    neutral, 
    bad, 
    average: Math.round(average * 10) / 10, 
    total,
    trend,
    streak
  };
};

const calculateTrend = (entries: Array<{ score: number }>): 'up' | 'down' | 'stable' => {
  if (entries.length < 2) return 'stable';
  
  const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
  const secondHalf = entries.slice(Math.floor(entries.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, e) => sum + e.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + e.score, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  
  if (diff > 0.2) return 'up';
  if (diff < -0.2) return 'down';
  return 'stable';
};

const calculateStreak = (entries: Array<{ score: number }>): number => {
  if (entries.length === 0) return 0;
  
  let streak = 0;
  const targetScore = 4; // Хорошие дни
  
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].score >= targetScore) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getInsights = (stats: EnergyStats): string[] => {
  const insights: string[] = [];
  
  if (stats.streak >= 3) {
    insights.push(`🔥 Отличная серия! ${stats.streak} хороших дней подряд`);
  }
  
  if (stats.average >= 4.5) {
    insights.push('🌟 Превосходный уровень энергии!');
  } else if (stats.average <= 2.5) {
    insights.push('💪 Время позаботиться о себе');
  }
  
  if (stats.trend === 'up') {
    insights.push('📈 Энергия растёт!');
  } else if (stats.trend === 'down') {
    insights.push('📉 Стоит обратить внимание на тренд');
  }
  
  if (stats.bad > stats.good) {
    insights.push('🤗 Больше заботы о себе');
  }
  
  return insights;
};
