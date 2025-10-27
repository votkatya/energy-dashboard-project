/**
 * Утилиты для работы с датами
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

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const getDateRange = (period: '3days' | 'week' | 'month' | 'year') => {
  const now = new Date();
  const start = new Date(now);
  
  switch (period) {
    case '3days':
      start.setDate(now.getDate() - 3);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return { start, end: now };
};

export const isDateInRange = (dateStr: string, start: Date, end: Date): boolean => {
  const entryDate = parseDate(dateStr);
  return entryDate >= start && entryDate <= end;
};

export const getEntriesInRange = (
  entries: Array<{ date: string; score: number }>,
  period: '3days' | 'week' | 'month' | 'year'
) => {
  const { start, end } = getDateRange(period);
  return entries.filter(entry => isDateInRange(entry.date, start, end));
};
