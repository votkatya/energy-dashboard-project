import { useQuery } from '@tanstack/react-query';
import { ENTRIES_API, authService } from '@/lib/auth';

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
}

export const useEnergyData = () => {
  return useQuery<EnergyData>({
    queryKey: ['energy-data', authService.getToken()],
    queryFn: async () => {
      const token = authService.getToken();
      
      if (!token) {
        return { entries: [], stats: { good: 0, neutral: 0, bad: 0, average: 0, total: 0 } };
      }

      const response = await fetch(ENTRIES_API, {
        method: 'GET',
        headers: {
          'X-Auth-Token': token,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
        }
        throw new Error('Failed to fetch energy data');
      }
      
      return response.json();
    },
    refetchInterval: 30000,
    enabled: authService.isAuthenticated(),
  });
};