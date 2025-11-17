import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface MonthlyGoalCardProps {
  currentAverage: number;
  totalEntries: number;
}

const MonthlyGoalCard = ({ currentAverage, totalEntries }: MonthlyGoalCardProps) => {
  const getEnergyLevel = (score: number): { label: string; color: string } => {
    if (score < 2) {
      return { label: 'Критичный', color: 'text-energy-low' };
    } else if (score >= 2 && score < 3.5) {
      return { label: 'Низкий', color: 'text-energy-medium-low' };
    } else if (score >= 3.5 && score < 4.6) {
      return { label: 'Хороший', color: 'text-energy-good' };
    } else {
      return { label: 'Высокий', color: 'text-energy-excellent' };
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
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm sm:text-base font-medium whitespace-nowrap">Уровень энергии:</span>
              <span className={`text-lg sm:text-xl font-heading font-bold ${level.color} whitespace-nowrap`}>
                {totalEntries > 0 ? `${currentAverage.toFixed(1)} - ${level.label}` : '— '}
              </span>
            </div>
            <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-full rounded-full bg-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyGoalCard;