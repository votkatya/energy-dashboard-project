import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useQueryClient } from '@tanstack/react-query';

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_URL = 'https://functions.poehali.dev/856f35ee-0e8f-46f6-a290-7fd2955e7469';

const AddEntryDialog = ({ open, onOpenChange }: AddEntryDialogProps) => {
  const [score, setScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const scores = [
    { value: 0, label: 'Ужасно', color: 'bg-energy-low hover:bg-energy-low/80' },
    { value: 1, label: 'Плохо', color: 'bg-energy-medium-low hover:bg-energy-medium-low/80' },
    { value: 2, label: 'Нейтрально', color: 'bg-energy-neutral hover:bg-energy-neutral/80' },
    { value: 3, label: 'Хорошо', color: 'bg-energy-good hover:bg-energy-good/80' },
    { value: 4, label: 'Отлично', color: 'bg-energy-excellent hover:bg-energy-excellent/80' },
  ];

  const handleSave = async () => {
    if (score === null) return;
    
    setIsSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: today,
          score: score,
          thoughts: notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      await queryClient.invalidateQueries({ queryKey: ['energy-data'] });
      
      onOpenChange(false);
      setScore(null);
      setNotes('');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Не удалось сохранить запись. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  className={`aspect-square rounded-xl ${item.color} text-white font-heading font-bold text-2xl transition-all ${
                    score === item.value ? 'ring-4 ring-primary scale-110' : 'opacity-70'
                  }`}
                >
                  {item.value}
                </button>
              ))}
            </div>
            {score && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {scores.find(s => s.value === score)?.label}
              </p>
            )}
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