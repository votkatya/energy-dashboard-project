import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import EnergyCalendar from '@/components/EnergyCalendar';
import EntriesFeed from '@/components/EntriesFeed';
import AnimatedCard from '@/components/AnimatedCard';
import MonthlyGoalCard from '@/components/MonthlyGoalCard';
import { motion } from 'framer-motion';
import type { EnergyEntry } from '@/types/energy';

interface HomeTabProps {
  isLoading: boolean;
  error: any;
  burnoutRisk: any;
  homeView: 'calendar' | 'feed';
  onViewChange: (view: 'calendar' | 'feed') => void;
  data: { entries: EnergyEntry[] } | undefined;
  recentEntries: EnergyEntry[];
  monthlyStats: { average: number; total: number };
  getColorClass: (score: number) => string;
}

const HomeTab = ({
  isLoading,
  error,
  burnoutRisk,
  homeView,
  onViewChange,
  data,
  recentEntries,
  monthlyStats,
  getColorClass
}: HomeTabProps) => {
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={32} className="animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Card className="shadow-lg border-l-4 border-l-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={24} className="text-destructive" />
              <div>
                <p className="font-medium">Не удалось загрузить данные</p>
                <p className="text-sm text-muted-foreground mt-1">Проверь, что Google таблица доступна по ссылке</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <>
          {burnoutRisk && (burnoutRisk.level === 'medium' || burnoutRisk.level === 'high' || burnoutRisk.level === 'critical') && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card 
                className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  burnoutRisk.level === 'critical' 
                    ? 'bg-gradient-to-r from-destructive/20 to-destructive/5 border-destructive/40' 
                    : burnoutRisk.level === 'high'
                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/5 border-orange-500/40'
                    : 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/40'
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon 
                      name="AlertTriangle" 
                      className={
                        burnoutRisk.level === 'critical' 
                          ? 'text-destructive' 
                          : burnoutRisk.level === 'high'
                          ? 'text-orange-500'
                          : 'text-yellow-500'
                      } 
                      size={24} 
                    />
                    {burnoutRisk.level === 'critical' && 'Критический риск выгорания'}
                    {burnoutRisk.level === 'high' && 'Высокий риск выгорания'}
                    {burnoutRisk.level === 'medium' && 'Средний риск выгорания'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{burnoutRisk.recommendation}</p>
                  {burnoutRisk.insights && burnoutRisk.insights.length > 0 && (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {burnoutRisk.insights.map((insight: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MonthlyGoalCard 
              currentAverage={monthlyStats.average}
              totalEntries={monthlyStats.total}
            />
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} />
                  Последние записи
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentEntries.length > 0 ? (
                  <div className="space-y-3">
                    {recentEntries.map((entry, index) => (
                      <AnimatedCard
                        key={entry.date}
                        delay={index * 0.1}
                        className={`p-4 rounded-xl ${getColorClass(entry.energy)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{entry.date}</p>
                            {entry.note && (
                              <p className="text-xs text-muted-foreground mt-1">{entry.note}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="Zap" size={16} />
                            <span className="font-bold">{entry.energy}</span>
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Calendar" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Пока нет записей</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Мои записи</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={homeView === 'calendar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewChange('calendar')}
                  >
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Календарь
                  </Button>
                  <Button
                    variant={homeView === 'feed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewChange('feed')}
                  >
                    <Icon name="List" size={16} className="mr-2" />
                    Лента
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {homeView === 'calendar' ? (
                <EnergyCalendar data={data} />
              ) : (
                <EntriesFeed data={data} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default HomeTab;
