import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface EnergyLevelCardProps {
  averageScore: number;
  monthlyAverage: number;
}

const getEnergyLevel = (score: number): { text: string; color: string; bgColor: string; pillBg: string } => {
  if (score >= 4.5) return { text: 'Отлично', color: 'text-black', bgColor: 'bg-green-400/90', pillBg: 'bg-green-500' };
  if (score >= 3.5) return { text: 'Хорошо', color: 'text-black', bgColor: 'bg-lime-400/90', pillBg: 'bg-lime-500' };
  if (score >= 2.5) return { text: 'Нормально', color: 'text-black', bgColor: 'bg-yellow-400/90', pillBg: 'bg-yellow-500' };
  if (score >= 1.5) return { text: 'Низко', color: 'text-black', bgColor: 'bg-orange-400/90', pillBg: 'bg-orange-500' };
  return { text: 'Очень низко', color: 'text-white', bgColor: 'bg-red-500/90', pillBg: 'bg-red-600' };
};

const EnergyLevelCard = ({ averageScore, monthlyAverage }: EnergyLevelCardProps) => {
  const navigate = useNavigate();
  const energyLevel = getEnergyLevel(averageScore);
  const percentage = (monthlyAverage / 5) * 100;

  return (
    <Card className="bg-card/60 border-border overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 flex flex-col justify-between h-[120px]">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium text-sm">Уровень энергии</h3>
              
              <div className={`inline-block px-5 py-1.5 rounded-full ${energyLevel.pillBg}`}>
                <span className={`${energyLevel.color} font-bold text-base`}>
                  {energyLevel.text}
                </span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-xs leading-relaxed">
              Тут что-то нужно написать, пока не знаю, что
            </p>
          </div>

          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden" style={{ background: '#A8D146' }}>
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
                  fill="#D7F787"
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
                    strokeDasharray={`${(monthlyAverage / 5) * 175.93} 175.93`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">
                    {monthlyAverage.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/?tab=trends')}
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