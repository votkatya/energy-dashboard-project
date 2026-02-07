import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://functions.poehali.dev/2d4b8a75-8e94-40d2-8412-5e0040b74b86';

interface EnergyEntry {
  id?: number;
  date: string;
  score: number;
  thoughts: string;
  tags?: string[];
  category?: string;
  week?: string;
  month?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PeriodStats {
  average: number;
  count: number;
}

interface EnergyStats {
  good: number;
  neutral: number;
  bad: number;
  average: number;
  total: number;
  last14Days: PeriodStats;
  currentMonth: PeriodStats;
}

interface EnergyData {
  entries: EnergyEntry[];
  stats: EnergyStats;
}

const calculateStats = (entries: EnergyEntry[]): EnergyStats => {
  const total = entries.length;
  const good = entries.filter(e => e.score >= 3).length;
  const neutral = entries.filter(e => e.score === 2).length;
  const bad = entries.filter(e => e.score <= 1).length;
  const average = total > 0 ? entries.reduce((sum, e) => sum + e.score, 0) / total : 0;
  
  // Рассчитываем за последние 14 дней
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const last14DaysEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    return entryDate >= fourteenDaysAgo;
  });
  const avg14Days = last14DaysEntries.length > 0 
    ? last14DaysEntries.reduce((sum, e) => sum + e.score, 0) / last14DaysEntries.length 
    : 0;
  
  // Рассчитываем за текущий месяц
  const currentMonthEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    return entryDate.getFullYear() === now.getFullYear() && 
           entryDate.getMonth() === now.getMonth();
  });
  const avgCurrentMonth = currentMonthEntries.length > 0
    ? currentMonthEntries.reduce((sum, e) => sum + e.score, 0) / currentMonthEntries.length
    : 0;
  
  return { 
    good, 
    neutral, 
    bad, 
    average, 
    total,
    last14Days: {
      average: avg14Days,
      count: last14DaysEntries.length
    },
    currentMonth: {
      average: avgCurrentMonth,
      count: currentMonthEntries.length
    }
  };
};

const addDerivedFields = (entry: EnergyEntry): EnergyEntry => {
  let date: Date;
  
  if (entry.date.includes('.')) {
    const [day, month, year] = entry.date.split('.').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(entry.date);
  }
  
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  
  const category = entry.score >= 3 ? 'Хорошие дни' : entry.score === 2 ? 'Средние дни' : 'Плохие дни';
  const week = `Неделя ${Math.ceil(date.getDate() / 7)}`;
  const month = monthNames[date.getMonth()];
  
  return { ...entry, category, week, month };
};

export const useEnergyData = () => {
  const token = localStorage.getItem('auth_token');
  
  return useQuery<EnergyData>({
    queryKey: ['energy-data', 'v4'],
    queryFn: async () => {
      const response = await fetch(API_URL, {
        headers: {
          'X-Auth-Token': token || '',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch energy data');
      }
      const data = await response.json();
      const rawEntries: EnergyEntry[] = data.entries || [];
      
      const sortedEntries = [...rawEntries].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
      
      const entries = sortedEntries.map(addDerivedFields);
      
      // ВАЖНО: Если бэкенд вернул новую версию с last14Days — используем её
      // Иначе считаем на фронте (временно, пока бэкенд не обновится)
      let stats = data.stats || calculateStats(entries);
      
      if (!stats.last14Days && entries.length > 0) {
        // Находим самую позднюю дату в entries (это текущая дата на сервере)
        const latestDate = new Date(Math.max(...entries.map(e => new Date(e.date).getTime())));
        
        const fourteenDaysAgo = new Date(latestDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        const last14DaysEntries = entries.filter(e => {
          const entryDate = new Date(e.date);
          return entryDate >= fourteenDaysAgo && entryDate <= latestDate;
        });
        
        const currentMonthEntries = entries.filter(e => {
          const entryDate = new Date(e.date);
          return entryDate.getFullYear() === latestDate.getFullYear() && 
                 entryDate.getMonth() === latestDate.getMonth();
        });
        
        stats = {
          ...stats,
          last14Days: {
            average: last14DaysEntries.length > 0 
              ? last14DaysEntries.reduce((sum, e) => sum + e.score, 0) / last14DaysEntries.length 
              : 0,
            count: last14DaysEntries.length
          },
          currentMonth: {
            average: currentMonthEntries.length > 0
              ? currentMonthEntries.reduce((sum, e) => sum + e.score, 0) / currentMonthEntries.length
              : 0,
            count: currentMonthEntries.length
          }
        };
      }
      
      return { entries, stats };
    },
    refetchInterval: 30000,
    enabled: !!token,
    staleTime: 0,
  });
};