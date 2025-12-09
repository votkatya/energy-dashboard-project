import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AppScreenCarousel from "@/components/AppScreenCarousel";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#c8ff00]/[0.05] via-transparent to-[#c8ff00]/[0.05] blur-3xl pointer-events-none" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-[#c8ff00]/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-[#c8ff00]/[0.12]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#c8ff00]/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-[#c8ff00]/[0.1]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-[#c8ff00]/[0.12]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-transparent to-[#0a0f0a]/80 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0f0a]/80 border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
              alt="FlowKat"
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-[#c8ff00]">FlowKat</span>
          </div>
          <Link to="/login">
            <Button className="bg-[#c8ff00] text-[#0a0f0a] hover:bg-[#b3e600] font-bold rounded-full px-6">
              Войти
            </Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-28 pb-16 md:pt-32 md:pb-20 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h1 className="font-bold text-white">
            <div className="text-4xl md:text-7xl lg:text-8xl leading-tight tracking-tight">
              ТРЕКЕР ЭНЕРГИИ
            </div>
            <div className="text-xl md:text-3xl lg:text-4xl leading-tight tracking-wide mt-2">
              С ПЕРСОНАЛЬНЫМИ РЕКОМЕНДАЦИЯМИ
            </div>
          </h1>
          <p className="text-lg md:text-xl text-white max-w-xl mx-auto">
            3 минуты в день, чтобы чувствовать себя лучше
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-[#c8ff00] text-[#0a0f0a] hover:bg-[#b3e600] text-lg px-10 py-6 font-bold rounded-full mt-4 shadow-xl shadow-[#c8ff00]/20 transition-all hover:scale-105">
              Начать бесплатно
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#c8ff00]/30 transition-colors">
              <h2 className="md:text-xl font-bold mb-6 leading-tight text-lg">
                ТЫ ОТМЕЧАЕШЬ СВОЁ СОСТОЯНИЕ — <span className="text-[#c8ff00]">FLOWKAT ДЕЛАЕТ ОСТАЛЬНОЕ</span>
              </h2>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm leading-tight">Всего 3 минуты в день и ты понимаешь:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>какие дни тебя истощают</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>что возвращает ресурс</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>где скрыты утечки энергии</span>
                  </li>
                </ul>
                <p className="text-sm font-bold text-[#c8ff00] pt-2 leading-tight">Это не контроль. Это забота.</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#c8ff00]/30 transition-colors">
              <h2 className="md:text-xl font-bold mb-6 leading-tight text-lg uppercase">
                Ты видишь, куда уходит твоя энергия — <span className="text-[#c8ff00]">и можешь это менять</span>
              </h2>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm leading-tight">Ты видишь:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>где именно ты теряешь энергию</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>что повторяется из недели в неделю</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>какие дни реально восстанавливают</span>
                  </li>
                </ul>
                <p className="text-sm font-bold text-[#c8ff00] pt-2 leading-tight">Перестаёшь угадывать — и начинаешь управлять ресурсом.</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#c8ff00]/30 transition-colors">
              <h2 className="md:text-xl font-bold mb-6 leading-tight text-lg">
                ТВОИ ДАННЫЕ ПРЕВРАЩАЮТСЯ В ПЕРСОНАЛЬНЫЕ <span className="text-[#c8ff00]">РЕКОМЕНДАЦИИ</span>
              </h2>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm leading-tight">Анализирует твои эмоции и энергию и показывает:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>реальные причины усталости</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>повторяющиеся сценарии</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm leading-tight">
                    <span className="text-[#c8ff00] flex-shrink-0">•</span>
                    <span>зоны риска</span>
                  </li>
                </ul>
                <p className="text-sm font-bold text-[#c8ff00] pt-2 leading-tight">Не догадки. А точные рекомендации для тебя.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 relative z-10 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 px-4">Посмотри, как работает приложение</h2>
          <p className="text-gray-400 text-lg"></p>
        </div>
        <AppScreenCarousel />
      </section>

      <section className="container mx-auto px-4 py-20 md:py-32 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 relative z-10">
          <h2 className="md:text-6xl font-bold mb-6 leading-tight text-2xl">Начни заботиться о себе уже сегодня</h2>
          <p className="text-gray-300 mb-10 text-base">всего 3 минуты в день</p>
          <Link to="/login">
            <Button size="lg" className="bg-[#c8ff00] text-[#0a0f0a] hover:bg-[#b3e600] text-lg px-10 py-7 font-bold rounded-full shadow-xl shadow-[#c8ff00]/30 transition-all hover:scale-105">Начать бесплатно</Button>
          </Link>
          <p className="text-sm text-gray-400 mt-6"></p>
        </div>
      </section>

      <footer className="border-t border-white/10 mt-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
                  alt="FlowKat"
                  className="w-8 h-8"
                />
                <span className="font-bold text-[#c8ff00] text-xl">FlowKat</span>
              </div>
              <p className="text-sm text-gray-400">
                Трекер энергии с персональными рекомендациями
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Продукт</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-[#c8ff00] transition-colors">Возможности</a></li>
                <li><a href="#how-it-works" className="hover:text-[#c8ff00] transition-colors">Как работает</a></li>
                <li><Link to="/login" className="hover:text-[#c8ff00] transition-colors">Начать бесплатно</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#c8ff00] transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-[#c8ff00] transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-[#c8ff00] transition-colors">Контакты</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Соцсети</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c8ff00]/20 border border-white/10 hover:border-[#c8ff00]/30 flex items-center justify-center transition-all">
                  <Icon name="Instagram" size={20} className="text-gray-400 hover:text-[#c8ff00]" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c8ff00]/20 border border-white/10 hover:border-[#c8ff00]/30 flex items-center justify-center transition-all">
                  <Icon name="Twitter" size={20} className="text-gray-400 hover:text-[#c8ff00]" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c8ff00]/20 border border-white/10 hover:border-[#c8ff00]/30 flex items-center justify-center transition-all">
                  <Icon name="Facebook" size={20} className="text-gray-400 hover:text-[#c8ff00]" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2025 FlowKat. Все права защищены.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[#c8ff00] transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-[#c8ff00] transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;