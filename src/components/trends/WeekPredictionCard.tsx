import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WeekPredictionCardProps {
  weekPrediction: {
    probability: number;
    confidence: string;
    message: string;
    trend: string;
  };
}

const WeekPredictionCard = ({ weekPrediction }: WeekPredictionCardProps) => {
  return (
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
                  {weekPrediction.probability}%
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase">вероятность</span>
                  <span className="text-xs text-muted-foreground">
                    {weekPrediction.confidence === 'high' ? '🎯 Высокая точность' :
                     weekPrediction.confidence === 'medium' ? '📊 Средняя точность' :
                     '🔮 Низкая точность'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {weekPrediction.message}
              </p>
            </div>
            <div className="text-5xl">
              {weekPrediction.trend === 'up' ? '📈' :
               weekPrediction.trend === 'down' ? '📉' : '➡️'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekPredictionCard;
