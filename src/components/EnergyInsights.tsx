import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { EnergyStats, getInsights } from '@/lib/statsUtils';

interface EnergyInsightsProps {
  stats: EnergyStats;
}

const EnergyInsights = ({ stats }: EnergyInsightsProps) => {
  const insights = getInsights(stats);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Lightbulb" size={20} />
          Инсайты
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {insight}
              </Badge>
            </div>
          ))}
          
          {stats.streak > 0 && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Flame" size={16} className="text-primary" />
                <span className="text-sm font-medium">
                  Серия хороших дней: {stats.streak}
                </span>
              </div>
            </div>
          )}
          
          {stats.trend !== 'stable' && (
            <div className="mt-2 p-3 bg-secondary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon 
                  name={stats.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                  className={stats.trend === 'up' ? 'text-green-500' : 'text-red-500'} 
                />
                <span className="text-sm">
                  Тренд: {stats.trend === 'up' ? 'Растёт' : 'Снижается'}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyInsights;
