import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useAddEntry } from '@/hooks/useAddEntry';

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEntryDialog = ({ open, onOpenChange }: AddEntryDialogProps) => {
  const [score, setScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { addEntry, isSubmitting } = useAddEntry();

  const scores = [
    { value: 1, label: 'Очень плохо', color: 'bg-energy-low hover:bg-energy-low/80' },
    { value: 2, label: 'Плохо', color: 'bg-energy-medium-low hover:bg-energy-medium-low/80' },
    { value: 3, label: 'Нейтрально', color: 'bg-energy-neutral hover:bg-energy-neutral/80' },
    { value: 4, label: 'Хорошо', color: 'bg-energy-good hover:bg-energy-good/80' },
    { value: 5, label: 'Отлично', color: 'bg-energy-excellent hover:bg-energy-excellent/80' },
  ];

  const handleSave = async () => {
    if (!score) {
      toast({
        title: "Выберите оценку",
        description: "Пожалуйста, выберите оценку для дня",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addEntry({ score, thoughts: notes });
      
      if (result.success) {
        toast({
          title: "Успешно!",
          description: result.message || "Запись добавлена",
        });
        onOpenChange(false);
        setScore(null);
        setNotes('');
      } else {
        toast({
          title: "Ошибка",
          description: result.errors?.[0]?.message || "Не удалось добавить запись",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла непредвиденная ошибка",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      setScore(null);
      setNotes('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Plus" size={20} />
            Добавить запись
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label className="mb-3 block">Как прошёл твой день?</Label>
            <div className="grid grid-cols-5 gap-2">
              {scores.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setScore(item.value)}
                  disabled={isSubmitting}
                  className={`aspect-square rounded-xl ${item.color} text-white font-heading font-bold text-2xl transition-all ${
                    score === item.value 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-105' 
                      : 'hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {item.value}
                </button>
              ))}
            </div>
            <div className="mt-2 text-center">
              {score && (
                <span className="text-sm text-muted-foreground">
                  {scores.find(s => s.value === score)?.label}
                </span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="mb-2 block">
              Заметки (необязательно)
            </Label>
            <Textarea
              id="notes"
              placeholder="Как прошёл день? Что повлияло на настроение?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              maxLength={500}
              className="min-h-[100px]"
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">
              {notes.length}/500
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={!score || isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
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
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
