import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EnergyLevelCardProps {
  averageScore: number;
  monthlyAverage: number;
  last14DaysAverage: number;
  currentMonthCount: number;
  onTrendsClick: () => void;
  hasData?: boolean;
}

const getEnergyLevel = (score: number): { text: string; pillBg: string; cardBg: string; waveBg: string } => {
  if (score >= 4.5) return { text: 'Отлично', pillBg: 'bg-[#08D169]', cardBg: '#08D169', waveBg: '#0AED76' };
  if (score >= 3.8) return { text: 'Хорошо', pillBg: 'bg-[#25DACE]', cardBg: '#25DACE', waveBg: '#3FE8D8' };
  if (score >= 3.1) return { text: 'Нормально', pillBg: 'bg-[#48C0FF]', cardBg: '#48C0FF', waveBg: '#6BCFFF' };
  if (score >= 2.1) return { text: 'Низкий', pillBg: 'bg-[#FF9D78]', cardBg: '#FF9D78', waveBg: '#FFB396' };
  return { text: 'Критический', pillBg: 'bg-[#FF5F72]', cardBg: '#FF5F72', waveBg: '#FF8494' };
};

const EnergyLevelCard = ({ averageScore, monthlyAverage, last14DaysAverage, currentMonthCount, onTrendsClick, hasData = true }: EnergyLevelCardProps) => {
  // Основной показатель — последние 14 дней
  const energyLevel = getEnergyLevel(last14DaysAverage);
  const percentage = (last14DaysAverage / 5) * 100;

  if (!hasData || last14DaysAverage === 0) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 flex flex-col justify-between h-[120px]">
              <div className="space-y-2">
                <h3 className="text-foreground font-medium text-sm">Уровень энергии</h3>
                
                <div className="inline-block px-4 py-1.5 rounded-full bg-muted">
                  <span className="text-muted-foreground font-semibold text-sm">
                    Нет данных
                  </span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-xs leading-relaxed">
                Добавьте минимум 3 записи, чтобы увидеть статистику и получить рекомендации
              </p>
            </div>

            <div className="relative w-[120px] h-[120px] flex-shrink-0">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-muted/50 flex items-center justify-center">
                <Icon name="TrendingUp" size={48} className="text-muted-foreground/30" />
              </div>
            </div>
          </div>

          <Button 
            disabled
            className="w-full bg-muted hover:bg-muted text-muted-foreground font-semibold text-sm py-4 rounded-2xl flex items-center justify-between px-6 cursor-not-allowed"
          >
            <span>Добавьте записи</span>
            <div className="bg-muted-foreground/20 rounded-full p-2.5 flex items-center justify-center">
              <Icon name="Plus" size={18} className="text-muted-foreground/50" />
            </div>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 flex flex-col justify-between h-[120px]">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium text-sm">Уровень энергии</h3>
              
              <div className={`inline-block px-4 py-1.5 rounded-full ${energyLevel.pillBg}`}>
                <span className="text-white font-semibold text-sm">
                  {energyLevel.text}
                </span>
              </div>
              
              {currentMonthCount > 0 && (
                <div className="text-xs text-muted-foreground">
                  В этом месяце: <span className="font-medium text-foreground">{monthlyAverage.toFixed(1)}</span>
                  <span className="ml-1">({currentMonthCount} {currentMonthCount === 1 ? 'запись' : currentMonthCount < 5 ? 'записи' : 'записей'})</span>
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground text-xs leading-relaxed">За последние 14 дней</p>
          </div>

          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden" style={{ background: energyLevel.cardBg }}>
              <svg 
                viewBox="0 0 144 144" 
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <clipPath id="waveClip">
                    <path d={`M0,${144 - (percentage * 1.44)} Q36,${144 - (percentage * 1.44) - 8} 72,${144 - (percentage * 1.44)} T144,${144 - (percentage * 1.44)} L144,144 L0,144 Z`}>
                      <animate
                        attributeName="d"
                        dur="3s"
                        repeatCount="indefinite"
                        values={`
                          M0,${144 - (percentage * 1.44)} Q36,${144 - (percentage * 1.44) - 8} 72,${144 - (percentage * 1.44)} T144,${144 - (percentage * 1.44)} L144,144 L0,144 Z;
                          M0,${144 - (percentage * 1.44)} Q36,${144 - (percentage * 1.44) + 8} 72,${144 - (percentage * 1.44)} T144,${144 - (percentage * 1.44)} L144,144 L0,144 Z;
                          M0,${144 - (percentage * 1.44)} Q36,${144 - (percentage * 1.44) - 8} 72,${144 - (percentage * 1.44)} T144,${144 - (percentage * 1.44)} L144,144 L0,144 Z
                        `}
                      />
                    </path>
                  </clipPath>
                </defs>
                <rect 
                  width="144" 
                  height="144" 
                  fill={energyLevel.waveBg}
                  clipPath="url(#waveClip)"
                />
              </svg>
              
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 3px, transparent 3px),
                    radial-gradient(circle at 70% 50%, rgba(255,255,255,0.4) 4px, transparent 4px),
                    radial-gradient(circle at 45% 75%, rgba(255,255,255,0.45) 3.5px, transparent 3.5px),
                    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.35) 3px, transparent 3px),
                    radial-gradient(circle at 30% 85%, rgba(255,255,255,0.4) 3.5px, transparent 3.5px)
                  `,
                  backgroundSize: '100% 100%'
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#AEAEAE"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#222828"
                    strokeWidth="6"
                    strokeDasharray={`${(last14DaysAverage / 5) * 175.93} 175.93`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">
                    {last14DaysAverage.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={onTrendsClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm py-4 rounded-2xl flex items-center justify-between px-6"
        >
          <span>Персональные рекомендации</span>
          <div className="bg-black rounded-full p-2.5 flex items-center justify-center">
            <Icon name="ArrowRight" size={18} className="text-white" />
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnergyLevelCard;