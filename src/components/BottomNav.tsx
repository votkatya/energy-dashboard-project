import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'home', icon: 'Home', label: 'Главная' },
    { id: 'stats', icon: 'BarChart3', label: 'Статистика' },
    { id: 'trends', icon: 'Activity', label: 'Тренды' },
    { id: 'settings', icon: 'Settings', label: 'Настройки' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border pb-safe">
      <nav className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-4 gap-1 py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center py-2 px-1 transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActiveTab"
                    className="absolute inset-0 bg-primary rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative z-10 flex flex-col items-center gap-1 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                  <Icon name={tab.icon as any} size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
