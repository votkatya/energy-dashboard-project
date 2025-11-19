import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface EnergyTrendsProps {
  data?: any;
  isLoading?: boolean;
}

const EnergyTrends = ({ data, isLoading }: EnergyTrendsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.entries || data.entries.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Недостаточно данных для анализа трендов</p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default EnergyTrends;