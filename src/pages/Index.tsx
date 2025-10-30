import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import EnergyTrends from '@/components/EnergyTrends';
import AddEntryDialog from '@/components/AddEntryDialog';
import AppHeader from '@/components/AppHeader';
import HomeTab from '@/components/HomeTab';
import StatsTab from '@/components/StatsTab';
import SettingsTab from '@/components/SettingsTab';
import { useEnergyData } from '@/hooks/useEnergyData';
import { useAuth } from '@/contexts/AuthContext';
import { calculateStats, filterEntriesByDays } from '@/utils/statsCalculator';
import { analyzeBurnoutRisk } from '@/utils/predictiveAnalytics';

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
        <AppHeader 
          onAddClick={() => setShowAddDialog(true)}
          onSettingsClick={() => setActiveTab('settings')}
        />

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
            <HomeTab
              isLoading={isLoading}
              error={error}
              burnoutRisk={burnoutRisk}
              homeView={homeView}
              onViewChange={setHomeView}
              data={data}
              recentEntries={recentEntries}
              monthlyStats={monthlyStats}
              getColorClass={getColorClass}
            />
          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in">
            <StatsTab
              data={data}
              isLoading={isLoading}
              timePeriod={timePeriod}
              onTimePeriodChange={setTimePeriod}
            />
          </TabsContent>

          <TabsContent value="trends" className="animate-fade-in">
            <EnergyTrends data={data} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <SettingsTab
              user={user}
              logout={logout}
              totalEntries={data?.entries?.length || 0}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddEntryDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default Index;
