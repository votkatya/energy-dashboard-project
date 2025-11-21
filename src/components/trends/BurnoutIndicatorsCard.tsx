import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface BurnoutIndicatorsCardProps {
  entries: any[];
}

interface Indicator {
  type: 'critical' | 'warning' | 'ok';
  title: string;
  before: string;
  after: string;
  change: string;
}

const BurnoutIndicatorsCard = ({ entries }: BurnoutIndicatorsCardProps) => {
  const analytics = useMemo(() => {
    if (!entries || entries.length < 10) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const last30Days = entries
      .filter((e: any) => {
        const date = parseDate(e.date);
        return date >= thirtyDaysAgo && date <= now;
      })
      .sort((a: any, b: any) => parseDate(a.date).getTime() - parseDate(b.date).getTime());

    if (last30Days.length < 10) return null;

    const midPoint = Math.floor(last30Days.length / 2);
    const firstPeriod = last30Days.slice(0, midPoint);
    const secondPeriod = last30Days.slice(midPoint);

    const allScores = entries.map((e: any) => e.score).sort((a: number, b: number) => a - b);
    const q25Index = Math.floor(allScores.length * 0.25);
    const q75Index = Math.floor(allScores.length * 0.75);
    const userLowThreshold = allScores[q25Index];
    const userHighThreshold = allScores[q75Index];
    const userMedian = allScores[Math.floor(allScores.length / 2)];

    const analyzePeriod = (period: any[]) => {
      const scores = period.map((e: any) => e.score);
      const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;

      let peakDays = 0;
      let lowDays = 0;
      let daysSinceLastPeak = 0;
      const peakDistances: number[] = [];
      let lastPeakIndex = -1;

      for (let i = 0; i < period.length; i++) {
        if (period[i].score >= userHighThreshold) {
          peakDays++;
          if (lastPeakIndex !== -1) {
            peakDistances.push(i - lastPeakIndex);
          }
          lastPeakIndex = i;
        }
        if (period[i].score <= userLowThreshold) {
          lowDays++;
        }
      }

      if (lastPeakIndex !== -1) {
        daysSinceLastPeak = period.length - 1 - lastPeakIndex;
      } else {
        daysSinceLastPeak = period.length;
      }

      const avgPeakDistance = peakDistances.length > 0
        ? peakDistances.reduce((a, b) => a + b, 0) / peakDistances.length
        : period.length;

      const lowStreaks: number[] = [];
      let currentStreak = 0;
      for (const entry of period) {
        if (entry.score <= userLowThreshold) {
          currentStreak++;
        } else {
          if (currentStreak > 0) {
            lowStreaks.push(currentStreak);
            currentStreak = 0;
          }
        }
      }
      if (currentStreak > 0) lowStreaks.push(currentStreak);

      const avgLowStreakLength = lowStreaks.length > 0
        ? lowStreaks.reduce((a, b) => a + b, 0) / lowStreaks.length
        : 0;

      return {
        avg: Math.round(avg * 10) / 10,
        peakDays,
        lowDays,
        avgPeakDistance: Math.round(avgPeakDistance * 10) / 10,
        avgLowStreakLength: Math.round(avgLowStreakLength * 10) / 10,
        lowStreaksCount: lowStreaks.length,
        daysSinceLastPeak
      };
    };

    const first = analyzePeriod(firstPeriod);
    const second = analyzePeriod(secondPeriod);

    const indicators: Indicator[] = [];

    if (second.daysSinceLastPeak > 7 && second.daysSinceLastPeak > first.daysSinceLastPeak) {
      indicators.push({
        type: 'critical',
        title: 'Нет пиков энергии',
        before: `${first.daysSinceLastPeak} дней назад`,
        after: `${second.daysSinceLastPeak} дней назад`,
        change: 'Ваши пики энергии стали редкими'
      });
    }

    const peakFreqChange = second.avgPeakDistance - first.avgPeakDistance;
    if (peakFreqChange > 2) {
      indicators.push({
        type: 'critical',
        title: 'Пики энергии стали реже',
        before: `Каждые ${first.avgPeakDistance} дней`,
        after: `Каждые ${second.avgPeakDistance} дней`,
        change: `+${Math.round(peakFreqChange)} дней между пиками`
      });
    }

    if (second.avgLowStreakLength > first.avgLowStreakLength && second.avgLowStreakLength > 2) {
      indicators.push({
        type: 'warning',
        title: 'Спады длятся дольше',
        before: `${first.avgLowStreakLength} дней`,
        after: `${second.avgLowStreakLength} дней`,
        change: 'Время восстановления увеличилось'
      });
    }

    if (second.lowStreaksCount > first.lowStreaksCount) {
      indicators.push({
        type: 'warning',
        title: 'Спады стали чаще',
        before: `${first.lowStreaksCount} за период`,
        after: `${second.lowStreaksCount} за период`,
        change: 'Количество спадов увеличилось'
      });
    }

    const avgChange = second.avg - first.avg;
    if (avgChange < -0.3) {
      indicators.push({
        type: 'warning',
        title: 'Средняя энергия падает',
        before: `${first.avg}`,
        after: `${second.avg}`,
        change: `${Math.round(avgChange * 10) / 10} относительно вашей нормы`
      });
    }

    if (indicators.length === 0) {
      indicators.push({
        type: 'ok',
        title: 'Всё стабильно',
        before: '',
        after: '',
        change: 'Критичных изменений не обнаружено'
      });
    }

    return {
      indicators,
      userMedian: Math.round(userMedian * 10) / 10,
      userLow: Math.round(userLowThreshold * 10) / 10,
      userHigh: Math.round(userHighThreshold * 10) / 10
    };
  }, [entries]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Недостаточно данных для анализа индикаторов (требуется минимум 10 записей за 30 дней)
          </p>
        </CardContent>
      </Card>
    );
  }

  const { indicators, userMedian, userLow, userHigh } = analytics;
  const criticalCount = indicators.filter(i => i.type === 'critical').length;
  const warningCount = indicators.filter(i => i.type === 'warning').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-orange-500" />
            Ранние индикаторы выгорания
            <span className="text-xs text-muted-foreground font-normal ml-auto">
              за 30 дней
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-3 rounded-lg bg-secondary/20 border border-secondary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Ваша личная норма энергии</span>
              <span className="text-sm font-bold">{userMedian}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="text-orange-500">↓</span>
                <span className="text-muted-foreground">Ваш спад: ≤{userLow}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-500">↑</span>
                <span className="text-muted-foreground">Ваш пик: ≥{userHigh}</span>
              </div>
            </div>
          </div>

          {criticalCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={18} className="text-red-500" />
                <h3 className="text-sm font-semibold text-red-500">Критичные изменения</h3>
              </div>
              <div className="space-y-2">
                {indicators
                  .filter(i => i.type === 'critical')
                  .map((indicator, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <div className="font-medium text-sm mb-2">{indicator.title}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div>
                          <span className="opacity-60">Раньше: </span>
                          <span>{indicator.before}</span>
                        </div>
                        <div>
                          <span className="opacity-60">Сейчас: </span>
                          <span>{indicator.after}</span>
                        </div>
                      </div>
                      <div className="text-xs text-red-400">{indicator.change}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {warningCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={18} className="text-orange-500" />
                <h3 className="text-sm font-semibold text-orange-500">Требуют внимания</h3>
              </div>
              <div className="space-y-2">
                {indicators
                  .filter(i => i.type === 'warning')
                  .map((indicator, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20"
                    >
                      <div className="font-medium text-sm mb-2">{indicator.title}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div>
                          <span className="opacity-60">Раньше: </span>
                          <span>{indicator.before}</span>
                        </div>
                        <div>
                          <span className="opacity-60">Сейчас: </span>
                          <span>{indicator.after}</span>
                        </div>
                      </div>
                      <div className="text-xs text-orange-400">{indicator.change}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {criticalCount === 0 && warningCount === 0 && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
              <Icon name="CheckCircle" size={24} className="text-green-500 mx-auto mb-2" />
              <div className="font-medium text-sm text-green-500 mb-1">Всё стабильно</div>
              <div className="text-xs text-muted-foreground">
                Критичных изменений в вашей энергии не обнаружено
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BurnoutIndicatorsCard;
