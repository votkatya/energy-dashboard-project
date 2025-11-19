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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`${riskConfig.bgClass} ${riskConfig.borderClass} border`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Icon name={riskConfig.icon} size={24} className={riskConfig.iconColor} />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{riskConfig.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {riskDescription}
                </p>
              </div>
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
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Icon name={forecastConfig.icon} size={24} className={forecastConfig.iconColor} />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{forecastConfig.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {forecastDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RiskAndForecastCards;
