import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { HeroBackground } from '@/components/ui/shape-landing-hero';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [telegram, setTelegram] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(telegram, password);
      } else {
        await register(telegram, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Что-то пошло не так');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-radial from-background via-background to-primary/5">
      <HeroBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mx-auto mb-4"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl glow-primary">
                  <Icon name="Activity" size={40} className="text-primary-foreground" />
                </div>
              </motion.div>
              <CardTitle className="text-4xl font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                KatFlow
              </CardTitle>
              <CardDescription className="text-lg font-medium"></CardDescription>
              <CardDescription className="text-sm mt-1">
                {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="glass-effect"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="telegram">Имя в Telegram</Label>
                  <Input
                    id="telegram"
                    type="text"
                    placeholder="@username"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    required
                    className="glass-effect"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="glass-effect"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Icon name={isLogin ? "LogIn" : "UserPlus"} className="mr-2" size={20} />
                      {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;