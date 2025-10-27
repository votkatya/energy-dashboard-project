import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedCard = ({ children, delay = 0, className = '' }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
