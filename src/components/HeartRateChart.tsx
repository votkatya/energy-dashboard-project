import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';
import { parseDate, formatDateRu } from '@/utils/dateUtils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EnergyEntry {
  date: string;
  score: number;
}

interface HeartRateChartProps {
  entries: EnergyEntry[];
}

type PeriodType = 'week' | 'month' | 'year' | 'custom';

const HeartRateChart = ({ entries }: HeartRateChartProps) => {
  const [period, setPeriod] = useState<PeriodType>('month');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const filterEntriesByPeriod = () => {
    if (!entries || entries.length === 0) return [];

    const now = new Date();
    let filteredEntries = [...entries];

    switch (period) {
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter(e => parseDate(e.date) >= weekAgo);
        break;
      }
      case 'month': {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter(e => parseDate(e.date) >= monthAgo);
        break;
      }
      case 'year': {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter(e => parseDate(e.date) >= yearAgo);
        break;
      }
      case 'custom': {
        if (customDateRange.from && customDateRange.to) {
          filteredEntries = entries.filter(e => {
            const date = parseDate(e.date);
            return date >= customDateRange.from! && date <= customDateRange.to!;
          });
        }
        break;
      }
    }

    return filteredEntries
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .map(entry => ({
        date: formatDateRu(parseDate(entry.date)),
        score: entry.score,
        displayScore: entry.score * 20
      }));
  };

  const chartData = filterEntriesByPeriod();

  const stats = {
    min: chartData.length > 0 ? Math.min(...chartData.map(d => d.displayScore)) : 0,
    max: chartData.length > 0 ? Math.max(...chartData.map(d => d.displayScore)) : 0,
    avg: chartData.length > 0 
      ? Math.round((chartData.reduce((sum, d) => sum + d.displayScore, 0) / chartData.length)) 
      : 0
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={24} className="text-primary" />
            Диапазон частоты сердечных сокращений
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={period === 'week' ? 'default' : 'outline'}
              onClick={() => setPeriod('week')}
            >
              Неделя
            </Button>
            <Button
              size="sm"
              variant={period === 'month' ? 'default' : 'outline'}
              onClick={() => setPeriod('month')}
            >
              Месяц
            </Button>
            <Button
              size="sm"
              variant={period === 'year' ? 'default' : 'outline'}
              onClick={() => setPeriod('year')}
            >
              Год
            </Button>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant={period === 'custom' ? 'default' : 'outline'}
                  onClick={() => {
                    setPeriod('custom');
                    setShowCalendar(true);
                  }}
                >
                  <Icon name="Calendar" size={16} className="mr-1" />
                  Свой период
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{
                    from: customDateRange.from,
                    to: customDateRange.to
                  }}
                  onSelect={(range) => {
                    setCustomDateRange({
                      from: range?.from,
                      to: range?.to
                    });
                    if (range?.from && range?.to) {
                      setPeriod('custom');
                      setShowCalendar(false);
                    }
                  }}
                  locale={ru}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {period === 'custom' && customDateRange.from && customDateRange.to && (
          <p className="text-sm text-muted-foreground mt-2">
            {format(customDateRange.from, 'd MMM yyyy', { locale: ru })} — {format(customDateRange.to, 'd MMM yyyy', { locale: ru })}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="text-xs text-muted-foreground mb-1">Минимум</div>
            <div className="text-2xl font-bold">{stats.min}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <div className="text-xs text-muted-foreground mb-1">Среднее</div>
            <div className="text-2xl font-bold text-primary">{stats.avg}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="text-xs text-muted-foreground mb-1">Максимум</div>
            <div className="text-2xl font-bold">{stats.max}</div>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Нет данных за выбранный период</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                formatter={(value: number) => [`${value}`, 'Пульс']}
              />
              <Area 
                type="monotone" 
                dataKey="displayScore" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default HeartRateChart;
