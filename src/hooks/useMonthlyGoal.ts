import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const GOALS_API_URL = 'https://functions.poehali.dev/72ced3ee-9024-4117-9b2b-17c5350c2c83';

interface MonthlyGoal {
  id: number;
  year: number;
  month: number;
  goalScore: number;
  createdAt: string;
  updatedAt: string;
}

export const useMonthlyGoal = (year?: number, month?: number) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const fetchGoal = async (): Promise<MonthlyGoal | null> => {
    if (!token) {
      return null;
    }
    
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const url = `${GOALS_API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': token,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error('Failed to fetch goal');
    }

    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['monthlyGoal', year, month],
    queryFn: fetchGoal,
    enabled: !!token,
  });

  const setGoalMutation = useMutation({
    mutationFn: async ({ year, month, goalScore }: { year: number; month: number; goalScore: number }) => {
      if (!token) {
        throw new Error('No auth token available');
      }
      
      const response = await fetch(GOALS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({ year, month, goalScore }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to set goal');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyGoal'] });
    },
  });

  return {
    goal: data,
    isLoading,
    error,
    setGoal: setGoalMutation.mutate,
    isSettingGoal: setGoalMutation.isPending,
  };
};