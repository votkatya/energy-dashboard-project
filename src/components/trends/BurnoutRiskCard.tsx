import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface BurnoutRiskCardProps {
  burnoutRisk: {
    level: string;
    message: string;
    icon: string;
    color: string;
  };
}

const BurnoutRiskCard = ({ burnoutRisk }: BurnoutRiskCardProps) => {
  return (
    <Card className={`shadow-lg ${
      burnoutRisk.level === 'critical' 
        ? 'bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent border-destructive/30' 
        : burnoutRisk.level === 'high'
        ? 'bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent border-orange-500/30'
        : burnoutRisk.level === 'medium'
        ? 'bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent border-yellow-500/30'
        : 'bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name={burnoutRisk.icon as any} size={24} className={burnoutRisk.color} />
          Риск выгорания
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className={`text-lg font-medium ${burnoutRisk.color}`}>
                {burnoutRisk.message}
              </p>
              {burnoutRisk.level !== 'low' && (
                <p className="text-sm text-muted-foreground mt-2">
                  💡 Совет: Запланируй отдых, сократи нагрузку, уделяй время восстановлению
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BurnoutRiskCard;
