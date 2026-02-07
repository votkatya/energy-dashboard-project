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

interface EnergyStats {
  good: number;
  neutral: number;
  bad: number;
  average: number;
  total: number;
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
  
  return { good, neutral, bad, average, total };
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
    queryKey: ['energy-data', 'v3'],
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
      console.log('📥 RAW данные с бэкенда (первые 3):', rawEntries.slice(0, 3));
      console.log('📅 Порядок дат:', {
        first: rawEntries[0]?.date,
        last: rawEntries[rawEntries.length - 1]?.date,
        total: rawEntries.length
      });
      
      const sortedEntries = [...rawEntries].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
      
      const entries = sortedEntries.map(addDerivedFields);
      console.log('✅ После сортировки (последние 3):', entries.slice(-3));
      const stats = data.stats || calculateStats(entries);
      
      return { entries, stats };
    },
    refetchInterval: 30000,
    enabled: !!token,
    staleTime: 0,
  });
};