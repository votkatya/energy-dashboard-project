import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface EnergyIndexesCardProps {
  entries: any[];
}

const EnergyIndexesCard = ({ entries }: EnergyIndexesCardProps) => {
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

    const allScores = entries.map((e: any) => e.score).sort((a: number, b: number) => a - b);
    const q25Index = Math.floor(allScores.length * 0.25);
    const q75Index = Math.floor(allScores.length * 0.75);
    const medianIndex = Math.floor(allScores.length / 2);
    const userLowThreshold = allScores[q25Index];
    const userHighThreshold = allScores[q75Index];
    const userMedian = allScores[medianIndex];

    const peakDistances: number[] = [];
    let lastPeakIndex = -1;
    for (let i = 0; i < last30Days.length; i++) {
      if (last30Days[i].score >= userHighThreshold) {
        if (lastPeakIndex !== -1) {
          peakDistances.push(i - lastPeakIndex);
        }
        lastPeakIndex = i;
      }
    }

    const avgPeakDistance = peakDistances.length > 0
      ? peakDistances.reduce((a, b) => a + b, 0) / peakDistances.length
      : 0;

    const peakStdDev = peakDistances.length > 1
      ? Math.sqrt(
          peakDistances.reduce((sum, val) => sum + Math.pow(val - avgPeakDistance, 2), 0) /
            peakDistances.length
        )
      : 0;

    const lowStreaks: number[] = [];
    let currentLowStreak = 0;
    for (const entry of last30Days) {
      if (entry.score <= userLowThreshold) {
        currentLowStreak++;
      } else {
        if (currentLowStreak > 0) {
          lowStreaks.push(currentLowStreak);
          currentLowStreak = 0;
        }
      }
    }
    if (currentLowStreak > 0) lowStreaks.push(currentLowStreak);

    const avgLowStreakLength = lowStreaks.length > 0
      ? lowStreaks.reduce((a, b) => a + b, 0) / lowStreaks.length
      : 0;

    const recoveryTimes: number[] = [];
    let inLowPeriod = false;
    let lowStartIndex = -1;
    for (let i = 0; i < last30Days.length; i++) {
      if (last30Days[i].score <= userLowThreshold && !inLowPeriod) {
        inLowPeriod = true;
        lowStartIndex = i;
      } else if (last30Days[i].score >= userMedian && inLowPeriod) {
        recoveryTimes.push(i - lowStartIndex);
        inLowPeriod = false;
      }
    }

    const avgRecoveryTime = recoveryTimes.length > 0
      ? recoveryTimes.reduce((a, b) => a + b, 0) / recoveryTimes.length
      : 0;

    const cyclicityStatus =
      peakStdDev === 0
        ? 'insufficient'
        : peakStdDev < avgPeakDistance * 0.3
        ? 'stable'
        : peakStdDev < avgPeakDistance * 0.6
        ? 'moderate'
        : 'unstable';

    return {
      peakFrequency: Math.round(avgPeakDistance * 10) / 10,
      lowStreakLength: Math.round(avgLowStreakLength * 10) / 10,
      recoverySpeed: Math.round(avgRecoveryTime * 10) / 10,
      cyclicity: cyclicityStatus,
      cyclicityValue: Math.round(peakStdDev * 10) / 10,
      peaksCount: peakDistances.length + 1,
      lowStreaksCount: lowStreaks.length
    };
  }, [entries]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Недостаточно данных для расчёта индексов энергии
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    peakFrequency,
    lowStreakLength,
    recoverySpeed,
    cyclicity,
    cyclicityValue,
    peaksCount,
    lowStreaksCount
  } = analytics;

  const getCyclicityColor = () => {
    switch (cyclicity) {
      case 'stable':
        return 'text-green-500';
      case 'moderate':
        return 'text-blue-500';
      case 'unstable':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getCyclicityLabel = () => {
    switch (cyclicity) {
      case 'stable':
        return 'Стабильная';
      case 'moderate':
        return 'Умеренная';
      case 'unstable':
        return 'Нестабильная';
      default:
        return 'Недостаточно данных';
    }
  };

  const getCyclicityIcon = () => {
    switch (cyclicity) {
      case 'stable':
        return 'CheckCircle';
      case 'moderate':
        return 'MinusCircle';
      case 'unstable':
        return 'AlertCircle';
      default:
        return 'HelpCircle';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            Индексы энергии
            <span className="text-xs text-muted-foreground font-normal ml-auto">
              за 30 дней
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/20 border border-secondary">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="TrendingUp" size={18} className="text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Пики энергии
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {peakFrequency > 0 ? `${peakFrequency}` : '—'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {peakFrequency > 0 ? 'дней между пиками' : 'нет данных'}
                  </span>
                </div>
                {peaksCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Всего пиков: {peaksCount}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20 border border-secondary">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="TrendingDown" size={18} className="text-orange-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Спады энергии
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {lowStreakLength > 0 ? `${lowStreakLength}` : '—'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {lowStreakLength > 0 ? 'дней длятся спады' : 'нет спадов'}
                  </span>
                </div>
                {lowStreaksCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Всего спадов: {lowStreaksCount}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20 border border-secondary">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Zap" size={18} className="text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Скорость восстановления
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {recoverySpeed > 0 ? `${recoverySpeed}` : '—'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {recoverySpeed > 0 ? 'дней до восстановления' : 'нет данных'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {recoverySpeed > 0
                    ? recoverySpeed < 2
                      ? 'Быстрое восстановление'
                      : recoverySpeed < 4
                      ? 'Нормальное восстановление'
                      : 'Медленное восстановление'
                    : 'Недостаточно циклов'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20 border border-secondary">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Activity" size={18} className={getCyclicityColor()} />
                <span className="text-sm font-medium text-muted-foreground">
                  Цикличность
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name={getCyclicityIcon()} size={24} className={getCyclicityColor()} />
                  <span className={`text-xl font-bold ${getCyclicityColor()}`}>
                    {getCyclicityLabel()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {cyclicity === 'stable' && 'Пики происходят регулярно'}
                  {cyclicity === 'moderate' && 'Пики с небольшими колебаниями'}
                  {cyclicity === 'unstable' && 'Хаотичные интервалы между пиками'}
                  {cyclicity === 'insufficient' && 'Недостаточно пиков для анализа'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnergyIndexesCard;
