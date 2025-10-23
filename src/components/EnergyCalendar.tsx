import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EnergyCalendarProps {
  data?: any;
  isLoading?: boolean;
}

const EnergyCalendar = ({ data, isLoading }: EnergyCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(2025);

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getColorClass = (score: number) => {
    if (score >= 5) return 'bg-energy-excellent';
    if (score >= 4) return 'bg-energy-good';
    if (score >= 3) return 'bg-energy-neutral';
    if (score >= 2) return 'bg-energy-medium-low';
    return 'bg-energy-low';
  };

  const energyDataMap = useMemo(() => {
    const map: Record<string, { score: number; color: string }> = {};
    
    if (data?.entries) {
      data.entries.forEach((entry: any) => {
        const score = entry.score || entry.energy_level;
        if (entry.date && score !== undefined) {
          const [year, month, day] = entry.date.split('-').map(Number);
          const key = `${year}-${month - 1}-${day}`;
          
          map[key] = {
            score: score,
            color: getColorClass(score)
          };
        }
      });
    }
    
    return map;
  }, [data]);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={24} />
            {monthNames[currentMonth]} {currentYear}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="h-8 w-8"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-3">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="text-center font-medium text-muted-foreground text-sm py-2">
              {day}
            </div>
          ))}
          {Array(firstDay).fill(null).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateKey = `${currentYear}-${currentMonth}-${day}`;
            const dayData = energyDataMap[dateKey];
            return (
              <div
                key={day}
                className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  dayData 
                    ? `${dayData.color} text-white shadow-md` 
                    : 'bg-white border border-border text-foreground hover:bg-secondary/20'
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-energy-low"></div>
            <span className="text-sm">Плохие (1-2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-energy-neutral"></div>
            <span className="text-sm">Нейтральные (3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-energy-good"></div>
            <span className="text-sm">Хорошие (4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-energy-excellent"></div>
            <span className="text-sm">Отличные (5)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyCalendar;