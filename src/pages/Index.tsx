import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import EnergyCalendar from '@/components/EnergyCalendar';
import EntriesFeed from '@/components/EntriesFeed';
import EnergyStats from '@/components/EnergyStats';
import EnergyTrends from '@/components/EnergyTrends';
import EnergyChart from '@/components/EnergyChart';
import AddEntryDialog from '@/components/AddEntryDialog';
import NotificationsDialog from '@/components/NotificationsDialog';
import AnimatedCard from '@/components/AnimatedCard';
import MonthlyGoalCard from '@/components/MonthlyGoalCard';
import EnergyLevelCard from '@/components/EnergyLevelCard';
import PersonalRecommendationsCard from '@/components/PersonalRecommendationsCard';
import RiskAndForecastCards from '@/components/RiskAndForecastCards';
import EnergyTrendOverview from '@/components/trends/EnergyTrendOverview';
import TagInfluenceCard from '@/components/trends/TagInfluenceCard';
import BottomNav from '@/components/BottomNav';
import { useEnergyData } from '@/hooks/useEnergyData';
import { useAuth } from '@/contexts/AuthContext';
import { parseDate } from '@/utils/dateUtils';
import { calculateStats, filterEntriesByDays } from '@/utils/statsCalculator';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import { analyzeBurnoutRisk, predictNextWeek } from '@/utils/predictiveAnalytics';
import { useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';

const Index = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [homeView, setHomeView] = useState<'calendar' | 'feed'>('calendar');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('week');
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [exportedImage, setExportedImage] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { data, isLoading, error, refetch } = useEnergyData();
  const statsRef = useRef<HTMLDivElement>(null);

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
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const monthlyEntries = data.entries.filter((entry: any) => {
      const entryDate = parseDate(entry.date);
      if (!entryDate) return false;
      return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth;
    });
    
    const stats = calculateStats(monthlyEntries);
    
    return { average: stats.average, total: stats.total };
  };
  
  const monthlyStats = getMonthlyStats();
  const recentEntries = data?.entries?.slice(-3).reverse() || [];
  const allTimeStats = data?.entries ? calculateStats(data.entries) : { average: 0, total: 0 };

  const burnoutRisk = useMemo(() => {
    if (!data?.entries || data.entries.length === 0) return null;
    return analyzeBurnoutRisk(data.entries);
  }, [data]);

  const weekForecast = useMemo(() => {
    if (!data?.entries || data.entries.length === 0) return null;
    return predictNextWeek(data.entries);
  }, [data]);

  const exportStatsAsImage = async () => {
    if (!statsRef.current) return;

    try {
      const canvas = await html2canvas(statsRef.current, {
        backgroundColor: '#09090b',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imageUrl = canvas.toDataURL('image/png');
      
      if (navigator.share && window.innerWidth <= 768) {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], `flowkat-stats-${new Date().toISOString().split('T')[0]}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'FlowKat Статистика',
          text: 'Моя статистика энергии за период',
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.download = `flowkat-stats-${new Date().toISOString().split('T')[0]}.png`;
        link.href = imageUrl;
        link.click();
      }
    } catch (error) {
      console.error('Ошибка при экспорте статистики:', error);
      const imageUrl = statsRef.current ? (await html2canvas(statsRef.current, {
        backgroundColor: '#09090b',
        scale: 2,
        logging: false,
        useCORS: true
      })).toDataURL('image/png') : '';
      if (imageUrl) setExportedImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/files/3188cac1-53b5-4861-895e-61eb74f74569.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
                  alt="FlowKat Logo"
                  className="w-6 h-6 sm:w-7 sm:h-7"
                />
                <div>
                  <h1 className="text-lg sm:text-xl font-heading font-extrabold text-primary" style={{ letterSpacing: '0.02em' }}>FlowKat</h1>
                </div>
              </div>
              <div className="flex gap-2">
                <NotificationsDialog />
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  size="lg"
                  className="hidden sm:flex"
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить запись
                </Button>
              </div>
            </div>
            {activeTab === 'home' && (
              <Button 
                onClick={() => setShowAddDialog(true)}
                size="lg"
                className="sm:hidden w-full"
              >
                Как ты сегодня?
              </Button>
            )}
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pb-20">
          <TabsList className="hidden sm:grid w-full grid-cols-4 mb-8 glass-card p-1 h-14">
            <TabsTrigger 
              value="home" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Icon name="BarChart3" size={18} className="mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger 
              value="trends"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Icon name="Activity" size={18} className="mr-2" />
              Тренды
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
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

                <div className="mb-8">
                  <EnergyLevelCard 
                    averageScore={allTimeStats.average}
                    monthlyAverage={monthlyStats.average}
                    onTrendsClick={() => setActiveTab('trends')}
                  />
                </div>

                <div className="flex justify-center mb-6">
                  <div className="inline-flex bg-secondary/30 rounded-full p-1 gap-1">
                    <button
                      onClick={() => setHomeView('calendar')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        homeView === 'calendar' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >Календарь</button>
                    <button
                      onClick={() => setHomeView('feed')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        homeView === 'feed' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >Записи</button>
                  </div>
                </div>

                {homeView === 'calendar' ? (
                  <EnergyCalendar data={data} isLoading={isLoading} />
                ) : (
                  <EntriesFeed entries={data?.entries || []} />
                )}
              </>
            )}


          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in space-y-6">
            <div ref={statsRef} className="space-y-6">
              {data?.entries && data.entries.length > 0 && (
                <EnergyChart entries={data.entries} />
              )}
              <EnergyStats data={data} isLoading={isLoading} />
            </div>
            <div className="mt-6">
              <Button
                onClick={exportStatsAsImage}
                variant="default"
                size="lg"
                className="w-full gap-2"
              >
                <Icon name="Share2" size={20} />
                Поделиться статистикой
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="animate-fade-in space-y-6">
            <PersonalRecommendationsCard />
            <EnergyTrendOverview entries={data?.entries || []} />
            <TagInfluenceCard entries={data?.entries || []} />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="User" size={24} />
                    Профиль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Имя</Label>
                      {!isEditingName ? (
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            value={userName || 'Имя не задано'}
                            disabled
                            className="flex-1"
                          />
                          <Button
                            onClick={() => setIsEditingName(true)}
                            variant="outline"
                            size="icon"
                          >
                            <Icon name="Pencil" size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 mt-2">
                          <Input
                            id="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Введите имя"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setIsEditingName(false);
                              }}
                              size="sm"
                              className="flex-1"
                            >
                              Сохранить
                            </Button>
                            <Button
                              onClick={() => {
                                setUserName('');
                                setIsEditingName(false);
                              }}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium">Пароль</Label>
                      {!isEditingPassword ? (
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            value="••••••••"
                            disabled
                            type="password"
                            className="flex-1"
                          />
                          <Button
                            onClick={() => setIsEditingPassword(true)}
                            variant="outline"
                            size="icon"
                          >
                            <Icon name="Pencil" size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 mt-2">
                          <div>
                            <Label htmlFor="oldPassword" className="text-xs text-muted-foreground">Текущий пароль</Label>
                            <Input
                              id="oldPassword"
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Введите текущий пароль"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newPassword" className="text-xs text-muted-foreground">Новый пароль</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Введите новый пароль"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">Подтвердите пароль</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Повторите новый пароль"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                if (newPassword !== confirmPassword) {
                                  alert('Пароли не совпадают');
                                  return;
                                }
                                setIsEditingPassword(false);
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                              }}
                              size="sm"
                              className="flex-1"
                            >
                              Сохранить
                            </Button>
                            <Button
                              onClick={() => {
                                setIsEditingPassword(false);
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                              }}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Info" size={24} />
                    О приложении
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">FlowKat</strong> — персональный трекер энергии и настроения</p>
                  <p>Версия: 1.0.0</p>
                  <p>Всего записей: {data?.entries?.length || 0}</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Icon name="LogOut" size={24} />
                    Выход из аккаунта
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Вы уверены, что хотите выйти? Все несохраненные данные будут потеряны.
                  </p>
                  <Button 
                    onClick={logout}
                    variant="destructive"
                    size="lg"
                    className="w-full"
                  >
                    <Icon name="LogOut" size={20} className="mr-2" />
                    Выйти
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddEntryDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      
      {exportedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExportedImage(null)}
        >
          <div className="relative max-w-2xl w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-foreground hover:bg-secondary"
              onClick={() => setExportedImage(null)}
            >
              <Icon name="X" size={24} />
            </Button>
            <div className="bg-card rounded-lg p-4 space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Долгое нажатие на изображение → Сохранить
              </p>
              <img 
                src={exportedImage} 
                alt="Статистика FlowKat" 
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="sm:hidden">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;