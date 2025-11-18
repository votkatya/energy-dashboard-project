import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { useMemo } from 'react';

interface EnergyEntry {
  date: string;
  score: number;
}

interface PeriodComparisonStatsProps {
  entries: EnergyEntry[];
  period: 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
}

const PeriodComparisonStats = ({ entries, period, startDate, endDate }: PeriodComparisonStatsProps) => {
  const stats = useMemo(() => {
    const currentEntries = entries.filter(e => {
      const date = parseDate(e.date);
      return date >= startDate && date <= endDate;
    });

    const periodLength = endDate.getTime() - startDate.getTime();
    const previousStart = new Date(startDate.getTime() - periodLength);
    const previousEnd = new Date(startDate.getTime() - 1);

    const previousEntries = entries.filter(e => {
      const date = parseDate(e.date);
      return date >= previousStart && date <= previousEnd;
    });

    const calculateMetrics = (data: EnergyEntry[]) => {
      if (data.length === 0) return { average: 0, goodDays: 0, neutralDays: 0, badDays: 0 };
      
      const sum = data.reduce((acc, e) => acc + e.score, 0);
      const average = sum / data.length;
      const goodDays = data.filter(e => e.score >= 4).length;
      const neutralDays = data.filter(e => e.score === 3).length;
      const badDays = data.filter(e => e.score <= 2).length;

      return { average, goodDays, neutralDays, badDays };
    };

    const current = calculateMetrics(currentEntries);
    const previous = calculateMetrics(previousEntries);

    const averageDiff = current.average - previous.average;
    const averagePercent = previous.average > 0 ? (averageDiff / previous.average) * 100 : 0;
    const goodDaysDiff = current.goodDays - previous.goodDays;
    const neutralDaysDiff = current.neutralDays - previous.neutralDays;
    const badDaysDiff = current.badDays - previous.badDays;

    return {
      current,
      previous,
      averageDiff,
      averagePercent,
      goodDaysDiff,
      neutralDaysDiff,
      badDaysDiff
    };
  }, [entries, startDate, endDate]);

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'неделя';
      case 'month': return 'месяц';
      case 'year': return 'год';
      default: return 'период';
    }
  };

  const renderMetricRow = (
    label: string,
    currentValue: number,
    previousValue: number,
    diff: number,
    isPercent: boolean = false,
    invertColors: boolean = false
  ) => {
    const isPositive = invertColors ? diff < 0 : diff > 0;
    const isNeutral = diff === 0;
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">
              {isPercent ? currentValue.toFixed(1) : currentValue}
            </span>
            {!isNeutral && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                isPositive 
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                  : 'bg-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                <Icon 
                  name={isPositive ? "TrendingUp" : "TrendingDown"} 
                  size={14} 
                />
                <span>
                  {Math.abs(diff).toFixed(isPercent ? 1 : 0)}{isPercent ? '%' : ''}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Этот {getPeriodLabel()}</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {isPercent ? previousValue.toFixed(1) : previousValue}
          </span>
          <span className="text-xs">Прошлый {getPeriodLabel()}</span>
        </div>
      </div>
    );
  };

  const getDayLabel = (count: number) => {
    if (count === 0) return 'дней';
    if (count === 1) return 'день';
    if (count >= 2 && count <= 4) return 'дня';
    return 'дней';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon name="GitCompare" size={20} />
          Сравнение с прошлым периодом
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderMetricRow(
          'Средний балл',
          stats.current.average,
          stats.previous.average,
          stats.averagePercent,
          true,
          false
        )}

        <div className="border-t pt-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Хороших дней (4-5★)</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-foreground">
                  {stats.current.goodDays} {getDayLabel(stats.current.goodDays)}
                </span>
                {stats.goodDaysDiff !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stats.goodDaysDiff > 0
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    <Icon 
                      name={stats.goodDaysDiff > 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                    />
                    <span>{Math.abs(stats.goodDaysDiff)}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Этот {getPeriodLabel()}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{stats.previous.goodDays} {getDayLabel(stats.previous.goodDays)}</span>
              <span className="text-xs">Прошлый {getPeriodLabel()}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Нейтральных дней (3★)</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-foreground">
                  {stats.current.neutralDays} {getDayLabel(stats.current.neutralDays)}
                </span>
                {stats.neutralDaysDiff !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stats.neutralDaysDiff > 0
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                      : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    <Icon 
                      name={stats.neutralDaysDiff > 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                    />
                    <span>{Math.abs(stats.neutralDaysDiff)}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Этот {getPeriodLabel()}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{stats.previous.neutralDays} {getDayLabel(stats.previous.neutralDays)}</span>
              <span className="text-xs">Прошлый {getPeriodLabel()}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Плохих дней (1-2★)</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-foreground">
                  {stats.current.badDays} {getDayLabel(stats.current.badDays)}
                </span>
                {stats.badDaysDiff !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stats.badDaysDiff < 0
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    <Icon 
                      name={stats.badDaysDiff < 0 ? "TrendingDown" : "TrendingUp"} 
                      size={14} 
                    />
                    <span>{Math.abs(stats.badDaysDiff)}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Этот {getPeriodLabel()}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{stats.previous.badDays} {getDayLabel(stats.previous.badDays)}</span>
              <span className="text-xs">Прошлый {getPeriodLabel()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodComparisonStats;