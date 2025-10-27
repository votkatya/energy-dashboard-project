import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { validateEnergyEntry } from '@/lib/validation';
import { formatDate } from '@/lib/dateUtils';

interface AddEntryData {
  score: number;
  thoughts: string;
}

interface AddEntryResponse {
  success: boolean;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const useAddEntry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation<AddEntryResponse, Error, AddEntryData>({
    mutationFn: async (data) => {
      setIsSubmitting(true);
      
      // Валидация
      const validation = validateEnergyEntry({
        date: formatDate(new Date()),
        score: data.score,
        thoughts: data.thoughts,
      });
      
      if (!validation.success) {
        return {
          success: false,
          errors: validation.errors
        };
      }
      
      // Здесь должен быть реальный API вызов
      // Пока что симулируем успешное добавление
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Запись успешно добавлена!'
      };
    },
    onSuccess: (data) => {
      if (data.success) {
        // Обновляем кэш данных
        queryClient.invalidateQueries({ queryKey: ['energy-data'] });
      }
    },
    onError: (error) => {
      console.error('Error adding entry:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const addEntry = async (data: AddEntryData) => {
    return mutation.mutateAsync(data);
  };

  return {
    addEntry,
    isSubmitting,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data
  };
};
