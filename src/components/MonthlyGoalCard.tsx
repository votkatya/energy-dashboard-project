import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface MonthlyGoalCardProps {
  currentAverage: number;
  totalEntries: number;
}

const MonthlyGoalCard = ({ currentAverage, totalEntries }: MonthlyGoalCardProps) => {
  const getEnergyLevel = (score: number): { label: string; color: string } => {
    if (score < 3.5) {
      return { label: 'Низкий', color: 'text-orange-400' };
    } else if (score >= 3.5 && score < 4.5) {
      return { label: 'Хорошо', color: 'text-lime-400' };
    } else {
      return { label: 'Высокий', color: 'text-green-400' };
    }
  };

  const level = getEnergyLevel(currentAverage);
  const progressPercent = Math.min((currentAverage / 5) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card mb-8 md:mb-10">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base sm:text-lg font-medium whitespace-nowrap">Ваш уровень энергии:</span>
              <span className={`text-xl sm:text-2xl font-heading font-bold ${level.color} whitespace-nowrap`}>
                {totalEntries > 0 ? `${currentAverage.toFixed(1)} - ${level.label}` : '— '}
              </span>
            </div>
            <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-lime-500 via-lime-400 to-green-400 glow-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyGoalCard;