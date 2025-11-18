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
            <img 
              src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
              alt="FlowKat Logo"
              className="w-8 h-8 sm:w-9 sm:h-9"
            />
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
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;