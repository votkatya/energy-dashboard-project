import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface EnergyTrendsProps {
  data?: any;
  isLoading?: boolean;
}

const EnergyTrends = ({ data, isLoading }: EnergyTrendsProps) => {
  const tagLabels: { [key: string]: string } = {
    work: 'Работа',
    family: 'Семья',
    sport: 'Спорт',
    sleep: 'Сон',
    hobby: 'Хобби',
    social: 'Общение',
    study: 'Учёба',
    health: 'Здоровье'
  };

  const analytics = useMemo(() => {
    if (!data?.entries || data.entries.length === 0) {
      return null;
    }

    const entries = data.entries;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthEntries = entries.filter((e: any) => {
      const date = parseDate(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const tagScores: { [tag: string]: { sum: number; count: number; highCount: number; lowCount: number } } = {};
    monthEntries.forEach((e: any) => {
      if (e.tags && Array.isArray(e.tags)) {
        e.tags.forEach((tag: string) => {
          const tagKey = tag.toLowerCase();
          if (!tagScores[tagKey]) {
            tagScores[tagKey] = { sum: 0, count: 0, highCount: 0, lowCount: 0 };
          }
          tagScores[tagKey].sum += e.score;
          tagScores[tagKey].count += 1;
          if (e.score >= 4) tagScores[tagKey].highCount += 1;
          if (e.score < 3) tagScores[tagKey].lowCount += 1;
        });
      }
    });

    const tagAverages = Object.entries(tagScores)
      .map(([tag, data]) => ({
        tag: tagLabels[tag] || tag,
        avg: data.sum / data.count,
        count: data.count
      }))
      .sort((a, b) => b.avg - a.avg);

    const bestTags = Object.entries(tagScores)
      .map(([tag, data]) => ({
        tag: tagLabels[tag] || tag,
        highCount: data.highCount,
        count: data.count
      }))
      .filter(t => t.highCount > 0)
      .sort((a, b) => b.highCount - a.highCount)
      .slice(0, 3);

    const worstTags = Object.entries(tagScores)
      .map(([tag, data]) => ({
        tag: tagLabels[tag] || tag,
        lowCount: data.lowCount,
        count: data.count
      }))
      .filter(t => t.lowCount > 0)
      .sort((a, b) => b.lowCount - a.lowCount)
      .slice(0, 3);

    const wordFrequency: { [word: string]: number } = {};
    monthEntries.forEach((e: any) => {
      if (e.thoughts) {
        const words = e.thoughts
          .toLowerCase()
          .replace(/[^\wа-яё\s]/gi, '')
          .split(/\s+/)
          .filter((w: string) => w.length > 3);
        
        words.forEach((word: string) => {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
      }
    });

    const topWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    const sortedEntries = [...entries].sort((a: any, b: any) => {
      return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    const lowPeriods: number[] = [];
    let lowStart = -1;
    for (let i = 0; i < sortedEntries.length; i++) {
      if (sortedEntries[i].score < 3) {
        if (lowStart === -1) lowStart = i;
      } else {
        if (lowStart !== -1) {
          lowPeriods.push(i - lowStart);
          lowStart = -1;
        }
      }
    }
    const avgLowPeriod = lowPeriods.length > 0
      ? Math.round((lowPeriods.reduce((a, b) => a + b, 0) / lowPeriods.length) * 10) / 10
      : 0;

    const highPeriods: number[] = [];
    let highStart = -1;
    for (let i = 0; i < sortedEntries.length; i++) {
      if (sortedEntries[i].score >= 4) {
        if (highStart === -1) highStart = i;
      } else {
        if (highStart !== -1) {
          highPeriods.push(i - highStart);
          highStart = -1;
        }
      }
    }
    const avgHighPeriod = highPeriods.length > 0
      ? Math.round((highPeriods.reduce((a, b) => a + b, 0) / highPeriods.length) * 10) / 10
      : 0;

    return {
      bestTags,
      worstTags,
      tagAverages,
      topWords,
      avgLowPeriod,
      avgHighPeriod
    };
  }, [data, tagLabels]);

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

  if (!analytics) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon name="TrendingUp" size={18} className="text-primary" />
                Лучшие теги месяца
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.bestTags.length > 0 ? (
                <div className="space-y-2">
                  {analytics.bestTags.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-primary/5">
                      <span className="text-sm font-medium capitalize">{item.tag}</span>
                      <span className="text-sm text-primary font-semibold">×{item.highCount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Нет данных</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon name="TrendingDown" size={18} className="text-orange-500" />
                Худшие теги месяца
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.worstTags.length > 0 ? (
                <div className="space-y-2">
                  {analytics.worstTags.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-orange-500/5">
                      <span className="text-sm font-medium capitalize">{item.tag}</span>
                      <span className="text-sm text-orange-500 font-semibold">×{item.lowCount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Нет данных</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="Hash" size={18} className="text-primary" />
              Средняя энергия по тегам
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.tagAverages.length > 0 ? (
              <div className="space-y-2">
                {analytics.tagAverages.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm font-medium capitalize flex-1">{item.tag}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(item.avg / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {item.avg.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Нет данных</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="MessageSquare" size={18} className="text-primary" />
              Частые слова в заметках (месяц)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topWords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analytics.topWords.map((item, idx) => (
                  <div 
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
                  >
                    <span className="text-sm font-medium">{item.word}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">×{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Нет данных</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon name="Activity" size={18} className="text-orange-500" />
                Средняя длина спадов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-3xl font-bold text-orange-500">
                    {analytics.avgLowPeriod > 0 ? analytics.avgLowPeriod : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.avgLowPeriod > 0 ? 'дней подряд' : 'нет данных'}
                  </p>
                </div>
                <Icon name="ArrowDown" size={32} className="text-orange-500/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon name="Activity" size={18} className="text-primary" />
                Средняя длина пиков
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-3xl font-bold text-primary">
                    {analytics.avgHighPeriod > 0 ? analytics.avgHighPeriod : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.avgHighPeriod > 0 ? 'дней подряд' : 'нет данных'}
                  </p>
                </div>
                <Icon name="ArrowUp" size={32} className="text-primary/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnergyTrends;