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
          <div className="flex-1 flex flex-col justify-between h-36 py-1">
            <div className="space-y-3">
              <h3 className="text-foreground text-lg font-medium">Уровень энергии</h3>
              
              <div className={`inline-block px-6 py-2 rounded-full ${energyLevel.pillBg}`}>
                <span className={`${energyLevel.color} font-bold text-lg`}>
                  {energyLevel.text}
                </span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              Тут что-то нужно написать, пока не знаю, что
            </p>
          </div>

          <div className="relative w-36 h-36 flex-shrink-0">
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
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke="rgba(0,0,0,0.9)"
                    strokeWidth="8"
                    strokeDasharray={`${(monthlyAverage / 5) * 339.29} 339.29`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-black">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/?tab=trends')}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base py-6 rounded-2xl gap-2 flex items-center justify-center"
        >
          Персональные рекомендации
          <div className="ml-auto bg-black/20 rounded-full p-2">
            <Icon name="ArrowRight" size={20} />
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnergyLevelCard;