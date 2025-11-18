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
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card mb-8 md:mb-10 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(139, 212, 90, 0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        <CardContent className="pt-6 relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="rgba(139, 212, 90, 0.15)"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="rgb(139, 212, 90)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-[rgb(139,212,90)]">
                    {totalEntries > 0 ? `${Math.round(progressPercent)}%` : '—'}
                  </div>
                  <div className={`text-sm mt-1 font-medium ${level.color}`}>
                    {totalEntries > 0 ? level.label : ''}
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Уровень энергии</div>
              <div className="text-lg font-semibold">
                {totalEntries > 0 ? `${currentAverage.toFixed(1)} из 5` : 'Нет данных'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyGoalCard;