import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import EnergyCalendar from '@/components/EnergyCalendar';
import EnergyStats from '@/components/EnergyStats';
import EnergyCharts from '@/components/EnergyCharts';
import EnergyTrends from '@/components/EnergyTrends';
import AddEntryDialog from '@/components/AddEntryDialog';

const Index = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-energy-excellent to-energy-good flex items-center justify-center shadow-lg">
                <Icon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Energy Tracker</h1>
                <p className="text-sm text-muted-foreground">Отслеживай свою энергию каждый день</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить запись
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-card shadow-md p-1 h-14">
            <TabsTrigger 
              value="home" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
            >
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
            >
              <Icon name="Calendar" size={18} className="mr-2" />
              Календарь
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
            >
              <Icon name="BarChart3" size={18} className="mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger 
              value="charts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
            >
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Графики
            </TabsTrigger>
            <TabsTrigger 
              value="trends"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
            >
              <Icon name="Activity" size={18} className="mr-2" />
              Тренды
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg hover:shadow-xl transition-all border-l-4 border-l-energy-excellent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-energy-excellent" />
                    Хорошие дни
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading font-bold text-energy-excellent">12</div>
                  <p className="text-sm text-muted-foreground mt-1">В этом месяце</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all border-l-4 border-l-energy-neutral">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Minus" size={20} className="text-energy-neutral" />
                    Нейтральные
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading font-bold text-energy-neutral">4</div>
                  <p className="text-sm text-muted-foreground mt-1">В этом месяце</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-all border-l-4 border-l-energy-low">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="TrendingDown" size={20} className="text-energy-low" />
                    Плохие дни
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading font-bold text-energy-low">1</div>
                  <p className="text-sm text-muted-foreground mt-1">В этом месяце</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Последние записи
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '22.10.2025', score: 5, category: 'Хороший', mood: 'день был классный', color: 'energy-excellent' },
                    { date: '21.10.2025', score: 4, category: 'Хороший', mood: 'утром гулять не ходила', color: 'energy-good' },
                    { date: '20.10.2025', score: 2, category: 'Плохой', mood: 'сложный был понедельник', color: 'energy-low' }
                  ].map((entry, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-${entry.color}/10 to-transparent border-l-4 border-l-${entry.color} hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-${entry.color} flex items-center justify-center text-white font-heading font-bold text-xl shadow-md`}>
                          {entry.score}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{entry.date}</p>
                          <p className="text-sm text-muted-foreground">{entry.mood}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${entry.color}/20 text-${entry.color}`}>
                        {entry.category}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="animate-fade-in">
            <EnergyCalendar />
          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in">
            <EnergyStats />
          </TabsContent>

          <TabsContent value="charts" className="animate-fade-in">
            <EnergyCharts />
          </TabsContent>

          <TabsContent value="trends" className="animate-fade-in">
            <EnergyTrends />
          </TabsContent>
        </Tabs>
      </div>

      <AddEntryDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default Index;
