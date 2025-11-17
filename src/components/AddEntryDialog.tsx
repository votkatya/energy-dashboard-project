import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_URL = 'https://functions.poehali.dev/2d4b8a75-8e94-40d2-8412-5e0040b74b86';

const AddEntryDialog = ({ open, onOpenChange }: AddEntryDialogProps) => {
  const [score, setScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dateMode, setDateMode] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  const scores = [
    { value: 1, label: 'Ужасно', emoji: '😢', color: 'bg-energy-low hover:bg-energy-low/80' },
    { value: 2, label: 'Плохо', emoji: '😕', color: 'bg-energy-medium-low hover:bg-energy-medium-low/80' },
    { value: 3, label: 'Нейтрально', emoji: '😐', color: 'bg-energy-neutral hover:bg-energy-neutral/80' },
    { value: 4, label: 'Хорошо', emoji: '😊', color: 'bg-energy-good hover:bg-energy-good/80' },
    { value: 5, label: 'Отлично', emoji: '🤩', color: 'bg-energy-excellent hover:bg-energy-excellent/80' },
  ];

  const tags = [
    { id: 'work', label: 'Работа', icon: '💼' },
    { id: 'family', label: 'Семья', icon: '👨‍👩‍👧' },
    { id: 'sport', label: 'Спорт', icon: '🎯' },
    { id: 'sleep', label: 'Сон', icon: '😴' },
    { id: 'hobby', label: 'Хобби', icon: '🎨' },
    { id: 'social', label: 'Общение', icon: '👥' },
    { id: 'study', label: 'Учёба', icon: '📚' },
    { id: 'health', label: 'Здоровье', icon: '💊' },
  ];

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const getDateForSave = () => {
    const formatLocalDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateMode === 'today') return formatLocalDate(today);
    if (dateMode === 'yesterday') return formatLocalDate(yesterday);
    return selectedDate ? formatLocalDate(selectedDate) : formatLocalDate(today);
  };

  const handleSave = async () => {
    if (score === null) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const dateToSave = getDateForSave();
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify({
          date: dateToSave,
          score: score,
          thoughts: notes,
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      await queryClient.invalidateQueries({ queryKey: ['energy-data'] });
      
      onOpenChange(false);
      setScore(null);
      setNotes('');
      setSelectedTags([]);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Не удалось сохранить запись. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Как ты сегодня?</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4 overflow-y-auto">
          <div>
            <Label className="mb-3 block">Выберите дату</Label>
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={dateMode === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateMode('today')}
                className="flex-1"
              >
                Сегодня
              </Button>
              <Button
                type="button"
                variant={dateMode === 'yesterday' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateMode('yesterday')}
                className="flex-1"
              >
                Вчера
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={dateMode === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                  >
                    <Icon name="Calendar" size={16} className="mr-1" />
                    {dateMode === 'custom' && selectedDate ? format(selectedDate, 'd MMM', { locale: ru }) : 'Дата'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setDateMode('custom');
                    }}
                    locale={ru}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Как прошёл твой день?</Label>
            <div className="grid grid-cols-5 gap-3">
              {scores.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setScore(item.value)}
                  className={`aspect-square rounded-full ${item.color} text-white font-heading font-bold text-3xl transition-all flex items-center justify-center ${
                    score === item.value ? 'ring-4 ring-primary scale-110' : 'opacity-70'
                  }`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
            {score !== null && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {scores.find(s => s.value === score)?.label}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3 block">Что больше повлияло на оценку?</Label>
            <div className="grid grid-cols-2 gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                const isDisabled = !isSelected && selectedTags.length >= 3;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    disabled={isDisabled}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : isDisabled
                        ? 'bg-muted/30 text-muted-foreground opacity-50 cursor-not-allowed'
                        : 'bg-secondary/50 hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Выберите до 3 тегов
            </p>
          </div>

          <div>
            <Label htmlFor="notes" className="mb-2 block">Заметки о дне</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Что происходило сегодня? Какие были мысли и чувства?"
              className="min-h-32 resize-none"
            />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={score === null || isSaving}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            size="lg"
          >
            {isSaving ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={20} className="mr-2" />
                Сохранить запись
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;