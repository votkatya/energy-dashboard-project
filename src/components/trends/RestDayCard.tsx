import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RestDayCardProps {
  restDay: {
    dayOfWeek: string;
    reason: string;
    avgEnergy: number;
  };
}

const RestDayCard = ({ restDay }: RestDayCardProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Coffee" size={24} className="text-accent" />
          Рекомендация по отдыху
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🛌</span>
            <div className="flex-1">
              <p className="font-medium text-lg mb-1">
                Планируй отдых в {restDay.dayOfWeek}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                {restDay.reason}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                <Icon name="Activity" size={14} />
                Средняя энергия: {restDay.avgEnergy}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestDayCard;
