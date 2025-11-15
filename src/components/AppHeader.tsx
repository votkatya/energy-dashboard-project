import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import NotificationsDialog from '@/components/NotificationsDialog';

interface AppHeaderProps {
  onAddClick: () => void;
  onSettingsClick: () => void;
}

const AppHeader = ({ onAddClick, onSettingsClick }: AppHeaderProps) => {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Icon name="Zap" size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-heading font-extrabold text-primary" style={{ letterSpacing: '0.02em' }}>FlowKat</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <NotificationsDialog />
            <Button 
              onClick={onSettingsClick}
              size="icon"
              variant="outline"
              className="sm:hidden"
            >
              <Icon name="Settings" size={20} />
            </Button>
            <Button 
              onClick={onSettingsClick}
              size="lg"
              variant="outline"
              className="hidden sm:flex glass-effect hover:glass-card transition-all"
            >
              <Icon name="Settings" size={20} className="mr-2" />
              Настройки
            </Button>
            <Button 
              onClick={onAddClick}
              size="lg"
              className="hidden sm:flex"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить запись
            </Button>
          </div>
        </div>
        <Button 
          onClick={onAddClick}
          size="lg"
          className="sm:hidden w-full"
        >
          Как ты сегодня?
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;