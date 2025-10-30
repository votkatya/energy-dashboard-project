import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { calculateStats } from '@/utils/statsCalculator';
import { 
  analyzeBurnoutRisk, 
  predictNextWeek, 
  recommendRestDay 
} from '@/utils/predictiveAnalytics';
import BurnoutRiskCard from './trends/BurnoutRiskCard';
import WeekPredictionCard from './trends/WeekPredictionCard';
import RestDayCard from './trends/RestDayCard';
import InsightsCards from './trends/InsightsCards';
import TrendOverviewCard from './trends/TrendOverviewCard';
import ObservationsCard from './trends/ObservationsCard';

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
        totalEntries: 0,
        avgRecoveryTime: 0,
        currentStreak: 0,
        streakType: 'none' as 'good' | 'bad' | 'none',
        bestTimeOfDay: 'выходные'
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

    const sortedEntries = [...entries].sort((a: any, b: any) => {
      return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    const recoveryTimes: number[] = [];
    for (let i = 0; i < sortedEntries.length - 1; i++) {
      if (sortedEntries[i].score < 3) {
        for (let j = i + 1; j < sortedEntries.length; j++) {
          if (sortedEntries[j].score >= 4) {
            recoveryTimes.push(j - i);
            break;
          }
        }
      }
    }
    const avgRecoveryTime = recoveryTimes.length > 0
      ? Math.round(recoveryTimes.reduce((a, b) => a + b, 0) / recoveryTimes.length)
      : 0;

    let currentStreak = 0;
    let streakType: 'good' | 'bad' | 'none' = 'none';
    if (sortedEntries.length > 0) {
      const lastScore = sortedEntries[sortedEntries.length - 1].score;
      streakType = lastScore >= 4 ? 'good' : lastScore < 3 ? 'bad' : 'none';
      
      if (streakType !== 'none') {
        for (let i = sortedEntries.length - 1; i >= 0; i--) {
          const score = sortedEntries[i].score;
          if (streakType === 'good' && score >= 4) {
            currentStreak++;
          } else if (streakType === 'bad' && score < 3) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    const bestTimeOfDay = Object.entries(dayOfWeekScores)
      .map(([day, data]) => ({
        day: parseInt(day),
        avg: data.sum / data.count
      }))
      .sort((a, b) => b.avg - a.avg)[0];

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
      totalEntries: total,
      avgRecoveryTime,
      currentStreak,
      streakType,
      bestTimeOfDay: bestTimeOfDay ? dayNames[bestTimeOfDay.day] : 'выходные'
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
        <BurnoutRiskCard burnoutRisk={predictions.burnoutRisk} />
      )}

      {predictions.weekPrediction && (
        <WeekPredictionCard weekPrediction={predictions.weekPrediction} />
      )}

      {predictions.restDay && (
        <RestDayCard restDay={predictions.restDay} />
      )}

      <TrendOverviewCard analytics={analytics} />

      <InsightsCards analytics={analytics} />

      <ObservationsCard analytics={analytics} />
    </div>
  );
};

export default EnergyTrends;
