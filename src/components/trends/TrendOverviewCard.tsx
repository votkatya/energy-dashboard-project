import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface TrendOverviewCardProps {
  analytics: {
    currentMonthAvg: number;
    previousMonthAvg: number;
    goodPercent: number;
    neutralPercent: number;
    badPercent: number;
  };
}

const TrendOverviewCard = ({ analytics }: TrendOverviewCardProps) => {
  return (
    <Card className="shadow-lg border-l-4 border-l-energy-excellent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="TrendingUp" size={24} className="text-energy-excellent" />
          Общий тренд
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-gradient-to-r from-energy-excellent/20 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Средний балл за месяц</span>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-4xl font-heading font-bold text-energy-excellent">
              {analytics.currentMonthAvg || '—'}
            </div>
            {analytics.previousMonthAvg > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {analytics.currentMonthAvg > analytics.previousMonthAvg ? '+' : ''}
                {(analytics.currentMonthAvg - analytics.previousMonthAvg).toFixed(1)} по сравнению с прошлым месяцем
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-energy-excellent/10 to-transparent border border-energy-excellent/30">
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 mb-1">
                <span className="text-lg md:text-xl">😊</span>
                <div className="text-xl md:text-2xl font-heading font-bold text-energy-excellent">
                  {analytics.goodPercent}%
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">Хорошие</p>
            </div>
            <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-energy-neutral/10 to-transparent border border-energy-neutral/30">
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 mb-1">
                <span className="text-lg md:text-xl">😐</span>
                <div className="text-xl md:text-2xl font-heading font-bold text-energy-neutral">
                  {analytics.neutralPercent}%
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">Средние</p>
            </div>
            <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-energy-low/10 to-transparent border border-energy-low/30">
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 mb-1">
                <span className="text-lg md:text-xl">😔</span>
                <div className="text-xl md:text-2xl font-heading font-bold text-energy-low">
                  {analytics.badPercent}%
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">Плохие</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendOverviewCard;
