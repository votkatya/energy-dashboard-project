import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface MonthlyGoalCardProps {
  currentAverage: number;
  totalEntries: number;
}

const MonthlyGoalCard = ({ currentAverage, totalEntries }: MonthlyGoalCardProps) => {
  const energyPercentage = totalEntries > 0 ? (currentAverage / 5) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-[#2A2A2A] border-[#3A3A3A] mb-8 md:mb-10">
        <CardContent className="pt-6 pb-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/90 font-medium text-base">Ваш уровень энергии:</span>
              <a 
                href="https://t.me/+QgiLIa1gFRY4Y2Iy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/70 transition-colors text-sm"
              >
                Как повысить?
              </a>
            </div>
            
            <div className="space-y-2">
              <div className="text-white text-xl font-medium">
                Ваш дом защищён на {energyPercentage.toFixed(0)}%
              </div>
              
              <div className="relative h-3 bg-[#3A3A3A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(energyPercentage, 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#FF8A3C] to-[#FF8A3C]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyGoalCard;