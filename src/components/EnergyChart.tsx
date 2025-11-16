import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EnergyEntry {
  date: string;
  score: number;
}

interface EnergyChartProps {
  entries: EnergyEntry[];
}

type PeriodType = 'week' | 'month' | 'year' | 'custom';

const EnergyChart = ({ entries }: EnergyChartProps) => {
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
        date: format(parseDate(entry.date), 'dd.MM', { locale: ru }),
        score: entry.score
      }));
  };

  const calculateTrendLine = (data: { date: string; score: number }[]) => {
    if (data.length < 2) return data;

    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + d.score, 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * d.score, 0);
    const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((d, i) => ({
      ...d,
      trend: slope * i + intercept
    }));
  };

  const chartData = calculateTrendLine(filterEntriesByPeriod());

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col gap-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">График энергии</CardTitle>
          
          <div className="hidden sm:flex flex-wrap gap-2">
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
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCalendar(!showCalendar);
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

          <div className="flex sm:hidden w-full gap-2">
            <Button
              size="sm"
              variant={period === 'week' ? 'default' : 'outline'}
              onClick={() => setPeriod('week')}
              className="flex-1"
            >
              Неделя
            </Button>
            <Button
              size="sm"
              variant={period === 'month' ? 'default' : 'outline'}
              onClick={() => setPeriod('month')}
              className="flex-1"
            >
              Месяц
            </Button>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant={period === 'custom' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCalendar(!showCalendar);
                  }}
                >
                  <Icon name="Calendar" size={16} />
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
      <CardContent className="px-2 sm:px-6">
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Нет данных за выбранный период</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 300}>
            <AreaChart data={chartData} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                  <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0}
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [value, 'Оценка']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area 
                type="natural" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fill="url(#colorGradient)"
                animationDuration={800}
                dot={false}
              />
              <Line
                type="natural"
                dataKey="trend"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyChart;