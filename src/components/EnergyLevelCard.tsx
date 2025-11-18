import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface EnergyLevelCardProps {
  averageScore: number;
  monthlyAverage: number;
}

const getEnergyLevel = (score: number): { text: string; color: string; bgColor: string } => {
  if (score >= 4.5) return { text: 'Отлично', color: 'text-green-700', bgColor: 'bg-green-400' };
  if (score >= 3.5) return { text: 'Хорошо', color: 'text-lime-700', bgColor: 'bg-lime-400' };
  if (score >= 2.5) return { text: 'Нормально', color: 'text-yellow-700', bgColor: 'bg-yellow-400' };
  if (score >= 1.5) return { text: 'Низко', color: 'text-orange-700', bgColor: 'bg-orange-400' };
  return { text: 'Очень низко', color: 'text-red-700', bgColor: 'bg-red-400' };
};

const EnergyLevelCard = ({ averageScore, monthlyAverage }: EnergyLevelCardProps) => {
  const navigate = useNavigate();
  const energyLevel = getEnergyLevel(averageScore);
  const percentage = (monthlyAverage / 5) * 100;

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <h3 className="text-white text-lg font-medium">Уровень энергии</h3>
            
            <div className={`inline-block px-6 py-2 rounded-full ${energyLevel.bgColor}`}>
              <span className={`${energyLevel.color} font-bold text-lg`}>
                {energyLevel.text}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Тут что-то нужно написать, пока не знаю, что
            </p>
          </div>

          <div className="relative w-32 h-32 flex-shrink-0">
            <div className={`absolute inset-0 rounded-2xl ${energyLevel.bgColor} overflow-hidden`}>
              <svg 
                viewBox="0 0 128 128" 
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <clipPath id="waveClip">
                    <path d={`M0,${128 - (percentage * 1.28)} Q32,${128 - (percentage * 1.28) - 8} 64,${128 - (percentage * 1.28)} T128,${128 - (percentage * 1.28)} L128,128 L0,128 Z`}>
                      <animate
                        attributeName="d"
                        dur="3s"
                        repeatCount="indefinite"
                        values={`
                          M0,${128 - (percentage * 1.28)} Q32,${128 - (percentage * 1.28) - 8} 64,${128 - (percentage * 1.28)} T128,${128 - (percentage * 1.28)} L128,128 L0,128 Z;
                          M0,${128 - (percentage * 1.28)} Q32,${128 - (percentage * 1.28) + 8} 64,${128 - (percentage * 1.28)} T128,${128 - (percentage * 1.28)} L128,128 L0,128 Z;
                          M0,${128 - (percentage * 1.28)} Q32,${128 - (percentage * 1.28) - 8} 64,${128 - (percentage * 1.28)} T128,${128 - (percentage * 1.28)} L128,128 L0,128 Z
                        `}
                      />
                    </path>
                  </clipPath>
                </defs>
                <rect 
                  width="128" 
                  height="128" 
                  fill="rgba(0,0,0,0.2)" 
                  clipPath="url(#waveClip)"
                />
              </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="6"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="6"
                  strokeDasharray={`${(monthlyAverage / 5) * 301.59} 301.59`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {monthlyAverage.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/?tab=trends')}
          className={`w-full ${energyLevel.bgColor} hover:opacity-90 ${energyLevel.color} font-semibold text-base py-6 rounded-2xl gap-2`}
        >
          Персональные рекомендации
          <Icon name="ArrowRight" size={20} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnergyLevelCard;
