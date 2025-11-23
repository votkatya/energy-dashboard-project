import { useState, useMemo, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddEntryDialog from '@/components/AddEntryDialog';
import NotificationsDialog from '@/components/NotificationsDialog';
import BottomNav from '@/components/BottomNav';
import { useEnergyData } from '@/hooks/useEnergyData';
import { useAuth } from '@/contexts/AuthContext';
import { parseDate } from '@/utils/dateUtils';
import { calculateStats, filterEntriesByDays } from '@/utils/statsCalculator';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import { analyzeBurnoutRisk, predictNextWeek } from '@/utils/predictiveAnalytics';
import html2canvas from 'html2canvas';
import { getPlatform, getTelegramWebApp } from '@/utils/platformDetector';
import HomePage from './components/HomePage';
import StatsPage from './components/StatsPage';
import TrendsPage from './components/TrendsPage';
import SettingsPage from './components/SettingsPage';

const Index = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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

  const exportDataToCSV = async () => {
    if (!data?.entries || data.entries.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const headers = ['Дата', 'Энергия', 'Теги', 'Мысли'];
    const rows = data.entries.map((entry: any) => {
      const date = entry.date || '';
      const energy = entry.score || '';
      const tags = entry.tags ? entry.tags.join(', ') : '';
      const thoughts = entry.thoughts ? entry.thoughts.replace(/"/g, '""') : '';
      
      return `"${date}","${energy}","${tags}","${thoughts}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const platform = getPlatform();
    
    if (platform === 'telegram') {
      const tg = getTelegramWebApp();
      
      try {
        await navigator.clipboard.writeText(csvContent);
        
        if (tg?.showPopup) {
          tg.showPopup({
            title: 'Данные скопированы!',
            message: 'CSV данные скопированы в буфер обмена. Вставьте их в любой текстовый редактор или Google Sheets',
            buttons: [{ type: 'ok' }]
          });
        } else {
          alert('Данные скопированы в буфер обмена! Вставьте их в любой текстовый редактор или Google Sheets');
        }
        return;
      } catch (error) {
        console.error('Ошибка копирования:', error);
      }
    }
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `flowkat-data-${new Date().toISOString().split('T')[0]}.csv`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%)',
          filter: 'blur(40px)'
        }}
      />
      
      <HeroGeometric className="absolute top-10 right-10 w-32 h-32 opacity-20" />
      <HeroGeometric className="absolute bottom-20 left-5 w-24 h-24 opacity-15" />
      
      <div className="container max-w-2xl mx-auto px-4 pt-8 pb-24 relative z-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            FlowKat
          </h1>
          <p className="text-muted-foreground">Отслеживайте свою энергию</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="home">Главная</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
            <TabsTrigger value="trends">Тренды</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0">
            <HomePage
              homeView={homeView}
              setHomeView={setHomeView}
              setShowAddDialog={setShowAddDialog}
              data={data}
              isLoading={isLoading}
              error={error}
              refetch={refetch}
              monthlyStats={monthlyStats}
              recentEntries={recentEntries}
              allTimeStats={allTimeStats}
              user={user}
              getColorClass={getColorClass}
              burnoutRisk={burnoutRisk}
              weekForecast={weekForecast}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <StatsPage
              timePeriod={timePeriod}
              setTimePeriod={setTimePeriod}
              stats={stats}
              data={data}
              isLoading={isLoading}
              error={error}
              statsRef={statsRef}
              exportStatsAsImage={exportStatsAsImage}
            />
          </TabsContent>

          <TabsContent value="trends" className="mt-0">
            <TrendsPage data={data} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsPage
              showHelpDialog={showHelpDialog}
              setShowHelpDialog={setShowHelpDialog}
              showLogoutDialog={showLogoutDialog}
              setShowLogoutDialog={setShowLogoutDialog}
              isEditingName={isEditingName}
              setIsEditingName={setIsEditingName}
              userName={userName}
              setUserName={setUserName}
              isEditingPassword={isEditingPassword}
              setIsEditingPassword={setIsEditingPassword}
              oldPassword={oldPassword}
              setOldPassword={setOldPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              exportedImage={exportedImage}
              setExportedImage={setExportedImage}
              user={user}
              logout={logout}
              exportDataToCSV={exportDataToCSV}
            />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setShowAddDialog(true)}
        onNotificationClick={() => setShowNotificationsDialog(true)}
      />

      <AddEntryDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          refetch();
          setShowAddDialog(false);
        }}
      />

      <NotificationsDialog
        open={showNotificationsDialog}
        onOpenChange={setShowNotificationsDialog}
      />
    </div>
  );
};

export default Index;
