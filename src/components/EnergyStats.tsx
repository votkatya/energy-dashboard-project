import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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
  const parseDate = (dateStr: string): Date => {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateStr);
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

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
        const good = entries.filter(e => e.score >= 4).length;
        const neutral = entries.filter(e => e.score === 3).length;
        const bad = entries.filter(e => e.score <= 2).length;
        const avg = entries.reduce((sum, e) => sum + e.score, 0) / entries.length;

        return {
          week: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          weekKey,
          timestamp: date.getTime(),
          bad,
          neutral,
          good,
          avg: Math.round(avg * 10) / 10
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
        const good = entries.filter(e => e.score >= 4).length;
        const neutral = entries.filter(e => e.score === 3).length;
        const bad = entries.filter(e => e.score <= 2).length;
        const avg = entries.reduce((sum, e) => sum + e.score, 0) / entries.length;

        return {
          month: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          monthKey,
          timestamp: date.getTime(),
          bad,
          neutral,
          good,
          avg: Math.round(avg * 10) / 10
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

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="CalendarDays" size={24} />
            Статистика по неделям
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyStats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-secondary/50 to-transparent border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Неделя {stat.week}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold">
                    ø {stat.avg}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-heading font-bold text-energy-excellent">{stat.good}</div>
                      <div className="text-xs text-muted-foreground">Хорошие</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-heading font-bold text-energy-neutral">{stat.neutral}</div>
                      <div className="text-xs text-muted-foreground">Нейтральные</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-heading font-bold text-energy-low">{stat.bad}</div>
                      <div className="text-xs text-muted-foreground">Плохие</div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="CalendarRange" size={24} />
            Статистика по месяцам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-l-accent">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Месяц {stat.month}</span>
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-bold">
                    ø {stat.avg}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-heading font-bold text-energy-excellent">{stat.good}</div>
                      <div className="text-xs text-muted-foreground">Хорошие</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-heading font-bold text-energy-neutral">{stat.neutral}</div>
                      <div className="text-xs text-muted-foreground">Нейтральные</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-heading font-bold text-energy-low">{stat.bad}</div>
                      <div className="text-xs text-muted-foreground">Плохие</div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyStats;