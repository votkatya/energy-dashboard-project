import { ENERGY_CATEGORIES } from './constants';

/**
 * Получить категорию энергии по баллу
 */
export const getEnergyCategory = (score: number) => {
  if (score >= 5) return ENERGY_CATEGORIES.EXCELLENT;
  if (score >= 4) return ENERGY_CATEGORIES.GOOD;
  if (score >= 3) return ENERGY_CATEGORIES.NEUTRAL;
  if (score >= 2) return ENERGY_CATEGORIES.MEDIUM_LOW;
  return ENERGY_CATEGORIES.LOW;
};

/**
 * Получить цвет для балла энергии (для использования с cn())
 */
export const getEnergyColorClasses = (score: number) => {
  const category = getEnergyCategory(score);
  
  return {
    bg: `bg-${category.color}`,
    border: `border-l-${category.color}`,
    text: 'text-white',
  };
};

/**
 * Получить фиксированный класс цвета для Tailwind
 * Используется вместо динамических классов
 */
export const getEnergyColorClass = (score: number): string => {
  if (score >= 5) return 'bg-energy-excellent';
  if (score >= 4) return 'bg-energy-good';
  if (score >= 3) return 'bg-energy-neutral';
  if (score >= 2) return 'bg-energy-medium-low';
  return 'bg-energy-low';
};

/**
 * Парсинг даты в формате DD.MM.YYYY
 */
export const parseDate = (dateStr: string): Date => {
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
};

/**
 * Проверить, попадает ли дата в интервал
 */
export const isDateInRange = (
  date: string,
  startDate: Date,
  endDate: Date
): boolean => {
  const entryDate = parseDate(date);
  return entryDate >= startDate && entryDate <= endDate;
};

/**
 * Рассчитать статистику по записям
 */
export const calculateStats = (entries: Array<{ score: number }>) => {
  if (!entries || entries.length === 0) {
    return { good: 0, neutral: 0, bad: 0, average: 0, total: 0 };
  }

  const good = entries.filter(e => e.score >= 4).length;
  const neutral = entries.filter(e => e.score === 3).length;
  const bad = entries.filter(e => e.score <= 2).length;
  const total = entries.length;
  const average = entries.reduce((sum, e) => sum + e.score, 0) / total;

  return { 
    good, 
    neutral, 
    bad, 
    average: Math.round(average * 10) / 10, 
    total 
  };
};

/**
 * Получить записи за последние N дней
 */
export const getRecentEntries = (
  entries: Array<{ date: string; score: number }>,
  days: number
) => {
  if (!entries) return [];
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return entries.filter(entry => {
    const entryDate = parseDate(entry.date);
    return entryDate >= cutoffDate;
  });
};

/**
 * Фильтровать записи по периоду
 */
export const filterEntriesByPeriod = (
  entries: Array<{ date: string }>,
  limit: number
) => {
  if (!entries || entries.length === 0) return [];
  
  // Возвращаем последние N записей (если записей меньше, возвращаем все)
  return entries.slice(-limit);
};
