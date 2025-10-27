import { z } from 'zod';

export const EnergyEntrySchema = z.object({
  date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Неверный формат даты (DD.MM.YYYY)'),
  score: z.number().min(1).max(5, 'Балл должен быть от 1 до 5'),
  thoughts: z.string().max(500, 'Заметки не должны превышать 500 символов'),
  category: z.string().optional(),
  week: z.string().optional(),
  month: z.string().optional(),
});

export const validateEnergyEntry = (data: unknown) => {
  try {
    return EnergyEntrySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Неизвестная ошибка валидации' }]
    };
  }
};

export const validateDate = (dateStr: string): boolean => {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 2020 || year > 2030) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
};

export const validateScore = (score: number): boolean => {
  return Number.isInteger(score) && score >= 1 && score <= 5;
};
