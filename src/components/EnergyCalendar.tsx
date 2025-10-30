import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useQueryClient } from '@tanstack/react-query';

interface EnergyCalendarProps {
  data?: any;
  isLoading?: boolean;
}

const API_URL = 'https://functions.poehali.dev/856f35ee-0e8f-46f6-a290-7fd2955e7469';

const EnergyCalendar = ({ data, isLoading }: EnergyCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState<{ date: string; entry: any; dateKey: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getColorClass = (score: number) => {
    if (score >= 5) return "bg-energy-excellent";
    if (score >= 4) return "bg-energy-good";
    if (score >= 3) return "bg-energy-neutral";
    if (score >= 2) return "bg-energy-medium-low";
    return "bg-energy-low";
  };

  const energyDataMap = useMemo(() => {
    const map: Record<string, { score: number; color: string; entry: any }> = {};

    if (data?.entries) {
      data.entries.forEach((entry: any) => {
        const score = entry.score || entry.energy_level;
        if (entry.date && score !== undefined) {
          let day: number, month: number, year: number;
          
          if (entry.date.includes('.')) {
            const parts = entry.date.split(".");
            day = parseInt(parts[0]);
            month = parseInt(parts[1]) - 1;
            year = parseInt(parts[2]);
          } else if (entry.date.includes('-')) {
            const parts = entry.date.split("-");
            year = parseInt(parts[0]);
            month = parseInt(parts[1]) - 1;
            day = parseInt(parts[2]);
          } else {
            return;
          }
          
          const key = `${year}-${month}-${day}`;

          map[key] = {
            score: score,
            color: getColorClass(score),
            entry: entry,
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
            <Icon
              name="Loader2"
              size={32}
              className="animate-spin text-primary"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <div className="inline-flex bg-secondary/30 rounded-full p-1 gap-1 items-center">
            <button
              onClick={handlePrevMonth}
              className="px-3 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
            >
              <Icon name="ChevronLeft" size={18} />
            </button>
            <div className="px-6 py-2 text-sm font-medium min-w-[160px] text-center flex items-center justify-center gap-2">
              <Icon name="Calendar" size={18} />
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              onClick={handleNextMonth}
              className="px-3 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
            >
              <Icon name="ChevronRight" size={18} />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-3">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
            <div
              key={day}
              className="text-center font-medium text-muted-foreground text-sm py-2"
            >
              {day}
            </div>
          ))}
          {Array(firstDay)
            .fill(null)
            .map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateKey = `${currentYear}-${currentMonth}-${day}`;
            const dayData = energyDataMap[dateKey];
            return (
              <div
                key={day}
                onClick={() => {
                  const formattedDate = `${String(day).padStart(2, '0')}.${String(currentMonth + 1).padStart(2, '0')}.${currentYear}`;
                  setSelectedDay({
                    date: formattedDate,
                    entry: dayData?.entry || null,
                    dateKey: dateKey
                  });
                  if (dayData?.entry) {
                    setEditScore(dayData.entry.score);
                    setEditNotes(dayData.entry.thoughts || '');
                  } else {
                    setEditScore(null);
                    setEditNotes('');
                  }
                }}
                className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  dayData
                    ? `${dayData.color} text-white shadow-md`
                    : "bg-background border border-border text-foreground hover:bg-secondary/20"
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
            <span className="text-sm">Плохие</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-energy-neutral"></div>
            <span className="text-sm">Нейтральные</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-energy-good"></div>
            <span className="text-sm">Хорошие</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-energy-excellent"></div>
            <span className="text-sm">Отличные</span>
          </div>
        </div>
      </CardContent>

      <Dialog open={!!selectedDay} onOpenChange={() => { setSelectedDay(null); setIsEditing(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Calendar" size={20} />
              {selectedDay?.date}
            </DialogTitle>
          </DialogHeader>
          
          {!isEditing && selectedDay?.entry ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-16 h-16 rounded-xl ${getColorClass(selectedDay.entry.score)} flex items-center justify-center text-white font-heading font-bold text-2xl shadow-md`}>
                  {selectedDay.entry.score}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Уровень энергии</p>
                  <p className="font-medium">
                    {selectedDay.entry.score >= 5 ? 'Отличный' :
                     selectedDay.entry.score >= 4 ? 'Хороший' :
                     selectedDay.entry.score >= 3 ? 'Нейтральный' :
                     selectedDay.entry.score >= 2 ? 'Средне-низкий' : 'Плохой'}
                  </p>
                </div>
              </div>
              
              {selectedDay.entry.thoughts && (
                <div className="p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm font-medium mb-2">Заметки:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedDay.entry.thoughts}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={async () => {
                    if (!confirm('Удалить эту запись?')) return;
                    setIsSaving(true);
                    try {
                      const token = localStorage.getItem('auth_token');
                      const response = await fetch(API_URL, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-Auth-Token': token || '',
                        },
                        body: JSON.stringify({ date: selectedDay.date }),
                      });
                      if (!response.ok) throw new Error('Failed to delete');
                      await queryClient.invalidateQueries({ queryKey: ['energy-data'] });
                      setSelectedDay(null);
                    } catch (error) {
                      alert('Не удалось удалить запись');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить
                </Button>
                <Button
                  className="flex-[1.5] bg-gradient-to-r from-primary to-accent"
                  onClick={() => setIsEditing(true)}
                >
                  <Icon name="Edit" size={16} className="mr-2" />
                  Изменить запись
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Как прошёл день?</Label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 1, color: 'bg-energy-low hover:bg-energy-low/80' },
                    { value: 2, color: 'bg-energy-medium-low hover:bg-energy-medium-low/80' },
                    { value: 3, color: 'bg-energy-neutral hover:bg-energy-neutral/80' },
                    { value: 4, color: 'bg-energy-good hover:bg-energy-good/80' },
                    { value: 5, color: 'bg-energy-excellent hover:bg-energy-excellent/80' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setEditScore(item.value)}
                      className={`aspect-square rounded-xl ${item.color} text-white font-heading font-bold text-2xl transition-all ${
                        editScore === item.value ? 'ring-4 ring-primary scale-110' : 'opacity-70'
                      }`}
                    >
                      {item.value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes" className="mb-2 block">Заметки о дне</Label>
                <Textarea
                  id="edit-notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Что происходило? Какие были мысли и чувства?"
                  className="min-h-32 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    if (selectedDay?.entry) {
                      setEditScore(selectedDay.entry.score);
                      setEditNotes(selectedDay.entry.thoughts || '');
                    }
                  }}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                  disabled={editScore === null || isSaving}
                  onClick={async () => {
                    if (editScore === null) return;
                    setIsSaving(true);
                    try {
                      const token = localStorage.getItem('auth_token');
                      const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-Auth-Token': token || '',
                        },
                        body: JSON.stringify({
                          date: selectedDay?.date,
                          score: editScore,
                          thoughts: editNotes,
                        }),
                      });
                      if (!response.ok) throw new Error('Failed to save');
                      await queryClient.invalidateQueries({ queryKey: ['energy-data'] });
                      setSelectedDay(null);
                      setIsEditing(false);
                    } catch (error) {
                      alert('Не удалось сохранить запись');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                >
                  {isSaving ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EnergyCalendar;