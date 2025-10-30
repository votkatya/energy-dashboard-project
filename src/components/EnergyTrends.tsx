import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { calculateStats } from '@/utils/statsCalculator';
import { 
  analyzeBurnoutRisk, 
  predictNextWeek, 
  recommendRestDay 
} from '@/utils/predictiveAnalytics';

interface EnergyTrendsProps {
  data?: any;
  isLoading?: boolean;
}

const EnergyTrends = ({ data, isLoading }: EnergyTrendsProps) => {
  const predictions = useMemo(() => {
    if (!data?.entries || data.entries.length === 0) {
      return {
        burnoutRisk: null,
        weekPrediction: null,
        restDay: null
      };
    }

    return {
      burnoutRisk: analyzeBurnoutRisk(data.entries),
      weekPrediction: predictNextWeek(data.entries),
      restDay: recommendRestDay(data.entries)
    };
  }, [data]);

  const analytics = useMemo(() => {
    if (!data?.entries || data.entries.length === 0) {
      return {
        currentMonthAvg: 0,
        previousMonthAvg: 0,
        goodPercent: 0,
        neutralPercent: 0,
        badPercent: 0,
        bestDayOfWeek: 'выходные',
        worstDayOfWeek: 'понедельники',
        bestWeek: { start: '', end: '', avg: 0 },
        trend: 0,
        totalEntries: 0
      };
    }

    const entries = data.entries;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthEntries = entries.filter((e: any) => {
      const date = parseDate(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const previousMonthEntries = entries.filter((e: any) => {
      const date = parseDate(e.date);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });

    const currentMonthStats = calculateStats(currentMonthEntries);
    const previousMonthStats = calculateStats(previousMonthEntries);
    const allStats = calculateStats(entries);

    const currentMonthAvg = currentMonthStats.average;
    const previousMonthAvg = previousMonthStats.average;
    const { good, neutral, bad, total } = allStats;

    const dayOfWeekScores: { [key: number]: { sum: number; count: number } } = {};
    entries.forEach((e: any) => {
      const date = parseDate(e.date);
      const dayOfWeek = date.getDay();
      if (!dayOfWeekScores[dayOfWeek]) {
        dayOfWeekScores[dayOfWeek] = { sum: 0, count: 0 };
      }
      dayOfWeekScores[dayOfWeek].sum += e.score;
      dayOfWeekScores[dayOfWeek].count += 1;
    });

    const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    let bestDay = 0;
    let worstDay = 0;
    let bestAvg = 0;
    let worstAvg = 5;

    Object.keys(dayOfWeekScores).forEach((day) => {
      const dayNum = parseInt(day);
      const avg = dayOfWeekScores[dayNum].sum / dayOfWeekScores[dayNum].count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDay = dayNum;
      }
      if (avg < worstAvg) {
        worstAvg = avg;
        worstDay = dayNum;
      }
    });

    const last3Months = entries.filter((e: any) => {
      const date = parseDate(e.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return date >= threeMonthsAgo;
    });

    const first3MonthsGood = last3Months.slice(0, Math.floor(last3Months.length / 2)).filter((e: any) => e.score >= 4).length;
    const second3MonthsGood = last3Months.slice(Math.floor(last3Months.length / 2)).filter((e: any) => e.score >= 4).length;
    const trend = last3Months.length > 0 
      ? ((second3MonthsGood / Math.max(last3Months.length / 2, 1)) - (first3MonthsGood / Math.max(last3Months.length / 2, 1))) * 100
      : 0;

    return {
      currentMonthAvg: Math.round(currentMonthAvg * 10) / 10,
      previousMonthAvg: Math.round(previousMonthAvg * 10) / 10,
      goodPercent: Math.round((good / total) * 100),
      neutralPercent: Math.round((neutral / total) * 100),
      badPercent: Math.round((bad / total) * 100),
      bestDayOfWeek: dayNames[bestDay],
      worstDayOfWeek: dayNames[worstDay],
      bestWeek: { start: '', end: '', avg: 0 },
      trend: Math.round(trend),
      totalEntries: total
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.entries || data.entries.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Недостаточно данных для анализа трендов</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {predictions.burnoutRisk && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name={predictions.burnoutRisk.icon as any} size={24} className={predictions.burnoutRisk.color} />
              Риск выгорания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className={`text-lg font-medium ${predictions.burnoutRisk.color}`}>
                    {predictions.burnoutRisk.message}
                  </p>
                  {predictions.burnoutRisk.level !== 'low' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      💡 Совет: Запланируй отдых, сократи нагрузку, уделяй время восстановлению
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {predictions.weekPrediction && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={24} className="text-primary" />
              Прогноз на следующую неделю
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl font-heading font-bold text-primary">
                      {predictions.weekPrediction.probability}%
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase">вероятность</span>
                      <span className="text-xs text-muted-foreground">
                        {predictions.weekPrediction.confidence === 'high' ? '🎯 Высокая точность' :
                         predictions.weekPrediction.confidence === 'medium' ? '📊 Средняя точность' :
                         '🔮 Низкая точность'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {predictions.weekPrediction.message}
                  </p>
                </div>
                <div className="text-5xl">
                  {predictions.weekPrediction.trend === 'up' ? '📈' :
                   predictions.weekPrediction.trend === 'down' ? '📉' : '➡️'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {predictions.restDay && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Coffee" size={24} className="text-accent" />
              Рекомендация по отдыху
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🛌</span>
                <div className="flex-1">
                  <p className="font-medium text-lg mb-1">
                    Планируй отдых в {predictions.restDay.dayOfWeek}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {predictions.restDay.reason}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                    <Icon name="Activity" size={14} />
                    Средняя энергия: {predictions.restDay.avgEnergy}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg border-l-4 border-l-energy-excellent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" size={24} className="text-energy-excellent" />
            Общий тренд
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-r from-energy-excellent/20 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Средний балл за месяц</span>
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-4xl font-heading font-bold text-energy-excellent">
                {analytics.currentMonthAvg || '—'}
              </div>
              {analytics.previousMonthAvg > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {analytics.currentMonthAvg > analytics.previousMonthAvg ? '+' : ''}
                  {(analytics.currentMonthAvg - analytics.previousMonthAvg).toFixed(1)} по сравнению с прошлым месяцем
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-energy-excellent/10 to-transparent border border-energy-excellent/30">
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 mb-1">
                  <span className="text-lg md:text-xl">😊</span>
                  <div className="text-xl md:text-2xl font-heading font-bold text-energy-excellent">
                    {analytics.goodPercent}%
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">Хорошие</p>
              </div>
              <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-energy-neutral/10 to-transparent border border-energy-neutral/30">
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 mb-1">
                  <span className="text-lg md:text-xl">😐</span>
                  <div className="text-xl md:text-2xl font-heading font-bold text-energy-neutral">
                    {analytics.neutralPercent}%
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">Средние</p>
              </div>
              <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-energy-low/10 to-transparent border border-energy-low/30">
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 mb-1">
                  <span className="text-lg md:text-xl">😔</span>
                  <div className="text-xl md:text-2xl font-heading font-bold text-energy-low">
                    {analytics.badPercent}%
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">Плохие</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Наблюдения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-medium mb-1">Лучший день недели</p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.bestDayOfWeek.charAt(0).toUpperCase() + analytics.bestDayOfWeek.slice(1)} показывает самый высокий уровень энергии
                  </p>
                </div>
              </div>
            </div>

            {analytics.trend !== 0 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-l-accent">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium mb-1">
                      {analytics.trend > 0 ? 'Тренд улучшения' : 'Тренд изменения'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      За последнее время количество хороших дней {analytics.trend > 0 ? 'выросло' : 'изменилось'} на {Math.abs(analytics.trend)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-gradient-to-r from-energy-good/10 to-transparent border-l-4 border-l-energy-good">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-medium mb-1">Всего записей</p>
                  <p className="text-sm text-muted-foreground">
                    Сделано {analytics.totalEntries} {analytics.totalEntries === 1 ? 'запись' : analytics.totalEntries < 5 ? 'записи' : 'записей'} - продолжай в том же духе!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analytics.goodPercent >= 70 && (
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">💪</span>
                </div>
                <p className="text-sm">Отличные результаты! Продолжай поддерживать текущий уровень энергии</p>
              </li>
            )}
            {analytics.goodPercent < 50 && (
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">🎯</span>
                </div>
                <p className="text-sm">Попробуй выявить паттерны: что влияет на твою энергию в хорошие дни?</p>
              </li>
            )}
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">📝</span>
              </div>
              <p className="text-sm">
                Обрати внимание на {analytics.worstDayOfWeek} - в этот день энергия часто ниже
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">✨</span>
              </div>
              <p className="text-sm">Старайся записывать детали о днях - это помогает выявить закономерности</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyTrends;