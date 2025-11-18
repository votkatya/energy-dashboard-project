import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import Icon from '@/components/ui/icon';
import { parseDate } from '@/utils/dateUtils';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addWeeks, addMonths, addYears, addDays, eachDayOfInterval } from 'date-fns';
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
  const [period, setPeriod] = useState<PeriodType>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [yearOffset, setYearOffset] = useState(0);
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const getCurrentPeriodDates = () => {
    const now = new Date();
    let start: Date, end: Date;

    switch (period) {
      case 'week': {
        const targetDate = addWeeks(now, weekOffset);
        start = startOfWeek(targetDate, { locale: ru });
        end = endOfWeek(targetDate, { locale: ru });
        break;
      }
      case 'month': {
        const targetDate = addMonths(now, monthOffset);
        start = startOfMonth(targetDate);
        end = endOfMonth(targetDate);
        break;
      }
      case 'year': {
        const targetDate = addYears(now, yearOffset);
        start = startOfYear(targetDate);
        end = endOfYear(targetDate);
        break;
      }
      case 'custom': {
        if (customDateRange.from && customDateRange.to) {
          start = customDateRange.from;
          end = customDateRange.to;
        } else {
          start = now;
          end = now;
        }
        break;
      }
      default: {
        start = now;
        end = now;
      }
    }

    return { start, end };
  };

  const filterEntriesByPeriod = () => {
    const { start, end } = getCurrentPeriodDates();

    if (period === 'week') {
      const allDays = eachDayOfInterval({ start, end });
      const entriesMap = new Map();
      
      if (entries && entries.length > 0) {
        entries.forEach(e => {
          const date = parseDate(e.date);
          if (date >= start && date <= end) {
            const key = format(date, 'dd.MM', { locale: ru });
            entriesMap.set(key, e.score);
          }
        });
      }

      return allDays.map(day => {
        const key = format(day, 'dd.MM', { locale: ru });
        return {
          date: key,
          score: entriesMap.get(key) || null
        };
      });
    }

    if (period === 'month') {
      const keyDays = [1, 8, 15, 22, 29];
      const monthDate = start;
      const entriesMap = new Map();
      
      if (entries && entries.length > 0) {
        entries.forEach(e => {
          const date = parseDate(e.date);
          if (date >= start && date <= end) {
            const key = format(date, 'dd.MM', { locale: ru });
            entriesMap.set(key, e.score);
          }
        });
      }

      return keyDays.map(day => {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const key = format(date, 'dd.MM', { locale: ru });
        return {
          date: key,
          score: entriesMap.get(key) || null
        };
      });
    }

    if (period === 'year') {
      const yearDate = start;
      const entriesMap = new Map();
      
      if (entries && entries.length > 0) {
        entries.forEach(e => {
          const date = parseDate(e.date);
          if (date >= start && date <= end) {
            const monthNum = date.getMonth() + 1;
            const existing = entriesMap.get(monthNum);
            if (!existing) {
              entriesMap.set(monthNum, []);
            }
            entriesMap.get(monthNum).push(e.score);
          }
        });
      }

      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(monthNum => {
        const scores = entriesMap.get(monthNum);
        let avgScore = null;
        if (scores && scores.length > 0) {
          avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        }
        return {
          date: String(monthNum),
          score: avgScore
        };
      });
    }

    if (!entries || entries.length === 0) return [];

    const filteredEntries = entries.filter(e => {
      const date = parseDate(e.date);
      return date >= start && date <= end;
    });

    return filteredEntries
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .map(entry => ({
        date: format(parseDate(entry.date), 'dd.MM', { locale: ru }),
        score: entry.score
      }));
  };

  const getPeriodLabel = () => {
    const { start, end } = getCurrentPeriodDates();
    
    switch (period) {
      case 'week':
        return `${format(start, 'd', { locale: ru })} — ${format(end, 'd MMMM yyyy', { locale: ru })}`;
      case 'month':
        return format(start, 'LLLL yyyy', { locale: ru });
      case 'year':
        return format(start, 'yyyy', { locale: ru });
      case 'custom':
        if (customDateRange.from && customDateRange.to) {
          return `${format(customDateRange.from, 'd MMM yyyy', { locale: ru })} — ${format(customDateRange.to, 'd MMM yyyy', { locale: ru })}`;
        }
        return 'Выберите период';
      default:
        return '';
    }
  };

  const handlePrevious = () => {
    switch (period) {
      case 'week':
        setWeekOffset(weekOffset - 1);
        break;
      case 'month':
        setMonthOffset(monthOffset - 1);
        break;
      case 'year':
        setYearOffset(yearOffset - 1);
        break;
    }
  };

  const handleNext = () => {
    switch (period) {
      case 'week':
        setWeekOffset(weekOffset + 1);
        break;
      case 'month':
        setMonthOffset(monthOffset + 1);
        break;
      case 'year':
        setYearOffset(yearOffset + 1);
        break;
    }
  };

  const isCurrentPeriod = () => {
    switch (period) {
      case 'week':
        return weekOffset === 0;
      case 'month':
        return monthOffset === 0;
      case 'year':
        return yearOffset === 0;
      default:
        return false;
    }
  };

  const calculateTrendLine = (data: { date: string; score: number | null }[]) => {
    const validData = data.filter(d => d.score !== null);
    if (validData.length < 2) return data;

    const n = validData.length;
    const sumX = validData.reduce((sum, _, i) => sum + i, 0);
    const sumY = validData.reduce((sum, d) => sum + (d.score || 0), 0);
    const sumXY = validData.reduce((sum, d, i) => sum + i * (d.score || 0), 0);
    const sumX2 = validData.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    let validIndex = 0;
    return data.map((d) => {
      if (d.score !== null) {
        const trend = slope * validIndex + intercept;
        validIndex++;
        return { ...d, trend };
      }
      return { ...d, trend: undefined };
    });
  };

  const chartData = calculateTrendLine(filterEntriesByPeriod());

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col gap-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">График энергии</CardTitle>
          
          <div className="inline-flex bg-secondary/30 rounded-full p-1 gap-1 w-full">
            <button
              onClick={() => {
                setPeriod('week');
                setWeekOffset(0);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center justify-center flex-1 ${
                period === 'week' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Неделя
            </button>
            <button
              onClick={() => {
                setPeriod('month');
                setMonthOffset(0);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center justify-center flex-1 ${
                period === 'month' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Месяц
            </button>
            <button
              onClick={() => {
                setPeriod('year');
                setYearOffset(0);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center justify-center flex-1 ${
                period === 'year' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Год
            </button>
          </div>

          {period !== 'custom' && (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="h-8 w-8"
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              
              <div className="text-center flex-1">
                <p className="text-sm font-medium">{getPeriodLabel()}</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={isCurrentPeriod()}
                className="h-8 w-8"
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {chartData.length === 0 || chartData.every(d => d.score === null) ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Нет данных за выбранный период</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 300}>
            <AreaChart data={chartData} margin={{ left: -30, right: 10, top: 20, bottom: 0 }}>
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
                ticks={[1, 2, 3, 4, 5]}
                tick={({ x, y, payload }) => {
                  const emojiMap: { [key: number]: { emoji: string; bg: string } } = {
                    1: { emoji: '😢', bg: 'hsl(356 100% 69%)' },
                    2: { emoji: '😕', bg: 'hsl(18 100% 73%)' },
                    3: { emoji: '😐', bg: 'hsl(203 100% 64%)' },
                    4: { emoji: '😊', bg: 'hsl(174 76% 51%)' },
                    5: { emoji: '🤩', bg: 'hsl(150 94% 43%)' }
                  };
                  const data = emojiMap[payload.value as number];
                  if (!data) return null;
                  
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={14}
                        fill={data.bg}
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fontSize={14}
                      >
                        {data.emoji}
                      </text>
                    </g>
                  );
                }}
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
                connectNulls={false}
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
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyChart;