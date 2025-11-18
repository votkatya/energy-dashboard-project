import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate, getWeekNumber, formatWeekRu, formatMonthRu } from '@/utils/dateUtils';
import { calculateStats } from '@/utils/statsCalculator';

interface EnergyEntry {
  date: string;
  score: number;
  thoughts: string;
  category: string;
  week: string;
  month: string;
}

interface EnergyData {
  entries: EnergyEntry[];
  stats: {
    good: number;
    neutral: number;
    bad: number;
    average: number;
    total: number;
  };
}

interface EnergyStatsProps {
  data?: EnergyData;
  isLoading?: boolean;
}

const EnergyStats = ({ data, isLoading }: EnergyStatsProps) => {

  const calculateWeeklyStats = () => {
    if (!data?.entries || data.entries.length === 0) return [];

    const weekGroups: { [key: string]: EnergyEntry[] } = {};

    data.entries.forEach(entry => {
      const date = parseDate(entry.date);
      const year = date.getFullYear();
      const weekNum = getWeekNumber(date);
      const weekKey = `${year}-W${weekNum}`;

      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = [];
      }
      weekGroups[weekKey].push(entry);
    });

    const weekStats = Object.entries(weekGroups)
      .map(([weekKey, entries]) => {
        const latestEntry = entries[entries.length - 1];
        const date = parseDate(latestEntry.date);
        const stats = calculateStats(entries);

        return {
          week: formatWeekRu(date),
          weekKey,
          timestamp: date.getTime(),
          bad: stats.bad,
          neutral: stats.neutral,
          good: stats.good,
          avg: Math.round(stats.average * 10) / 10
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);

    return weekStats;
  };

  const calculateMonthlyStats = () => {
    if (!data?.entries || data.entries.length === 0) return [];

    const monthGroups: { [key: string]: EnergyEntry[] } = {};

    data.entries.forEach(entry => {
      const date = parseDate(entry.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(entry);
    });

    const monthStats = Object.entries(monthGroups)
      .map(([monthKey, entries]) => {
        const latestEntry = entries[entries.length - 1];
        const date = parseDate(latestEntry.date);
        const stats = calculateStats(entries);

        return {
          month: formatMonthRu(date),
          monthKey,
          timestamp: date.getTime(),
          bad: stats.bad,
          neutral: stats.neutral,
          good: stats.good,
          avg: Math.round(stats.average * 10) / 10
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);

    return monthStats;
  };

  const weeklyStats = calculateWeeklyStats();
  const monthlyStats = calculateMonthlyStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Icon name="Loader2" size={32} className="mx-auto mb-2 animate-spin" />
              Загрузка статистики...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.entries || data.entries.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              Пока нет данных для статистики
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default EnergyStats;