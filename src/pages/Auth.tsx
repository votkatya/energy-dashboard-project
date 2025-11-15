import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
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
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Что-то пошло не так');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #94AF00 0%, #4A5700 50%, #0A0D00 100%)'
    }}>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div 
            className="rounded-3xl shadow-2xl px-12 py-10"
            style={{
              backgroundColor: 'rgba(23, 30, 38, 0.5)',
              border: '1px solid #4D5463',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-center pb-10">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mx-auto mb-8"
              >
                <img 
                  src="https://cdn.poehali.dev/files/1661565a-cbc8-49e4-b742-bae847b91466.png" 
                  alt="FlowKat Logo"
                  className="w-20 h-20 mx-auto"
                />
              </motion.div>
              <h1 className="text-4xl font-heading font-bold" style={{ color: '#94AF00' }}>
                FlowKat
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-sans">Имя</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="h-12 rounded-full text-white placeholder:text-gray-400 font-sans"
                    style={{
                      backgroundColor: '#2C333B',
                      border: '1px solid #4D5463'
                    }}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-sans text-base">Почта</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-full text-white placeholder:text-gray-400 font-sans text-base"
                  style={{
                    backgroundColor: '#2C333B',
                    border: '1px solid #4D5463'
                  }}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-sans text-base">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-14 rounded-full text-white placeholder:text-gray-400 font-sans text-base"
                  style={{
                    backgroundColor: '#2C333B',
                    border: '1px solid #4D5463'
                  }}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-sans"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-full text-black font-bold text-lg font-sans mt-8"
                size="lg"
                disabled={isLoading}
                style={{
                  backgroundColor: '#94AF00',
                  border: 'none'
                }}
              >
                {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-white hover:text-gray-300 transition-colors text-base font-sans"
                >
                  {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;