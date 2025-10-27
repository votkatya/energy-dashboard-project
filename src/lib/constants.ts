/**
 * API Configuration
 */
export const API_URL = import.meta.env.VITE_API_URL || 
  'https://functions.poehali.dev/0335f84a-22ea-47e1-ab0f-623e2884ffec';

/**
 * Query Configuration
 */
export const QUERY_CONFIG = {
  refetchInterval: 5 * 60 * 1000, // 5 minutes
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
};

/**
 * Energy Score Constants
 */
export const ENERGY_SCORES = {
  EXCELLENT: 5,
  GOOD: 4,
  NEUTRAL: 3,
  MEDIUM_LOW: 2,
  LOW: 1,
} as const;

/**
 * Energy Categories
 */
export const ENERGY_CATEGORIES = {
  EXCELLENT: { min: 5, max: 5, label: 'Отличный', color: 'energy-excellent' },
  GOOD: { min: 4, max: 4, label: 'Хороший', color: 'energy-good' },
  NEUTRAL: { min: 3, max: 3, label: 'Нейтральный', color: 'energy-neutral' },
  MEDIUM_LOW: { min: 2, max: 2, label: 'Средне-низкий', color: 'energy-medium-low' },
  LOW: { min: 1, max: 1, label: 'Плохой', color: 'energy-low' },
} as const;

/**
 * Time Periods
 */
export const TIME_PERIODS = {
  THREE_DAYS: '3days' as const,
  WEEK: 'week' as const,
  MONTH: 'month' as const,
  YEAR: 'year' as const,
} as const;

/**
 * Time Period Limits
 */
export const TIME_PERIOD_LIMITS = {
  [TIME_PERIODS.THREE_DAYS]: 3,
  [TIME_PERIODS.WEEK]: 7,
  [TIME_PERIODS.MONTH]: 30,
  [TIME_PERIODS.YEAR]: 365,
} as const;

/**
 * Monthly Goal
 */
export const MONTHLY_GOAL = 4.0;

/**
 * Animation Durations (ms)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
