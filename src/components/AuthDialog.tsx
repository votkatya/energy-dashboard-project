import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/lib/auth';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: () => void;
}

export default function AuthDialog({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await authService.register(email, password, name);
      } else {
        await authService.login(email, password);
      }
      onAuthSuccess();
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Вход' : 'Регистрация'}</DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Войдите в свой аккаунт для доступа к данным' 
              : 'Создайте аккаунт для отслеживания энергии'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required={mode === 'register'}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <>
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-primary hover:underline"
                >
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline"
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
