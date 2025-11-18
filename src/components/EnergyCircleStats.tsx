import { Card, CardContent } from '@/components/ui/card';
import { parseDate } from '@/utils/dateUtils';
import { useMemo } from 'react';

interface EnergyEntry {
  date: string;
  score: number;
}

interface EnergyCircleStatsProps {
  entries: EnergyEntry[];
  period: 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
}

const EnergyCircleStats = ({ entries, period, startDate, endDate }: EnergyCircleStatsProps) => {
  const stats = useMemo(() => {
    const filteredEntries = entries.filter(e => {
      const date = parseDate(e.date);
      return date >= startDate && date <= endDate;
    });

    const counts = {
      excellent: 0,
      good: 0,
      neutral: 0,
      mediumLow: 0,
      low: 0
    };

    filteredEntries.forEach(entry => {
      if (entry.score >= 5) counts.excellent++;
      else if (entry.score >= 4) counts.good++;
      else if (entry.score >= 3) counts.neutral++;
      else if (entry.score >= 2) counts.mediumLow++;
      else counts.low++;
    });

    const total = filteredEntries.length;
    const sum = filteredEntries.reduce((acc, e) => acc + e.score, 0);
    const average = total > 0 ? sum / total : 0;

    return { counts, average, total };
  }, [entries, startDate, endDate]);

  const { counts, average, total } = stats;

  const circumference = 2 * Math.PI * 80;
  
  const segments = [
    { count: counts.excellent, color: '#08D169', label: 'Отличные' },
    { count: counts.good, color: '#25DACE', label: 'Хорошие' },
    { count: counts.neutral, color: '#48C0FF', label: 'Нейтральные' },
    { count: counts.mediumLow, color: '#FF9D78', label: 'Средне-низкие' },
    { count: counts.low, color: '#FF5F72', label: 'Плохие' }
  ];

  let currentOffset = 0;

  return (
    <Card className="glass-card">
      <CardContent className="py-6">
        <div className="flex items-center gap-8">
          <div className="relative flex-shrink-0">
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              {segments.map((segment, index) => {
                if (segment.count === 0 || total === 0) return null;
                
                const percentage = segment.count / total;
                const strokeLength = circumference * percentage;
                const strokeOffset = currentOffset;
                currentOffset += strokeLength;

                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="20"
                    strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                    strokeDashoffset={-strokeOffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">
                  {average.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{segment.label}</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {segment.count} {segment.count === 1 ? 'день' : segment.count < 5 ? 'дня' : 'дней'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyCircleStats;
