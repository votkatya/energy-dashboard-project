import { useQuery } from '@tanstack/react-query';
import { API_URL, QUERY_CONFIG } from '@/lib/constants';

interface EnergyEntry {
  date: string;
  score: number;
  thoughts: string;
  category: string;
  week: string;
  month: string;
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
  demo?: boolean;
  error?: string;
}

export const useEnergyData = () => {
  return useQuery<EnergyData, Error>({
    queryKey: ['energy-data'],
    queryFn: async () => {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate data structure
        if (!data.entries || !Array.isArray(data.entries)) {
          throw new Error('Invalid data structure received from API');
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching energy data:', error);
        throw error;
      }
    },
    refetchInterval: QUERY_CONFIG.refetchInterval,
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
