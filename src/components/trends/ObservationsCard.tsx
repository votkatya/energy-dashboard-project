import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ObservationsCardProps {
  analytics: {
    bestDayOfWeek: string;
    worstDayOfWeek: string;
    trend: number;
  };
}

const ObservationsCard = ({ analytics }: ObservationsCardProps) => {
  return (
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

          <div className="p-4 rounded-xl bg-gradient-to-r from-destructive/10 to-transparent border-l-4 border-l-destructive">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-medium mb-1">Сложный день</p>
                <p className="text-sm text-muted-foreground">
                  {analytics.worstDayOfWeek.charAt(0).toUpperCase() + analytics.worstDayOfWeek.slice(1)} - твой самый энергозатратный день
                </p>
              </div>
            </div>
          </div>

          {analytics.trend !== 0 && (
            <div className={`p-4 rounded-xl bg-gradient-to-r ${
              analytics.trend > 0 
                ? 'from-energy-excellent/10 to-transparent border-l-4 border-l-energy-excellent' 
                : 'from-energy-low/10 to-transparent border-l-4 border-l-energy-low'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{analytics.trend > 0 ? '📈' : '📉'}</span>
                <div>
                  <p className="font-medium mb-1">
                    {analytics.trend > 0 ? 'Позитивная динамика' : 'Снижение энергии'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.trend > 0 
                      ? `За последние 3 месяца твой уровень энергии вырос на ${Math.abs(analytics.trend)}%` 
                      : `За последние 3 месяца твой уровень энергии снизился на ${Math.abs(analytics.trend)}%`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ObservationsCard;
