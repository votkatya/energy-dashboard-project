import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import EnergyCalendar from '@/components/EnergyCalendar';
import EntriesFeed from '@/components/EntriesFeed';
import AnimatedCard from '@/components/AnimatedCard';
import MonthlyGoalCard from '@/components/MonthlyGoalCard';
import EnergyLevelCard from '@/components/EnergyLevelCard';
import PersonalRecommendationsCard from '@/components/PersonalRecommendationsCard';
import RiskAndForecastCards from '@/components/RiskAndForecastCards';

interface HomePageProps {
  homeView: 'calendar' | 'feed';
  setHomeView: (view: 'calendar' | 'feed') => void;
  setShowAddDialog: (show: boolean) => void;
  data: any;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  monthlyStats: { average: number; total: number };
  recentEntries: any[];
  allTimeStats: { average: number; total: number };
  user: any;
  getColorClass: (score: number) => string;
  burnoutRisk: any;
  weekForecast: any;
}

const HomePage = ({
  homeView,
  setHomeView,
  setShowAddDialog,
  data,
  isLoading,
  error,
  refetch,
  monthlyStats,
  recentEntries,
  allTimeStats,
  user,
  getColorClass,
  burnoutRisk,
  weekForecast
}: HomePageProps) => {
  return (
    <>
      <div className="flex flex-col items-center gap-3 mb-6">
        <AnimatedCard delay={0.1}>
          <div className="w-full flex gap-2">
            <Button 
              variant={homeView === 'calendar' ? 'default' : 'outline'}
              className="flex-1 gap-2"
              onClick={() => setHomeView('calendar')}
            >
              <Icon name="Calendar" size={18} />
              Календарь
            </Button>
            <Button 
              variant={homeView === 'feed' ? 'default' : 'outline'}
              className="flex-1 gap-2"
              onClick={() => setHomeView('feed')}
            >
              <Icon name="List" size={18} />
              Лента
            </Button>
          </div>
        </AnimatedCard>
      </div>

      {homeView === 'calendar' ? (
        <AnimatedCard delay={0.15}>
          <Card className="mb-6 card-hover energy-card shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calendar" className="text-primary" size={24} />
                Календарь энергии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyCalendar 
                entries={data?.entries || []}
                onAddEntry={() => setShowAddDialog(true)}
                isLoading={isLoading}
                error={error}
                onRefetch={refetch}
              />
            </CardContent>
          </Card>
        </AnimatedCard>
      ) : (
        <>
          <AnimatedCard delay={0.15}>
            <Card className="mb-6 card-hover energy-card shadow-lg border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="List" className="text-primary" size={24} />
                  Последние записи
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EntriesFeed entries={recentEntries} />
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <Card className="mb-6 card-hover shadow-lg border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" className="text-primary" size={24} />
                  Обзор за все время
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getColorClass(allTimeStats.average)}`}>
                      {allTimeStats.average.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Средняя энергия</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {allTimeStats.total}
                    </div>
                    <div className="text-sm text-muted-foreground">Всего записей</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </>
      )}

      <div className="grid grid-cols-1 gap-4 mb-6">
        <AnimatedCard delay={0.2}>
          <MonthlyGoalCard
            currentAverage={monthlyStats.average}
            entriesCount={monthlyStats.total}
            userId={user?.id}
          />
        </AnimatedCard>

        <AnimatedCard delay={0.25}>
          <EnergyLevelCard
            averageScore={allTimeStats.average}
            monthlyAverage={monthlyStats.average}
            onTrendsClick={() => {}}
            hasData={monthlyStats.total > 0}
          />
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <PersonalRecommendationsCard 
            entries={data?.entries || []}
            entriesCount={data?.entries?.length || 0}
            userId={user?.id}
          />
        </AnimatedCard>

        <AnimatedCard delay={0.35}>
          <RiskAndForecastCards
            burnoutRisk={burnoutRisk}
            weekForecast={weekForecast}
            getColorClass={getColorClass}
          />
        </AnimatedCard>
      </div>
    </>
  );
};

export default HomePage;