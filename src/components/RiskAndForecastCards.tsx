import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

interface RiskAndForecastCardsProps {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskDescription: string;
  forecastTrend: 'improving' | 'stable' | 'declining';
  forecastDescription: string;
}

const RiskAndForecastCards = ({
  riskLevel,
  riskDescription,
  forecastTrend,
  forecastDescription
}: RiskAndForecastCardsProps) => {
  
  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'critical':
        return {
          icon: 'AlertTriangle' as const,
          title: 'Критический риск выгорания',
          bgClass: 'bg-gradient-to-br from-destructive/20 to-destructive/5',
          borderClass: 'border-destructive/40',
          iconColor: 'text-destructive'
        };
      case 'high':
        return {
          icon: 'AlertTriangle' as const,
          title: 'Высокий риск выгорания',
          bgClass: 'bg-gradient-to-br from-orange-500/20 to-orange-500/5',
          borderClass: 'border-orange-500/40',
          iconColor: 'text-orange-500'
        };
      case 'medium':
        return {
          icon: 'AlertCircle' as const,
          title: 'Средний риск выгорания',
          bgClass: 'bg-gradient-to-br from-yellow-500/20 to-yellow-500/5',
          borderClass: 'border-yellow-500/40',
          iconColor: 'text-yellow-500'
        };
      default:
        return {
          icon: 'CheckCircle' as const,
          title: 'Низкий риск выгорания',
          bgClass: 'bg-gradient-to-br from-primary/20 to-primary/5',
          borderClass: 'border-primary/40',
          iconColor: 'text-primary'
        };
    }
  };

  const getForecastConfig = () => {
    switch (forecastTrend) {
      case 'improving':
        return {
          icon: 'TrendingUp' as const,
          title: 'Прогноз на неделю: рост',
          bgClass: 'bg-gradient-to-br from-primary/20 to-primary/5',
          borderClass: 'border-primary/40',
          iconColor: 'text-primary'
        };
      case 'declining':
        return {
          icon: 'TrendingDown' as const,
          title: 'Прогноз на неделю: спад',
          bgClass: 'bg-gradient-to-br from-orange-500/20 to-orange-500/5',
          borderClass: 'border-orange-500/40',
          iconColor: 'text-orange-500'
        };
      default:
        return {
          icon: 'Minus' as const,
          title: 'Прогноз на неделю: стабильно',
          bgClass: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5',
          borderClass: 'border-blue-500/40',
          iconColor: 'text-blue-500'
        };
    }
  };

  const riskConfig = getRiskConfig();
  const forecastConfig = getForecastConfig();

  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`${riskConfig.bgClass} ${riskConfig.borderClass} border`}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon name={riskConfig.icon} size={20} className={riskConfig.iconColor} />
                <h3 className="font-semibold text-sm">Риск выгорания</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {riskDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`${forecastConfig.bgClass} ${forecastConfig.borderClass} border`}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon name={forecastConfig.icon} size={20} className={forecastConfig.iconColor} />
                <h3 className="font-semibold text-sm">Прогноз</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {forecastDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RiskAndForecastCards;