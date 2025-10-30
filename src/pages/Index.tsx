import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import EnergyCalendar from '@/components/EnergyCalendar';
import EntriesFeed from '@/components/EntriesFeed';
import EnergyStats from '@/components/EnergyStats';
import EnergyTrends from '@/components/EnergyTrends';
import AddEntryDialog from '@/components/AddEntryDialog';
import NotificationsDialog from '@/components/NotificationsDialog';
import AnimatedCard from '@/components/AnimatedCard';
import MonthlyGoalCard from '@/components/MonthlyGoalCard';
import { useEnergyData } from '@/hooks/useEnergyData';
import { useAuth } from '@/contexts/AuthContext';
import { parseDate } from '@/utils/dateUtils';
import { calculateStats, filterEntriesByDays } from '@/utils/statsCalculator';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import { analyzeBurnoutRisk } from '@/utils/predictiveAnalytics';
import { useMemo } from 'react';

const Index = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [homeView, setHomeView] = useState<'calendar' | 'feed'>('calendar');
  const [timePeriod, setTimePeriod] = useState<'3days' | 'week' | 'month' | 'year'>('week');
  const { user, logout } = useAuth();
  const { data, isLoading, error, refetch } = useEnergyData();

  const getColorClass = (score: number) => {
    if (score >= 5) return 'energy-excellent';
    if (score >= 4) return 'energy-good';
    if (score >= 3) return 'energy-neutral';
    if (score >= 2) return 'energy-medium-low';
    return 'energy-low';
  };



  const getFilteredStats = () => {
    if (!data?.entries) return { good: 0, neutral: 0, bad: 0, average: 0, total: 0 };
    
    let days: number;
    
    switch (timePeriod) {
      case '3days':
        days = 3;
        break;
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      default:
        days = 7;
    }
    
    const filtered = filterEntriesByDays(data.entries, days);
    return calculateStats(filtered);
  };

  const stats = getFilteredStats();
  
  const getMonthlyStats = () => {
    if (!data?.entries) return { average: 0, total: 0 };
    
    const monthlyEntries = filterEntriesByDays(data.entries, 30);
    const stats = calculateStats(monthlyEntries);
    
    return { average: stats.average, total: stats.total };
  };
  
  const monthlyStats = getMonthlyStats();
  const recentEntries = data?.entries?.slice(-3).reverse() || [];

  const burnoutRisk = useMemo(() => {
    if (!data?.entries || data.entries.length === 0) return null;
    return analyzeBurnoutRisk(data.entries);
  }, [data]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg glow-primary">
                  <Icon name="Zap" size={24} className="text-background" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">KatFlow</h1>
                  <p className="text-sm text-muted-foreground">Выгорание? Не сегодня!</p>
                </div>
              </div>
              <div className="flex gap-2">
                <NotificationsDialog />
                <Button 
                  onClick={logout}
                  size="icon"
                  variant="outline"
                  className="sm:hidden"
                >
                  <Icon name="LogOut" size={20} />
                </Button>
                <Button 
                  onClick={logout}
                  size="lg"
                  variant="outline"
                  className="hidden sm:flex glass-effect hover:glass-card transition-all"
                >
                  <Icon name="LogOut" size={20} className="mr-2" />
                  Выйти
                </Button>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  size="lg"
                  className="hidden sm:flex bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary transition-all shadow-lg hover:shadow-xl hover:glow-primary"
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить запись
                </Button>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddDialog(true)}
              size="lg"
              className="sm:hidden w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary transition-all shadow-lg hover:shadow-xl hover:glow-primary"
            >
              Как ты сегодня?
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 glass-card p-1 h-auto sm:h-14">
            <TabsTrigger 
              value="home" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-1 text-xs sm:text-sm"
            >
              <Icon name="Home" size={18} className="sm:mr-0" />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-1 text-xs sm:text-sm"
            >
              <Icon name="BarChart3" size={18} className="sm:mr-0" />
              <span className="hidden sm:inline">Статистика</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trends"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-1 text-xs sm:text-sm"
            >
              <Icon name="Activity" size={18} className="sm:mr-0" />
              <span className="hidden sm:inline">Тренды</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
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
                      onClick={() => setActiveTab('trends')}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Icon 
                              name="AlertTriangle" 
                              size={24} 
                              className={burnoutRisk.level === 'critical' ? 'text-destructive' : burnoutRisk.level === 'high' ? 'text-orange-500' : 'text-yellow-500'} 
                            />
                            <div>
                              <p className="font-semibold">Внимание: {burnoutRisk.level === 'critical' ? 'критический' : burnoutRisk.level === 'high' ? 'высокий' : 'средний'} риск выгорания</p>
                              <p className="text-sm text-muted-foreground">Нажми, чтобы узнать подробности</p>
                            </div>
                          </div>
                          <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <div className="mb-6 flex justify-center">
                  <div className="inline-flex bg-secondary/30 rounded-full p-1 gap-1">
                    <button
                      onClick={() => setTimePeriod('3days')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        timePeriod === '3days' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Сегодня
                    </button>
                    <button
                      onClick={() => setTimePeriod('week')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        timePeriod === 'week' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Неделя
                    </button>
                    <button
                      onClick={() => setTimePeriod('month')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        timePeriod === 'month' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Месяц
                    </button>
                    <button
                      onClick={() => setTimePeriod('year')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        timePeriod === 'year' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Год
                    </button>
                  </div>
                </div>
                
                <MonthlyGoalCard
                  currentAverage={monthlyStats.average}
                  totalEntries={monthlyStats.total}
                  currentYear={new Date().getFullYear()}
                  currentMonth={new Date().getMonth() + 1}
                />

                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                  <AnimatedCard delay={0.1} className="glass-card">
                    <CardHeader className="pb-3 md:pb-3 pt-4 md:pt-6 px-3 md:px-6">
                      <CardTitle className="text-sm md:text-lg flex flex-col md:flex-row items-center gap-1 md:gap-2">
                        <span className="text-xl md:text-2xl">😊</span>
                        <span className="hidden md:inline">Хорошие дни</span>
                        <span className="md:hidden text-xs">Хорошие</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center md:text-left pb-4 md:pb-6 px-3 md:px-6">
                      <div className="text-3xl md:text-4xl font-heading font-bold text-energy-excellent">{stats.good}</div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">Всего записей</p>
                    </CardContent>
                  </AnimatedCard>

                  <AnimatedCard delay={0.2} className="glass-card">
                    <CardHeader className="pb-3 md:pb-3 pt-4 md:pt-6 px-3 md:px-6">
                      <CardTitle className="text-sm md:text-lg flex flex-col md:flex-row items-center gap-1 md:gap-2">
                        <span className="text-xl md:text-2xl">😐</span>
                        <span className="hidden md:inline">Нейтральные</span>
                        <span className="md:hidden text-xs">Средние</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center md:text-left pb-4 md:pb-6 px-3 md:px-6">
                      <div className="text-3xl md:text-4xl font-heading font-bold text-energy-neutral">{stats.neutral}</div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">Всего записей</p>
                    </CardContent>
                  </AnimatedCard>

                  <AnimatedCard delay={0.3} className="glass-card">
                    <CardHeader className="pb-3 md:pb-3 pt-4 md:pt-6 px-3 md:px-6">
                      <CardTitle className="text-sm md:text-lg flex flex-col md:flex-row items-center gap-1 md:gap-2">
                        <span className="text-xl md:text-2xl">😔</span>
                        <span className="hidden md:inline">Плохие дни</span>
                        <span className="md:hidden text-xs">Плохие</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center md:text-left pb-4 md:pb-6 px-3 md:px-6">
                      <div className="text-3xl md:text-4xl font-heading font-bold text-energy-low">{stats.bad}</div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">Всего записей</p>
                    </CardContent>
                  </AnimatedCard>
                </div>
              </>
            )}

            {!isLoading && !error && (
              <>
                <div className="flex gap-2 mb-6 justify-center">
                  <Button
                    variant={homeView === 'calendar' ? 'default' : 'outline'}
                    onClick={() => setHomeView('calendar')}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Calendar" size={18} />
                    Календарь
                  </Button>
                  <Button
                    variant={homeView === 'feed' ? 'default' : 'outline'}
                    onClick={() => setHomeView('feed')}
                    className="flex items-center gap-2"
                  >
                    <Icon name="List" size={18} />
                    Лента
                  </Button>
                </div>

                {homeView === 'calendar' ? (
                  <EnergyCalendar data={data} isLoading={isLoading} />
                ) : (
                  <EntriesFeed entries={data?.entries || []} />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in">
            <EnergyStats data={data} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="trends" className="animate-fade-in">
            <EnergyTrends data={data} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>

      <AddEntryDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default Index;