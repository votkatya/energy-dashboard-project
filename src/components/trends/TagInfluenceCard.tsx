import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface TagInfluenceCardProps {
  entries: any[];
}

interface TagStats {
  tag: string;
  avg: number;
  count: number;
}

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

const tagEmojis: { [key: string]: string } = {
  work: '💼',
  family: '👨‍👩‍👧',
  sport: '🏃',
  sleep: '😴',
  hobby: '🎨',
  social: '🏙️',
  study: '📚',
  health: '🏥'
};

const TagInfluenceCard = ({ entries }: TagInfluenceCardProps) => {
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

    const overallAvg = twoWeeksEntries.reduce((sum: number, e: any) => sum + e.score, 0) / twoWeeksEntries.length;

    const tagScores: { [tag: string]: { sum: number; count: number } } = {};
    
    twoWeeksEntries.forEach((e: any) => {
      if (e.tags && Array.isArray(e.tags)) {
        e.tags.forEach((tag: string) => {
          const tagKey = tag.toLowerCase();
          if (!tagScores[tagKey]) {
            tagScores[tagKey] = { sum: 0, count: 0 };
          }
          tagScores[tagKey].sum += e.score;
          tagScores[tagKey].count += 1;
        });
      }
    });

    const tagAverages: TagStats[] = Object.entries(tagScores)
      .map(([tag, data]) => ({
        tag: tagLabels[tag] || tag,
        tagKey: tag,
        avg: Math.round((data.sum / data.count) * 10) / 10,
        count: data.count
      }))
      .filter(t => t.count >= 2);

    const boostingTags = tagAverages
      .filter(t => t.avg > overallAvg)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);

    const drainingTags = tagAverages
      .filter(t => t.avg < overallAvg)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 3);

    return {
      boostingTags,
      drainingTags,
      overallAvg: Math.round(overallAvg * 10) / 10
    };
  }, [entries]);

  if (!analytics || (analytics.boostingTags.length === 0 && analytics.drainingTags.length === 0)) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Недостаточно данных для анализа влияния тегов
          </p>
        </CardContent>
      </Card>
    );
  }

  const { boostingTags, drainingTags, overallAvg } = analytics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-primary" />
            Что влияет на энергию
            <span className="text-xs text-muted-foreground font-normal ml-auto">
              средняя: {overallAvg}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {boostingTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size={18} className="text-green-500" />
                <h3 className="text-sm font-semibold text-green-500">Повышают энергию</h3>
              </div>
              <div className="space-y-2">
                {boostingTags.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tagEmojis[item.tagKey] || '📌'}</span>
                      <span className="text-sm font-medium">{item.tag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">средняя</span>
                      <span className="text-sm font-bold text-green-500">{item.avg}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {drainingTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="TrendingDown" size={18} className="text-orange-500" />
                <h3 className="text-sm font-semibold text-orange-500">Снижают энергию</h3>
              </div>
              <div className="space-y-2">
                {drainingTags.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tagEmojis[item.tagKey] || '📌'}</span>
                      <span className="text-sm font-medium">{item.tag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">средняя</span>
                      <span className="text-sm font-bold text-orange-500">{item.avg}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TagInfluenceCard;
