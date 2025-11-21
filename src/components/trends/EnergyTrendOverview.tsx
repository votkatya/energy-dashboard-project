import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface EnergyTrendOverviewProps {
  entries: any[];
}

interface PhaseInfo {
  name: string;
  icon: string;
  color: string;
  description: string;
}

const EnergyTrendOverview = ({ entries }: EnergyTrendOverviewProps) => {
  const analytics = useMemo(() => {
    if (!entries || entries.length === 0) return null;

    const now = new Date();
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    const twoWeeksEntries = entries.filter((e: any) => {
      const date = parseDate(e.date);
      return date >= twoWeeksAgo && date <= now;
    });

    if (twoWeeksEntries.length === 0) return null;

    const scores = twoWeeksEntries.map((e: any) => e.score);
    const avgEnergy = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    
    const sortedByDate = [...twoWeeksEntries].sort((a: any, b: any) => {
      return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    const firstWeekEntries = sortedByDate.slice(0, Math.floor(sortedByDate.length / 2));
    const secondWeekEntries = sortedByDate.slice(Math.floor(sortedByDate.length / 2));
    
    const firstWeekAvg = firstWeekEntries.length > 0
      ? firstWeekEntries.reduce((sum: number, e: any) => sum + e.score, 0) / firstWeekEntries.length
      : avgEnergy;
    
    const secondWeekAvg = secondWeekEntries.length > 0
      ? secondWeekEntries.reduce((sum: number, e: any) => sum + e.score, 0) / secondWeekEntries.length
      : avgEnergy;

    const lowEnergyDays = twoWeeksEntries.filter((e: any) => e.score <= 4).length;
    const burnoutRisk = Math.round((lowEnergyDays / twoWeeksEntries.length) * 100);

    const trend = secondWeekAvg > firstWeekAvg ? 'up' : secondWeekAvg < firstWeekAvg ? 'down' : 'stable';
    const trendDiff = Math.abs(secondWeekAvg - firstWeekAvg);
    
    let weekForecast = 0;
    if (trend === 'up') {
      weekForecast = Math.min(100, Math.round(70 + (trendDiff * 10)));
    } else if (trend === 'down') {
      weekForecast = Math.max(0, Math.round(50 - (trendDiff * 10)));
    } else {
      weekForecast = 60;
    }

    let phase: PhaseInfo;
    if (avgEnergy < 4) {
      phase = {
        name: 'Истощение',
        icon: 'BatteryLow',
        color: 'text-red-500',
        description: 'Требуется восстановление'
      };
    } else if (avgEnergy >= 4 && avgEnergy < 5) {
      phase = {
        name: 'Восстановление',
        icon: 'RefreshCw',
        color: 'text-orange-500',
        description: 'Энергия возвращается'
      };
    } else if (avgEnergy >= 5 && avgEnergy < 7) {
      phase = {
        name: 'Баланс',
        icon: 'Target',
        color: 'text-blue-500',
        description: 'Оптимальное состояние'
      };
    } else {
      phase = {
        name: 'Перегрузка',
        icon: 'Zap',
        color: 'text-yellow-500',
        description: 'Риск спада'
      };
    }

    return {
      phase,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      burnoutRisk,
      weekForecast,
      trend,
      trendDiff: Math.round(trendDiff * 10) / 10
    };
  }, [entries]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Недостаточно данных за последние 2 недели
          </p>
        </CardContent>
      </Card>
    );
  }

  const { phase, avgEnergy, burnoutRisk, weekForecast, trend, trendDiff } = analytics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={20} className="text-primary" />
            Общий тренд энергии
            <span className="text-xs text-muted-foreground font-normal ml-auto">
              за 2 недели
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-secondary/20 border border-secondary">
              <div className="flex items-center gap-2">
                <Icon name={phase.icon} size={20} className={phase.color} />
                <span className="text-sm text-muted-foreground">Текущая фаза</span>
              </div>
              <div>
                <p className={`text-2xl font-bold ${phase.color}`}>
                  {phase.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {phase.description}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Средняя энергия:</span>
                <span className="text-sm font-semibold">{avgEnergy} / 10</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-secondary/20 border border-secondary">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                <span className="text-sm text-muted-foreground">Динамика</span>
              </div>
              <div className="flex items-center gap-2">
                {trend === 'up' && (
                  <>
                    <Icon name="ArrowUp" size={24} className="text-green-500" />
                    <span className="text-2xl font-bold text-green-500">Рост</span>
                  </>
                )}
                {trend === 'down' && (
                  <>
                    <Icon name="ArrowDown" size={24} className="text-red-500" />
                    <span className="text-2xl font-bold text-red-500">Спад</span>
                  </>
                )}
                {trend === 'stable' && (
                  <>
                    <Icon name="Minus" size={24} className="text-blue-500" />
                    <span className="text-2xl font-bold text-blue-500">Стабильно</span>
                  </>
                )}
              </div>
              {trendDiff > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Изменение: {trendDiff} балла
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Риск выгорания</span>
                <span className={`text-sm font-semibold ${
                  burnoutRisk > 50 ? 'text-red-500' : burnoutRisk > 30 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {burnoutRisk}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    burnoutRisk > 50 ? 'bg-red-500' : burnoutRisk > 30 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${burnoutRisk}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {burnoutRisk > 50
                  ? 'Высокий риск — требуется отдых'
                  : burnoutRisk > 30
                  ? 'Средний риск — будьте внимательны'
                  : 'Низкий риск — всё под контролем'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Прогноз на неделю</span>
                <span className={`text-sm font-semibold ${
                  weekForecast > 70 ? 'text-green-500' : weekForecast > 50 ? 'text-blue-500' : 'text-orange-500'
                }`}>
                  {weekForecast}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    weekForecast > 70 ? 'bg-green-500' : weekForecast > 50 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${weekForecast}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {weekForecast > 70
                  ? 'Позитивный прогноз'
                  : weekForecast > 50
                  ? 'Стабильное состояние'
                  : 'Возможен спад энергии'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnergyTrendOverview;
