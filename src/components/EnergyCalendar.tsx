import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const EnergyCalendar = () => {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const energyData: Record<number, { score: number; color: string }> = {
    7: { score: 3, color: 'bg-energy-neutral' },
    8: { score: 5, color: 'bg-energy-excellent' },
    9: { score: 5, color: 'bg-energy-excellent' },
    10: { score: 5, color: 'bg-energy-excellent' },
    11: { score: 5, color: 'bg-energy-excellent' },
    12: { score: 5, color: 'bg-energy-excellent' },
    13: { score: 5, color: 'bg-energy-excellent' },
    14: { score: 5, color: 'bg-energy-excellent' },
    15: { score: 3, color: 'bg-energy-neutral' },
    16: { score: 3, color: 'bg-energy-neutral' },
    17: { score: 4, color: 'bg-energy-good' },
    18: { score: 5, color: 'bg-energy-excellent' },
    19: { score: 4, color: 'bg-energy-good' },
    20: { score: 2, color: 'bg-energy-low' },
    21: { score: 4, color: 'bg-energy-good' },
    22: { score: 5, color: 'bg-energy-excellent' },
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Calendar" size={24} />
          Октябрь 2025
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-3">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="text-center font-medium text-muted-foreground text-sm py-2">
              {day}
            </div>
          ))}
          {Array(2).fill(null).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
          {daysInMonth.map((day) => {
            const data = energyData[day];
            return (
              <div
                key={day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  data 
                    ? `${data.color} text-white shadow-md` 
                    : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
                {data && <span className="text-xs font-bold mt-1">{data.score}</span>}
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
