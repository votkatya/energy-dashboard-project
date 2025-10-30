import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';
import { useMonthlyGoal } from '@/hooks/useMonthlyGoal';
import { useToast } from '@/hooks/use-toast';

interface MonthlyGoalCardProps {
  currentAverage: number;
  totalEntries: number;
  currentYear: number;
  currentMonth: number;
}

const MonthlyGoalCard = ({ currentAverage, totalEntries, currentYear, currentMonth }: MonthlyGoalCardProps) => {
  const { goal, setGoal, isSettingGoal } = useMonthlyGoal(currentYear, currentMonth);
  const [isEditing, setIsEditing] = useState(false);
  const [goalValue, setGoalValue] = useState('4.0');
  const { toast } = useToast();

  const currentGoal = goal?.goalScore || 4.0;

  const handleSaveGoal = () => {
    const value = parseFloat(goalValue);
    
    if (isNaN(value) || value < 0 || value > 5) {
      toast({
        title: 'Ошибка',
        description: 'Цель должна быть числом от 0 до 5',
        variant: 'destructive',
      });
      return;
    }

    setGoal(
      { year: currentYear, month: currentMonth, goalScore: value },
      {
        onSuccess: () => {
          toast({
            title: 'Цель обновлена',
            description: `Новая цель на месяц: ${value}`,
          });
          setIsEditing(false);
        },
        onError: () => {
          toast({
            title: 'Ошибка',
            description: 'Не удалось сохранить цель',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleEdit = () => {
    setGoalValue(currentGoal.toString());
    setIsEditing(true);
  };

  if (totalEntries === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card mb-8 md:mb-10">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Target" size={20} className="text-primary" />
                <span className="font-medium">Цель на месяц</span>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={goalValue}
                      onChange={(e) => setGoalValue(e.target.value)}
                      className="w-20 h-9"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveGoal}
                      disabled={isSettingGoal}
                      className="h-9"
                    >
                      {isSettingGoal ? (
                        <Icon name="Loader2" size={16} className="animate-spin" />
                      ) : (
                        <Icon name="Check" size={16} />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="h-9"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-right">
                      <div className="text-2xl font-heading font-bold text-primary">
                        {currentAverage.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">из {currentGoal.toFixed(1)}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEdit}
                      className="h-9 w-9 p-0"
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((currentAverage / currentGoal) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-primary glow-primary"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {currentAverage >= currentGoal
                ? '🎉 Цель достигнута!'
                : `Еще ${(currentGoal - currentAverage).toFixed(1)} до цели`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyGoalCard;