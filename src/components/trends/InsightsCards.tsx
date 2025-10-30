import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface InsightsCardsProps {
  analytics: {
    avgRecoveryTime: number;
    currentStreak: number;
    streakType: 'good' | 'bad' | 'none';
    bestTimeOfDay: string;
  };
}

const InsightsCards = ({ analytics }: InsightsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon name="Timer" size={20} className="text-primary" />
            Восстановление
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-heading font-bold text-primary mb-2">
              {analytics.avgRecoveryTime > 0 ? `${analytics.avgRecoveryTime} дн.` : '—'}
            </div>
            <p className="text-sm text-muted-foreground">
              {analytics.avgRecoveryTime > 0 
                ? 'Среднее время восстановления после плохих дней'
                : 'Недостаточно данных'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={`shadow-lg border-l-4 ${analytics.streakType === 'good' ? 'border-l-energy-excellent' : analytics.streakType === 'bad' ? 'border-l-energy-low' : 'border-l-muted'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon name="Flame" size={20} className={analytics.streakType === 'good' ? 'text-energy-excellent' : analytics.streakType === 'bad' ? 'text-energy-low' : 'text-muted-foreground'} />
            Текущая серия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-4xl font-heading font-bold mb-2 ${analytics.streakType === 'good' ? 'text-energy-excellent' : analytics.streakType === 'bad' ? 'text-energy-low' : 'text-muted-foreground'}`}>
              {analytics.currentStreak > 0 ? analytics.currentStreak : '0'}
              <span className="text-2xl ml-1">{analytics.streakType === 'good' ? '🔥' : analytics.streakType === 'bad' ? '💤' : '—'}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {analytics.streakType === 'good' ? 'Подряд хороших дней' : analytics.streakType === 'bad' ? 'Подряд плохих дней' : 'Нет активной серии'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-l-accent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon name="Star" size={20} className="text-accent" />
            Лучшее время
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-heading font-bold text-accent mb-2">
              {analytics.bestTimeOfDay.charAt(0).toUpperCase() + analytics.bestTimeOfDay.slice(1)}
            </div>
            <p className="text-sm text-muted-foreground">
              Планируй важные дела на этот день
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsCards;
