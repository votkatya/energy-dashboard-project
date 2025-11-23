import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import AnimatedCard from '@/components/AnimatedCard';

interface SettingsPageProps {
  showHelpDialog: boolean;
  setShowHelpDialog: (show: boolean) => void;
  showLogoutDialog: boolean;
  setShowLogoutDialog: (show: boolean) => void;
  isEditingName: boolean;
  setIsEditingName: (editing: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  isEditingPassword: boolean;
  setIsEditingPassword: (editing: boolean) => void;
  oldPassword: string;
  setOldPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  exportedImage: string | null;
  setExportedImage: (image: string | null) => void;
  user: any;
  logout: () => void;
  exportDataToCSV: () => void;
}

const SettingsPage = ({
  showHelpDialog,
  setShowHelpDialog,
  showLogoutDialog,
  setShowLogoutDialog,
  isEditingName,
  setIsEditingName,
  userName,
  setUserName,
  isEditingPassword,
  setIsEditingPassword,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  exportedImage,
  setExportedImage,
  user,
  logout,
  exportDataToCSV
}: SettingsPageProps) => {
  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <>
      <div className="space-y-4">
        <AnimatedCard delay={0.1}>
          <Card className="card-hover shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="User" className="text-primary" size={24} />
                Профиль
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    type="text"
                    value={userName || user?.username || ''}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={!isEditingName}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditingName(!isEditingName)}
                  >
                    <Icon name={isEditingName ? "Check" : "Pencil"} size={18} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Электронная почта</Label>
                <Input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.15}>
          <Card className="card-hover shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Lock" className="text-primary" size={24} />
                Безопасность
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isEditingPassword ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingPassword(true)}
                  className="w-full"
                >
                  Изменить пароль
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Старый пароль</Label>
                    <Input
                      id="old-password"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Новый пароль</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                    <Button className="flex-1">
                      Сохранить
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <Card className="card-hover shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Download" className="text-primary" size={24} />
                Экспорт данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={exportDataToCSV}
                className="w-full gap-2"
              >
                <Icon name="FileText" size={18} />
                Экспортировать в CSV
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.25}>
          <Card className="card-hover shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" className="text-primary" size={24} />
                Помощь и информация
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => setShowHelpDialog(true)}
                className="w-full gap-2"
              >
                <Icon name="HelpCircle" size={18} />
                Помощь
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <Card className="card-hover shadow-lg border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Icon name="LogOut" size={24} />
                Выход
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => setShowLogoutDialog(true)}
                className="w-full gap-2"
              >
                <Icon name="LogOut" size={18} />
                Выйти из аккаунта
              </Button>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="HelpCircle" className="text-primary" size={24} />
              Помощь
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Как пользоваться приложением?</h3>
              <p className="text-sm text-muted-foreground">
                FlowKat помогает отслеживать вашу энергию и настроение. 
                Добавляйте записи ежедневно, отмечая уровень энергии от 1 до 5, 
                добавляйте теги и заметки.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Что означают цвета?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><span className="energy-excellent">●</span> Отлично (5)</li>
                <li><span className="energy-good">●</span> Хорошо (4)</li>
                <li><span className="energy-neutral">●</span> Нормально (3)</li>
                <li><span className="energy-medium-low">●</span> Низко (2)</li>
                <li><span className="energy-low">●</span> Очень низко (1)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Теги</h3>
              <p className="text-sm text-muted-foreground">
                Используйте теги для категоризации записей: работа, спорт, 
                отдых, стресс и т.д. Это поможет выявить паттерны.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="LogOut" className="text-destructive" size={24} />
              Выйти из аккаунта?
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Вы уверены, что хотите выйти? Все несохраненные данные будут потеряны.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {exportedImage && (
        <Dialog open={!!exportedImage} onOpenChange={() => setExportedImage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Экспортированная статистика</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img src={exportedImage} alt="Статистика" className="w-full rounded-lg" />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setExportedImage(null)}
                  className="flex-1"
                >
                  Закрыть
                </Button>
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `flowkat-stats-${new Date().toISOString().split('T')[0]}.png`;
                    link.href = exportedImage;
                    link.click();
                  }}
                  className="flex-1"
                >
                  <Icon name="Download" size={18} className="mr-2" />
                  Скачать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SettingsPage;
