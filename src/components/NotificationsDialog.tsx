import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { getPlatform, canUseBrowserNotifications, getTelegramUser } from '@/utils/platformDetector';

interface NotificationSettings {
  dailyReminder: boolean;
  dailyReminderTime: string;
  burnoutWarnings: boolean;
  achievements: boolean;
  weeklyReport: boolean;
  telegramChatId?: number;
}

const defaultSettings: NotificationSettings = {
  dailyReminder: false,
  dailyReminderTime: '21:00',
  burnoutWarnings: true,
  achievements: true,
  weeklyReport: false,
};

const NotificationsDialog = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [hasPermission, setHasPermission] = useState<'granted' | 'denied' | 'default'>('default');
  const platform = getPlatform();
  const telegramUser = getTelegramUser();

  useEffect(() => {
    const saved = localStorage.getItem('notification-settings');
    let loadedSettings = defaultSettings;
    
    if (saved) {
      loadedSettings = JSON.parse(saved);
      setSettings(loadedSettings);
      
      if (platform === 'telegram' && loadedSettings.telegramChatId) {
        setHasPermission('granted');
      }
    }

    if (canUseBrowserNotifications()) {
      setHasPermission(Notification.permission);
    }
  }, []);

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
  };

  const requestPermission = async () => {
    if (platform === 'telegram' && telegramUser) {
      const newSettings = { ...settings, telegramChatId: telegramUser.id };
      setSettings(newSettings);
      localStorage.setItem('notification-settings', JSON.stringify(newSettings));
      setHasPermission('granted');
      return;
    }
    
    if (canUseBrowserNotifications()) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission);
      
      if (permission === 'granted') {
        new Notification('KatFlow', {
          body: 'Уведомления успешно включены! 🎉',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative glass-effect hover:glass-card transition-all"
        >
          <Icon name="Bell" size={20} />
          {settings.dailyReminder && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Bell" size={20} />
            Настройки уведомлений
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {platform === 'telegram' && (
            <>
              <Card className="p-4 bg-accent/10 border-accent/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon name="Send" size={20} className="text-accent mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Telegram уведомления</p>
                      <p className="text-xs text-muted-foreground">
                        Уведомления от бота @katflow_bot
                      </p>

                    </div>
                  </div>
                  <Switch
                    checked={hasPermission === 'granted'}
                    onCheckedChange={(checked) => {
                      if (checked && platform === 'telegram' && telegramUser) {
                        const newSettings = { ...settings, telegramChatId: telegramUser.id };
                        setSettings(newSettings);
                        localStorage.setItem('notification-settings', JSON.stringify(newSettings));
                        setHasPermission('granted');
                      } else {
                        setHasPermission('default');
                        const newSettings = { ...settings, telegramChatId: undefined };
                        setSettings(newSettings);
                        localStorage.setItem('notification-settings', JSON.stringify(newSettings));
                      }
                    }}
                  />
                </div>
              </Card>
              
              <div 
                className="p-4 bg-primary text-primary-foreground rounded-lg cursor-pointer active:opacity-80"
                onClick={() => {
                  if (telegramUser) {
                    const newSettings = { ...settings, telegramChatId: telegramUser.id };
                    setSettings(newSettings);
                    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
                    setHasPermission('granted');
                  }
                }}
              >
                <p className="text-sm font-medium text-center">
                  👆 Нажмите здесь для активации
                </p>
              </div>
            </>
          )}
          
          {platform === 'browser' && hasPermission !== 'granted' && (
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Разрешите уведомления</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Для работы напоминаний нужно разрешить браузеру отправлять уведомления
                  </p>
                  <Button
                    size="sm"
                    onClick={requestPermission}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    Разрешить уведомления
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex-1">
                <Label htmlFor="daily-reminder" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Clock" size={16} className="text-primary" />
                    <span className="font-medium">Ежедневное напоминание</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Напомним оценить день
                  </p>
                </Label>
              </div>
              <Switch
                id="daily-reminder"
                checked={settings.dailyReminder}
                onCheckedChange={(checked) => updateSetting('dailyReminder', checked)}
                disabled={hasPermission !== 'granted'}
              />
            </div>

            {settings.dailyReminder && (
              <div className="ml-4 flex items-center gap-3">
                <Label htmlFor="reminder-time" className="text-sm">Время:</Label>
                <Select
                  value={settings.dailyReminderTime}
                  onValueChange={(value) => updateSetting('dailyReminderTime', value)}
                >
                  <SelectTrigger id="reminder-time" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00:00">00:00</SelectItem>
                    <SelectItem value="00:30">00:30</SelectItem>
                    <SelectItem value="01:00">01:00</SelectItem>
                    <SelectItem value="01:30">01:30</SelectItem>
                    <SelectItem value="02:00">02:00</SelectItem>
                    <SelectItem value="02:30">02:30</SelectItem>
                    <SelectItem value="03:00">03:00</SelectItem>
                    <SelectItem value="03:30">03:30</SelectItem>
                    <SelectItem value="04:00">04:00</SelectItem>
                    <SelectItem value="04:30">04:30</SelectItem>
                    <SelectItem value="05:00">05:00</SelectItem>
                    <SelectItem value="05:30">05:30</SelectItem>
                    <SelectItem value="06:00">06:00</SelectItem>
                    <SelectItem value="06:30">06:30</SelectItem>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="07:30">07:30</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="08:30">08:30</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="09:30">09:30</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="10:30">10:30</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="11:30">11:30</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="12:30">12:30</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="13:30">13:30</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="14:30">14:30</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="15:30">15:30</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="16:30">16:30</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="17:30">17:30</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="18:30">18:30</SelectItem>
                    <SelectItem value="19:00">19:00</SelectItem>
                    <SelectItem value="19:30">19:30</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                    <SelectItem value="20:30">20:30</SelectItem>
                    <SelectItem value="21:00">21:00</SelectItem>
                    <SelectItem value="21:30">21:30</SelectItem>
                    <SelectItem value="22:00">22:00</SelectItem>
                    <SelectItem value="22:30">22:30</SelectItem>
                    <SelectItem value="23:00">23:00</SelectItem>
                    <SelectItem value="23:30">23:30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex-1">
                <Label htmlFor="burnout-warnings" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="AlertTriangle" size={16} className="text-destructive" />
                    <span className="font-medium">Предупреждения о выгорании</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Уведомим при риске выгорания
                  </p>
                </Label>
              </div>
              <Switch
                id="burnout-warnings"
                checked={settings.burnoutWarnings}
                onCheckedChange={(checked) => updateSetting('burnoutWarnings', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex-1">
                <Label htmlFor="achievements" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Trophy" size={16} className="text-primary" />
                    <span className="font-medium">Достижения</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Поздравления с успехами
                  </p>
                </Label>
              </div>
              <Switch
                id="achievements"
                checked={settings.achievements}
                onCheckedChange={(checked) => updateSetting('achievements', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex-1">
                <Label htmlFor="weekly-report" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="BarChart3" size={16} className="text-accent" />
                    <span className="font-medium">Еженедельный отчёт</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Статистика каждый понедельник
                  </p>
                </Label>
              </div>
              <Switch
                id="weekly-report"
                checked={settings.weeklyReport}
                onCheckedChange={(checked) => updateSetting('weeklyReport', checked)}
                disabled={hasPermission !== 'granted'}
              />
            </div>
          </div>

          {hasPermission === 'granted' && settings.dailyReminder && (
            <Card className="p-3 bg-accent/10 border-accent/20">
              <div className="flex items-start gap-2">
                <Icon name="Sparkles" size={16} className="text-accent mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {platform === 'telegram' 
                    ? `Бот будет присылать напоминания в ${settings.dailyReminderTime}`
                    : `Вы будете получать напоминание каждый день в ${settings.dailyReminderTime}`
                  }
                </p>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;