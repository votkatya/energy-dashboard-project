import AnimatedCard from '@/components/AnimatedCard';
import EnergyTrendOverview from '@/components/trends/EnergyTrendOverview';
import TagInfluenceCard from '@/components/trends/TagInfluenceCard';
import BurnoutIndicatorsCard from '@/components/trends/BurnoutIndicatorsCard';
import EnergyIndexesCard from '@/components/trends/EnergyIndexesCard';

interface TrendsPageProps {
  data: any;
}

const TrendsPage = ({ data }: TrendsPageProps) => {
  return (
    <div className="space-y-6">
      <AnimatedCard delay={0.1}>
        <EnergyTrendOverview entries={data?.entries || []} />
      </AnimatedCard>

      <AnimatedCard delay={0.15}>
        <TagInfluenceCard entries={data?.entries || []} />
      </AnimatedCard>

      <AnimatedCard delay={0.2}>
        <BurnoutIndicatorsCard entries={data?.entries || []} />
      </AnimatedCard>

      <AnimatedCard delay={0.25}>
        <EnergyIndexesCard entries={data?.entries || []} />
      </AnimatedCard>
    </div>
  );
};

export default TrendsPage;
