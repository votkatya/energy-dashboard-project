import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#1a2318] text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#c8ff00] border-t-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
          <span className="text-2xl font-bold text-[#c8ff00]">FlowKat</span>
        </div>
        <Link to="/login">
          <Button className="bg-[#c8ff00] text-[#1a2318] hover:bg-[#b3e600] font-semibold">
            Войти
          </Button>
        </Link>
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-center text-6xl">
            ТРЕКЕР ЭНЕРГИИ<br />
            <span className="text-[#c8ff00] text-4xl">С ПЕРСОНАЛЬНЫМИ РЕКОМЕНДАЦИЯМИ</span>
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-300 mb-12">
            3 минуты в день, чтобы чувствовать себя лучше
          </p>

        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c8ff00] rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-xs font-bold">
                ЭНЕРГИЯ НА НУЛЕ?
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-xs font-bold">
                НИЧЕГО НЕ ХОЧЕТСЯ?
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-xs font-bold">
                ПОСЛЕ ОТДЫХА СНОВА НУЖЕН ОТДЫХ?
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-xs font-bold">
                ПРОСНУЛСЯ И УЖЕ УСТАЛ?
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://cdn.poehali.dev/files/Y9vvdVXN-Photoroom.png"
                alt="Усталость"
                className="w-full max-w-md"
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              ТЫ ОТМЕЧАЕШЬ СВОЁ СОСТОЯНИЕ — <span className="text-[#c8ff00]">FLOWKAT ДЕЛАЕТ ОСТАЛЬНОЕ</span>
            </h2>
            <p className="text-xl text-gray-300">Всего 3 минуты в день и ты понимаешь:</p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>какие дни тебя истощают</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>что возвращает ресурс</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>где скрыты утечки энергии</span>
              </li>
            </ul>
            <p className="text-xl font-bold">Это не контроль. Это забота.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            <span className="text-[#c8ff00]">ВИЗУАЛИЗИРУЕТ ЭНЕРГИЮ</span> И ПОМОГАЕТ ВОВРЕМЯ СКОРРЕКТИРОВАТЬ КУРС
          </h2>
          <div className="space-y-6 mb-12">
            <p className="text-xl text-gray-300">Ты видишь:</p>
            <ul className="space-y-4 text-lg text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>где именно ты теряешь энергию</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>что повторяется из недели в неделю</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>какие дни реально восстанавливают</span>
              </li>
            </ul>
            <p className="text-xl font-bold mt-8">
              Перестаёшь угадывать —<br />
              и начинаешь управлять ресурсом.
            </p>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://cdn.poehali.dev/files/4%20%D1%81%D0%BB%D0%B0%D0%B9%D0%B4.png"
              alt="FlowKat Analytics"
              className="max-w-md w-full rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#c8ff00] rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            ТВОИ ДАННЫЕ ПРЕВРАЩАЮТСЯ В <span className="text-[#c8ff00]">ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ</span>
          </h2>
          <div className="space-y-6 mb-12">
            <p className="text-xl text-gray-300">Анализирует твои эмоции и энергию<br />и показывает:</p>
            <ul className="space-y-4 text-lg text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>реальные причины усталости</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>повторяющиеся сценарии</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] text-2xl">•</span>
                <span>зоны риска</span>
              </li>
            </ul>
            <p className="text-xl font-bold mt-8">Не догадки. А точные рекомендации для тебя.</p>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://cdn.poehali.dev/files/5%20%D1%81%D0%BB%D0%B0%D0%B9%D0%B4.png"
              alt="FlowKat Recommendations"
              className="max-w-md w-full rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="p-12 md:p-16 bg-gradient-to-br from-[#c8ff00]/20 to-[#c8ff00]/5 border-[#c8ff00]/30 backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Начни управлять энергией<br />уже сегодня
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Всего 3 минуты в день для лучшей версии себя
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-[#c8ff00] text-[#1a2318] hover:bg-[#b3e600] font-bold text-lg px-12 py-7">
                Начать бесплатно
              </Button>
            </Link>
            <p className="text-sm text-gray-400 mt-6">
              Регистрация за 30 секунд • Без кредитной карты
            </p>
          </Card>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-12 border-t border-white/10 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-[#c8ff00] border-t-transparent"></div>
            <span className="font-bold text-[#c8ff00]">FlowKat</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 FlowKat. Управляй энергией, меняй жизнь.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;