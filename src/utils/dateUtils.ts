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

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getDateRangeFilter = (days: number) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);
  return cutoffDate;
};

export const formatDateRu = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

export const formatMonthRu = (date: Date): string => {
  const formatted = date.toLocaleDateString('ru-RU', { 
    month: 'long', 
    year: 'numeric' 
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const getWeekRange = (date: Date): { weekNum: number; startDate: Date; endDate: Date } => {
  const weekNum = getWeekNumber(date);
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const startDate = new Date(date);
  startDate.setDate(date.getDate() + diff);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return { weekNum, startDate, endDate };
};

export const formatWeekRu = (date: Date): string => {
  const { startDate, endDate } = getWeekRange(date);
  const start = startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const end = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  return `${start} — ${end}`;
};