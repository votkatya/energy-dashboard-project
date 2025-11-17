import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface SettingsTabProps {
  user: any;
  logout: () => void;
  totalEntries: number;
}

const SettingsTab = ({ user, logout, totalEntries }: SettingsTabProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/401ea5a5-2659-4eea-a94d-cfbe058746b6', {
          method: 'GET',
          headers: {
            'X-User-Id': user?.id || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name || '');
          setOriginalName(data.name || '');
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      } finally {
        setIsLoadingName(false);
      }
    };

    if (user?.id) {
      fetchUserName();
    }
  }, [user]);

  const handleSaveName = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/401ea5a5-2659-4eea-a94d-cfbe058746b6', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.id || ''
        },
        body: JSON.stringify({ name: userName })
      });
      
      if (response.ok) {
        const data = await response.json();
        setOriginalName(data.name);
        setIsEditingName(false);
      }
    } catch (error) {
      console.error('Failed to save user name:', error);
      alert('Не удалось сохранить имя');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" size={24} />
            Профиль
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Имя</Label>
              {!isEditingName ? (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={isLoadingName ? 'Загрузка...' : (userName || 'Имя не задано')}
                    disabled
                    className="flex-1"
                  />
                  <Button
                    onClick={() => setIsEditingName(true)}
                    variant="outline"
                    size="icon"
                  >
                    <Icon name="Pencil" size={16} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Введите имя"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveName}
                      size="sm"
                      className="flex-1"
                    >
                      Сохранить
                    </Button>
                    <Button
                      onClick={() => {
                        setUserName(originalName);
                        setIsEditingName(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">Пароль</Label>
              {!isEditingPassword ? (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value="••••••••"
                    disabled
                    type="password"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => setIsEditingPassword(true)}
                    variant="outline"
                    size="icon"
                  >
                    <Icon name="Pencil" size={16} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  <div>
                    <Label htmlFor="oldPassword" className="text-xs text-muted-foreground">Текущий пароль</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Введите текущий пароль"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-xs text-muted-foreground">Новый пароль</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Введите новый пароль"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">Подтвердите пароль</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Повторите новый пароль"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (newPassword !== confirmPassword) {
                          alert('Пароли не совпадают');
                          return;
                        }
                        setIsEditingPassword(false);
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      size="sm"
                      className="flex-1"
                    >
                      Сохранить
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingPassword(false);
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Info" size={24} />
            О приложении
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">FlowKat</strong> — персональный трекер энергии и настроения</p>
          <p>Версия: 1.0.0</p>
          <p>Всего записей: {totalEntries}</p>
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Icon name="LogOut" size={24} />
            Выход из аккаунта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Вы уверены, что хотите выйти? Все несохраненные данные будут потеряны.
          </p>
          <Button 
            onClick={logout}
            variant="destructive"
            size="lg"
            className="w-full"
          >
            <Icon name="LogOut" size={20} className="mr-2" />
            Выйти
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;