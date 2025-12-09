import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
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

      <section className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-28 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c8ff00] rounded-full blur-[150px] opacity-10"></div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-[#c8ff00]/10 border border-[#c8ff00]/20 text-[#c8ff00] text-sm font-semibold">
              Трекер энергии нового поколения
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            ТРЕКЕР ЭНЕРГИИ<br />
            С ПЕРСОНАЛЬНЫМИ<br />
            <span className="text-[#c8ff00]">РЕКОМЕНДАЦИЯМИ</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            3 минуты в день, чтобы чувствовать себя лучше
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-[#c8ff00] text-[#0a0f0a] hover:bg-[#b3e600] text-lg px-10 py-7 font-bold rounded-full mt-4 shadow-xl shadow-[#c8ff00]/20 transition-all hover:scale-105">
              Начать бесплатно
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c8ff00] rounded-full blur-[120px] opacity-10"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-white/95 text-[#0a0f0a] rounded-2xl px-5 py-4 text-sm font-bold rotate-[-2deg] shadow-lg hover:rotate-0 transition-transform">
                ЭНЕРГИЯ НА НУЛЕ?
              </div>
              <div className="bg-white/95 text-[#0a0f0a] rounded-2xl px-5 py-4 text-sm font-bold rotate-[1deg] shadow-lg hover:rotate-0 transition-transform">
                НИЧЕГО НЕ ХОЧЕТСЯ?
              </div>
              <div className="bg-white/95 text-[#0a0f0a] rounded-2xl px-5 py-4 text-xs font-bold rotate-[2deg] shadow-lg hover:rotate-0 transition-transform">
                ПОСЛЕ ОТДЫХА СНОВА НУЖЕН ОТДЫХ?
              </div>
              <div className="bg-white/95 text-[#0a0f0a] rounded-2xl px-5 py-4 text-sm font-bold rotate-[-1deg] shadow-lg hover:rotate-0 transition-transform">
                ПРОСНУЛСЯ И УЖЕ УСТАЛ?
              </div>
            </div>
            <div className="text-center mt-16 bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10">
              <p className="text-7xl md:text-8xl font-bold mb-2 text-[#c8ff00]">59<span className="text-4xl">%</span></p>
              <p className="text-xl text-gray-400">человек испытывают</p>
              <p className="text-3xl font-bold mt-2">УСТАЛОСТЬ</p>
              <p className="text-sm text-gray-500 mt-3">*по данным журнала The Lancet</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              ТЫ ОТМЕЧАЕШЬ СВОЁ СОСТОЯНИЕ — <span className="text-[#c8ff00]">FLOWKAT ДЕЛАЕТ ОСТАЛЬНОЕ</span>
            </h2>
            <p className="text-xl text-gray-400">Всего 3 минуты в день и ты понимаешь:</p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-[#c8ff00]/30 transition-colors">
                <span className="text-[#c8ff00] text-2xl flex-shrink-0">•</span>
                <span className="text-lg">какие дни тебя истощают</span>
              </li>
              <li className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-[#c8ff00]/30 transition-colors">
                <span className="text-[#c8ff00] text-2xl flex-shrink-0">•</span>
                <span className="text-lg">что возвращает ресурс</span>
              </li>
              <li className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-[#c8ff00]/30 transition-colors">
                <span className="text-[#c8ff00] text-2xl flex-shrink-0">•</span>
                <span className="text-lg">где скрыты утечки энергии</span>
              </li>
            </ul>
            <p className="text-xl font-bold text-[#c8ff00] pt-4">Это не контроль. Это забота.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 text-center leading-tight">
            ВИЗУАЛИЗИРУЕТ ЭНЕРГИЮ<br />
            И ПОМОГАЕТ ВОВРЕМЯ<br />
            <span className="text-[#c8ff00]">СКОРРЕКТИРОВАТЬ КУРС</span>
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-[#c8ff00]/30 transition-colors">
              <h3 className="text-2xl font-bold mb-6 text-[#c8ff00]">Ты видишь:</h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-4">
                  <span className="text-[#c8ff00] flex-shrink-0">•</span>
                  <span>где именно ты теряешь энергию</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#c8ff00] flex-shrink-0">•</span>
                  <span>что повторяется из недели в неделю</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#c8ff00] flex-shrink-0">•</span>
                  <span>какие дни реально восстанавливают</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#c8ff00]/20 to-[#c8ff00]/5 backdrop-blur-sm rounded-3xl p-10 border border-[#c8ff00]/20">
              <p className="text-2xl font-bold leading-relaxed">
                Перестаёшь угадывать —<br />
                и начинаешь управлять ресурсом.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8ff00] rounded-full blur-[120px] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-20 text-center leading-tight">
            ТВОИ ДАННЫЕ ПРЕВРАЩАЮТСЯ<br />
            В ПЕРСОНАЛЬНЫЕ<br />
            <span className="text-[#c8ff00]">РЕКОМЕНДАЦИИ</span>
          </h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10">
              <h3 className="text-xl font-bold mb-6 text-[#c8ff00]">
                Анализирует твои эмоции и энергию<br />и показывает:
              </h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-4">
                  <span className="text-[#c8ff00] flex-shrink-0">•</span>
                  <span>реальные причины усталости</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#c8ff00] flex-shrink-0">•</span>
                  <span>повторяющиеся сценарии</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#c8ff00] flex-shrink-0">•</span>
                  <span>зоны риска</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#c8ff00]/20 to-[#c8ff00]/5 backdrop-blur-sm rounded-3xl p-10 border border-[#c8ff00]/20">
              <p className="text-2xl font-bold">
                Не догадки. А точные рекомендации для тебя.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-[#0f1610] rounded-3xl p-8 border border-[#c8ff00]/20 hover:border-[#c8ff00]/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Eye" className="text-[#c8ff00]" size={24} />
                  <h4 className="text-lg font-bold text-[#c8ff00]">Что держать под наблюдением</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  <span className="font-bold">Сон и его качество:</span> Обрати внимание на то, как качество сна влияет на твоё эмоциональное состояние и продуктивность. Возможно, стоит вести дневник сна.
                </p>
              </div>

              <div className="bg-[#0f1610] rounded-3xl p-8 border border-[#c8ff00]/20 hover:border-[#c8ff00]/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Sparkles" className="text-[#c8ff00]" size={24} />
                  <h4 className="text-lg font-bold text-[#c8ff00]">Одно маленькое действие на завтра</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  <span className="font-bold">Запланируй 15 минут на утреннюю прогулку:</span> Это поможет зарядиться энергией и настроиться на продуктивный день, а также добавит немного свежести в твою утреннюю рутину.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#c8ff00] rounded-full blur-[150px] opacity-10"></div>
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#c8ff00]/20 to-[#c8ff00]/5 rounded-3xl p-12 md:p-16 border border-[#c8ff00]/30 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Начни управлять энергией уже сегодня
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            3 минуты в день для лучшей версии себя
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-[#c8ff00] text-[#0a0f0a] hover:bg-[#b3e600] text-lg px-10 py-7 font-bold rounded-full shadow-xl shadow-[#c8ff00]/30 transition-all hover:scale-105">
              <Icon name="Sparkles" size={20} className="mr-2" />
              Начать бесплатно
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-6">
            Регистрация за 30 секунд • Без кредитной карты
          </p>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-12 border-t border-white/5 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
              alt="FlowKat"
              className="w-6 h-6"
            />
            <span className="font-semibold text-[#c8ff00]">FlowKat</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 FlowKat. Управляй энергией, меняй жизнь.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
