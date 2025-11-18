import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import EnergyStats from '@/components/EnergyStats';
import EnergyChart from '@/components/EnergyChart';
import type { EnergyEntry } from '@/types/energy';

interface StatsTabProps {
  data: { entries: EnergyEntry[] } | undefined;
  isLoading: boolean;
  timePeriod: 'week' | 'month' | 'year';
  onTimePeriodChange: (period: 'week' | 'month' | 'year') => void;
}

const StatsTab = ({ data, isLoading, timePeriod, onTimePeriodChange }: StatsTabProps) => {
  return (
    <>
      <Card className="glass-card mb-6 p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={timePeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTimePeriodChange('week')}
            className="flex-1 sm:flex-none"
          >
            <Icon name="Calendar" size={16} className="mr-2" />
            Неделя
          </Button>
          <Button
            variant={timePeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTimePeriodChange('month')}
            className="flex-1 sm:flex-none"
          >
            <Icon name="CalendarDays" size={16} className="mr-2" />
            Месяц
          </Button>
          <Button
            variant={timePeriod === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTimePeriodChange('year')}
            className="flex-1 sm:flex-none"
          >
            <Icon name="CalendarRange" size={16} className="mr-2" />
            Год
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <EnergyChart data={data} timePeriod={timePeriod} />
        <EnergyStats data={data} isLoading={isLoading} />
      </div>
    </>
  );
};

export default StatsTab;