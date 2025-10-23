import { useState } from 'react';
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

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const energyData: Record<string, { score: number; color: string }> = {
    '2025-7-15': { score: 4, color: 'bg-energy-good' },
    '2025-7-16': { score: 5, color: 'bg-energy-excellent' },
    '2025-7-17': { score: 3, color: 'bg-energy-neutral' },
    '2025-7-18': { score: 4, color: 'bg-energy-good' },
    '2025-7-19': { score: 5, color: 'bg-energy-excellent' },
    '2025-7-20': { score: 4, color: 'bg-energy-good' },
    '2025-7-21': { score: 5, color: 'bg-energy-excellent' },
    '2025-7-22': { score: 3, color: 'bg-energy-neutral' },
    '2025-7-23': { score: 4, color: 'bg-energy-good' },
    '2025-7-24': { score: 5, color: 'bg-energy-excellent' },
    '2025-7-25': { score: 4, color: 'bg-energy-good' },
    '2025-7-26': { score: 3, color: 'bg-energy-neutral' },
    '2025-7-27': { score: 5, color: 'bg-energy-excellent' },
    '2025-7-28': { score: 4, color: 'bg-energy-good' },
    '2025-7-29': { score: 5, color: 'bg-energy-excellent' },
    '2025-7-30': { score: 5, color: 'bg-energy-excellent' },
    '2025-7-31': { score: 4, color: 'bg-energy-good' },
    '2025-8-1': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-2': { score: 4, color: 'bg-energy-good' },
    '2025-8-3': { score: 3, color: 'bg-energy-neutral' },
    '2025-8-4': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-5': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-6': { score: 4, color: 'bg-energy-good' },
    '2025-8-7': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-8': { score: 3, color: 'bg-energy-neutral' },
    '2025-8-9': { score: 4, color: 'bg-energy-good' },
    '2025-8-10': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-11': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-12': { score: 4, color: 'bg-energy-good' },
    '2025-8-13': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-14': { score: 3, color: 'bg-energy-neutral' },
    '2025-8-15': { score: 4, color: 'bg-energy-good' },
    '2025-8-16': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-17': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-18': { score: 4, color: 'bg-energy-good' },
    '2025-8-19': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-20': { score: 3, color: 'bg-energy-neutral' },
    '2025-8-21': { score: 4, color: 'bg-energy-good' },
    '2025-8-22': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-23': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-24': { score: 4, color: 'bg-energy-good' },
    '2025-8-25': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-26': { score: 3, color: 'bg-energy-neutral' },
    '2025-8-27': { score: 4, color: 'bg-energy-good' },
    '2025-8-28': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-29': { score: 5, color: 'bg-energy-excellent' },
    '2025-8-30': { score: 4, color: 'bg-energy-good' },
    '2025-8-31': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-7': { score: 3, color: 'bg-energy-neutral' },
    '2025-9-8': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-9': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-10': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-11': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-12': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-13': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-14': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-15': { score: 3, color: 'bg-energy-neutral' },
    '2025-9-16': { score: 3, color: 'bg-energy-neutral' },
    '2025-9-17': { score: 4, color: 'bg-energy-good' },
    '2025-9-18': { score: 5, color: 'bg-energy-excellent' },
    '2025-9-19': { score: 4, color: 'bg-energy-good' },
    '2025-9-20': { score: 2, color: 'bg-energy-low' },
    '2025-9-21': { score: 4, color: 'bg-energy-good' },
    '2025-9-22': { score: 5, color: 'bg-energy-excellent' },
  };

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
            const dayData = energyData[dateKey];
            return (
              <div
                key={day}
                className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  dayData 
                    ? `${dayData.color} text-white shadow-md` 
                    : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
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