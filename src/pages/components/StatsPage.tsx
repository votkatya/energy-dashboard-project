import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import EnergyStats from '@/components/EnergyStats';
import EnergyTrends from '@/components/EnergyTrends';
import EnergyChart from '@/components/EnergyChart';
import AnimatedCard from '@/components/AnimatedCard';

interface StatsPageProps {
  timePeriod: 'week' | 'month' | 'year';
  setTimePeriod: (period: 'week' | 'month' | 'year') => void;
  stats: any;
  data: any;
  isLoading: boolean;
  error: any;
  statsRef: React.RefObject<HTMLDivElement>;
  exportStatsAsImage: () => void;
}

const StatsPage = ({
  timePeriod,
  setTimePeriod,
  stats,
  data,
  isLoading,
  error,
  statsRef,
  exportStatsAsImage
}: StatsPageProps) => {
  const getPeriodLabel = () => {
    switch (timePeriod) {
      case 'week': return 'Неделя';
      case 'month': return 'Месяц';
      case 'year': return 'Год';
      default: return 'Неделя';
    }
  };

  return (
    <>
      <AnimatedCard delay={0.1}>
        <div className="flex flex-col gap-3 mb-6">
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={timePeriod === 'week' ? 'default' : 'outline'}
              onClick={() => setTimePeriod('week')}
              className="w-full"
            >
              Неделя
            </Button>
            <Button 
              variant={timePeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setTimePeriod('month')}
              className="w-full"
            >
              Месяц
            </Button>
            <Button 
              variant={timePeriod === 'year' ? 'default' : 'outline'}
              onClick={() => setTimePeriod('year')}
              className="w-full"
            >
              Год
            </Button>
          </div>

          <Button
            onClick={exportStatsAsImage}
            variant="outline"
            className="w-full gap-2"
          >
            <Icon name="Download" size={18} />
            Экспорт статистики
          </Button>
        </div>
      </AnimatedCard>

      <div ref={statsRef} className="space-y-6">
        <AnimatedCard delay={0.15}>
          <Card className="card-hover energy-card shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="BarChart3" className="text-primary" size={24} />
                Статистика ({getPeriodLabel()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyStats stats={stats} />
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <Card className="card-hover energy-card shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" className="text-primary" size={24} />
                График энергии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyChart 
                entries={data?.entries || []}
                timePeriod={timePeriod}
                isLoading={isLoading}
                error={error}
              />
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.25}>
          <Card className="card-hover energy-card shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Activity" className="text-primary" size={24} />
                Динамика энергии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyTrends 
                entries={data?.entries || []}
                isLoading={isLoading}
                error={error}
              />
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </>
  );
};

export default StatsPage;
