import { parseDate } from './dateUtils';

interface EnergyEntry {
  date: string;
  score: number;
  thoughts: string;
  category: string;
  week: string;
  month: string;
}

export interface BurnoutRisk {
  level: 'low' | 'medium' | 'high' | 'critical';
  daysLow: number;
  message: string;
  color: string;
  icon: string;
}

export interface WeekPrediction {
  probability: number;
  confidence: 'low' | 'medium' | 'high';
  message: string;
  trend: 'up' | 'down' | 'stable';
}

export interface RestDayRecommendation {
  dayOfWeek: string;
  dayNumber: number;
  reason: string;
  avgEnergy: number;
}

export const analyzeBurnoutRisk = (entries: EnergyEntry[]): BurnoutRisk => {
  if (!entries || entries.length < 3) {
    return {
      level: 'low',
      daysLow: 0,
      message: 'Недостаточно данных для анализа',
      color: 'text-muted-foreground',
      icon: 'Info'
    };
  }

  const last7Days = entries.slice(-7);
  const consecutiveLowDays = getConsecutiveLowEnergyDays(last7Days);
  const avgLast7 = last7Days.reduce((sum, e) => sum + e.score, 0) / last7Days.length;
  const lowDaysCount = last7Days.filter(e => e.score < 3).length;

  if (consecutiveLowDays >= 5 || avgLast7 < 2.5) {
    return {
      level: 'critical',
      daysLow: consecutiveLowDays,
      message: `Критический уровень! ${consecutiveLowDays} дней подряд низкая энергия. Срочно нужен отдых.`,
      color: 'text-destructive',
      icon: 'AlertTriangle'
    };
  }

  if (consecutiveLowDays >= 3 || lowDaysCount >= 4) {
    return {
      level: 'high',
      daysLow: consecutiveLowDays,
      message: `Высокий риск выгорания. ${lowDaysCount} дней за неделю с низкой энергией. Запланируй отдых.`,
      color: 'text-orange-600',
      icon: 'AlertCircle'
    };
  }

  if (consecutiveLowDays >= 2 || lowDaysCount >= 2 || avgLast7 < 3.5) {
    return {
      level: 'medium',
      daysLow: consecutiveLowDays,
      message: 'Средний риск. Энергия снижается — самое время позаботиться о себе.',
      color: 'text-yellow-600',
      icon: 'Info'
    };
  }

  if (avgLast7 >= 4) {
    return {
      level: 'low',
      daysLow: 0,
      message: 'Отлично! Энергия на высоком уровне, риск выгорания минимален.',
      color: 'text-energy-excellent',
      icon: 'CheckCircle2'
    };
  }

  return {
    level: 'low',
    daysLow: 0,
    message: 'Всё хорошо! Энергия стабильна, риск выгорания низкий.',
    color: 'text-energy-excellent',
    icon: 'CheckCircle2'
  };
};

const getConsecutiveLowEnergyDays = (entries: EnergyEntry[]): number => {
  let count = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].score < 3) {
      count++;
    } else {
      break;
    }
  }
  return count;
};

export const predictNextWeek = (entries: EnergyEntry[]): WeekPrediction => {
  if (!entries || entries.length < 7) {
    return {
      probability: 50,
      confidence: 'low',
      message: 'Недостаточно данных для прогноза',
      trend: 'stable'
    };
  }

  const last14Days = entries.slice(-14);
  const lastWeek = last14Days.slice(-7);
  const prevWeek = last14Days.length >= 14 ? last14Days.slice(0, 7) : [];

  const lastWeekGood = lastWeek.filter(e => e.score >= 4).length;
  const prevWeekGood = prevWeek.length > 0 ? prevWeek.filter(e => e.score >= 4).length : lastWeekGood;
  const lastWeekAvg = lastWeek.reduce((sum, e) => sum + e.score, 0) / lastWeek.length;

  const trend = lastWeekGood > prevWeekGood ? 'up' : lastWeekGood < prevWeekGood ? 'down' : 'stable';
  
  let baseProbability = (lastWeekGood / lastWeek.length) * 100;
  
  if (lastWeekAvg >= 4.5) baseProbability = Math.max(baseProbability, 85);
  else if (lastWeekAvg >= 4) baseProbability = Math.max(baseProbability, 75);
  else if (lastWeekAvg >= 3.5) baseProbability = Math.max(baseProbability, 65);
  
  if (trend === 'up') baseProbability += 10;
  else if (trend === 'down') baseProbability -= 15;

  const probability = Math.min(95, Math.max(10, baseProbability));

  const last4Weeks = entries.slice(-28);
  const variance = calculateVariance(last4Weeks.map(e => e.score));
  const confidence = variance < 0.5 ? 'high' : variance < 1.2 ? 'medium' : 'low';

  let message = '';
  if (probability >= 75 && trend === 'up') {
    message = `Отличный прогноз! Тренд растёт, вероятность хорошей недели ${Math.round(probability)}%`;
  } else if (probability >= 70) {
    message = `Отличные шансы! Вероятность хорошей недели ${Math.round(probability)}%`;
  } else if (probability >= 50) {
    message = `Неплохие шансы. Вероятность хорошей недели около ${Math.round(probability)}%`;
  } else if (trend === 'down') {
    message = `Энергия снижается. Вероятность хорошей недели ${Math.round(probability)}%. Планируй восстановление`;
  } else {
    message = `Прогноз нестабилен. Фокус на отдыхе повысит шансы на успешную неделю`;
  }

  return {
    probability: Math.round(probability),
    confidence,
    message,
    trend
  };
};

const calculateVariance = (scores: number[]): number => {
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const squareDiffs = scores.map(s => Math.pow(s - avg, 2));
  return squareDiffs.reduce((sum, d) => sum + d, 0) / scores.length;
};

export const recommendRestDay = (entries: EnergyEntry[]): RestDayRecommendation | null => {
  if (!entries || entries.length < 14) {
    return null;
  }

  const dayOfWeekScores: { [key: number]: { sum: number; count: number } } = {};
  
  entries.forEach(entry => {
    const date = parseDate(entry.date);
    const dayOfWeek = date.getDay();
    if (!dayOfWeekScores[dayOfWeek]) {
      dayOfWeekScores[dayOfWeek] = { sum: 0, count: 0 };
    }
    dayOfWeekScores[dayOfWeek].sum += entry.score;
    dayOfWeekScores[dayOfWeek].count += 1;
  });

  const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'];
  let worstDay = 0;
  let worstAvg = 5;

  Object.keys(dayOfWeekScores).forEach(day => {
    const dayNum = parseInt(day);
    const avg = dayOfWeekScores[dayNum].sum / dayOfWeekScores[dayNum].count;
    if (avg < worstAvg && dayOfWeekScores[dayNum].count >= 2) {
      worstAvg = avg;
      worstDay = dayNum;
    }
  });

  if (worstAvg >= 3.5) {
    return null;
  }

  const reasons = [
    'Статистика показывает стабильно низкую энергию',
    'Паттерн усталости повторяется',
    'Организму нужно время на восстановление'
  ];

  return {
    dayOfWeek: dayNames[worstDay],
    dayNumber: worstDay,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    avgEnergy: Math.round(worstAvg * 10) / 10
  };
};