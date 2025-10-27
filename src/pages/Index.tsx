import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import EnergyCalendar from '@/components/EnergyCalendar';
import EnergyStats from '@/components/EnergyStats';
import EnergyTrends from '@/components/EnergyTrends';
import AddEntryDialog from '@/components/AddEntryDialog';
import AnimatedCard from '@/components/AnimatedCard';
import { useEnergyData } from '@/hooks/useEnergyData';
import { parseDate } from '@/utils/dateUtils';
import { calculateStats, filterEntriesByDays } from '@/utils/statsCalculator';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { motion } from 'framer-motion';

const Index = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [timePeriod, setTimePeriod] = useState<'3days' | 'week' | 'month' | 'year'>('week');
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
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
                  <p className="text-sm text-muted-foreground">Выгорание? Не сегодня</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => refetch()}
                  size="icon"
                  variant="outline"
                  className="sm:hidden"
                >
                  <Icon name="RefreshCw" size={20} />
                </Button>
                <Button 
                  onClick={() => refetch()}
                  size="lg"
                  variant="outline"
                  className="hidden sm:flex glass-effect hover:glass-card transition-all"
                >
                  <Icon name="RefreshCw" size={20} className="mr-2" />
                  Обновить
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
          <TabsList className="grid w-full grid-cols-4 mb-8 glass-card p-1 h-auto sm:h-14">
            <TabsTrigger 
              value="welcome" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-1 text-xs sm:text-sm"
            >
              <Icon name="Sparkles" size={18} className="sm:mr-0" />
              <span className="hidden sm:inline">Welcome</span>
            </TabsTrigger>
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
          
          <TabsContent value="welcome" className="animate-fade-in">
            <HeroGeometric 
              badge="Energy Tracking"
              title1="Твоя энергия"
              title2="под контролем"
            />
          </TabsContent>

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
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
                  <Button
                    variant={timePeriod === '3days' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimePeriod('3days')}
                    className={timePeriod === '3days' ? 'bg-primary' : ''}
                  >3 дня</Button>
                  <Button
                    variant={timePeriod === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimePeriod('week')}
                    className={timePeriod === 'week' ? 'bg-primary' : ''}
                  >Неделя</Button>
                  <Button
                    variant={timePeriod === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimePeriod('month')}
                    className={timePeriod === 'month' ? 'bg-primary' : ''}
                  >Месяц</Button>
                  <Button
                    variant={timePeriod === 'year' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimePeriod('year')}
                    className={timePeriod === 'year' ? 'bg-primary' : ''}
                  >Год</Button>
                </div>
                
                {/* Goal Progress */}
                {monthlyStats.total > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="glass-card mb-8 md:mb-10 border-l-4 border-l-primary glow-primary">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon name="Target" size={20} className="text-primary" />
                            <span className="font-medium">Цель на месяц</span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-heading font-bold text-primary">
                              {monthlyStats.average.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">из 4.0</div>
                          </div>
                        </div>
                        <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((monthlyStats.average / 4) * 100, 100)}%` }}
                            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-primary glow-primary"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          {monthlyStats.average >= 4 
                            ? '🎉 Цель достигнута!' 
                            : `Еще ${(4 - monthlyStats.average).toFixed(1)} до цели`
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                )}

                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                  <AnimatedCard delay={0.1} className="glass-card border-l-4 border-l-primary hover:glow-primary">
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

                  <AnimatedCard delay={0.2} className="glass-card border-l-4 border-l-accent hover:glow-accent">
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

                  <AnimatedCard delay={0.3} className="glass-card border-l-4 border-l-destructive">
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
              <AnimatedCard delay={0.4} className="glass-card mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} className="text-primary" />
                    Последние записи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentEntries.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Пока нет записей</p>
                  ) : (
                    <div className="space-y-3">
                      {recentEntries.map((entry, idx) => {
                        const colorClass = getColorClass(entry.score);
                        const isExpanded = expandedEntry === idx;
                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            onClick={() => setExpandedEntry(isExpanded ? null : idx)}
                            className={`flex items-center gap-4 p-4 rounded-xl glass-effect border-l-4 border-l-${colorClass} hover:glass-card transition-all cursor-pointer`}
                          >
                            <div className={`min-w-[3rem] w-12 h-12 rounded-xl bg-${colorClass} flex items-center justify-center text-background font-heading font-bold text-xl shadow-lg`}>
                              {entry.score}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{entry.date}</p>
                              <p className={`text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-1'}`}>{entry.thoughts}</p>
                            </div>
                            <Icon 
                              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                              size={20} 
                              className="text-muted-foreground flex-shrink-0"
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>
            )}

            {!isLoading && !error && (
              <EnergyCalendar data={data} isLoading={isLoading} />
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