import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#2d3a1f] text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
            alt="FlowKat"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-[#c8ff00]">FlowKat</span>
        </div>
        <Link to="/login">
          <Button className="bg-[#c8ff00] text-[#2d3a1f] hover:bg-[#b3e600] font-bold">
            Войти
          </Button>
        </Link>
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            ТРЕКЕР ЭНЕРГИИ<br />
            С ПЕРСОНАЛЬНЫМИ РЕКОМЕНДАЦИЯМИ
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            3 минуты в день, чтобы чувствовать себя лучше
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-[#c8ff00] text-[#2d3a1f] hover:bg-[#b3e600] text-lg px-8 py-6 font-bold">
              Начать бесплатно
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c8ff00] rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/90 text-[#2d3a1f] rounded-2xl px-4 py-3 text-sm font-bold rotate-[-2deg]">
                ЭНЕРГИЯ НА НУЛЕ?
              </div>
              <div className="bg-white/90 text-[#2d3a1f] rounded-2xl px-4 py-3 text-sm font-bold rotate-[1deg]">
                НИЧЕГО НЕ ХОЧЕТСЯ?
              </div>
              <div className="bg-white/90 text-[#2d3a1f] rounded-2xl px-4 py-3 text-xs font-bold rotate-[2deg]">
                ПОСЛЕ ОТДЫХА СНОВА НУЖЕН ОТДЫХ?
              </div>
              <div className="bg-white/90 text-[#2d3a1f] rounded-2xl px-4 py-3 text-sm font-bold rotate-[-1deg]">
                ПРОСНУЛСЯ И УЖЕ УСТАЛ?
              </div>
            </div>
            <div className="text-center mt-12">
              <p className="text-7xl md:text-8xl font-bold mb-2">59<span className="text-4xl">%</span></p>
              <p className="text-xl text-gray-300">человек испытывают</p>
              <p className="text-3xl font-bold text-[#c8ff00]">УСТАЛОСТЬ</p>
              <p className="text-sm text-gray-400 mt-2">*по данным журнала The Lancet</p>
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
            ВИЗУАЛИЗИРУЕТ ЭНЕРГИЮ И ПОМОГАЕТ<br />
            ВОВРЕМЯ СКОРРЕКТИРОВАТЬ КУРС
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ты видишь:</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#c8ff00]">•</span>
                  <span>где именно ты теряешь энергию</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#c8ff00]">•</span>
                  <span>что повторяется из недели в неделю</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#c8ff00]">•</span>
                  <span>какие дни реально восстанавливают</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8">
              <p className="text-xl font-bold mb-4">
                Перестаёшь угадывать —<br />
                и начинаешь управлять ресурсом.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8ff00] rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
            ТВОИ ДАННЫЕ ПРЕВРАЩАЮТСЯ В<br />
            ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ
          </h2>

          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">Анализирует твои эмоции и энергию<br />и показывает:</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#c8ff00]">•</span>
                  <span>реальные причины усталости</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#c8ff00]">•</span>
                  <span>повторяющиеся сценарии</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#c8ff00]">•</span>
                  <span>зоны риска</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8">
              <p className="text-xl font-bold">
                Не догадки. А точные рекомендации для тебя.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-[#1a2314] rounded-3xl p-8 border border-white/10">
                <h4 className="text-lg font-bold mb-4 text-[#c8ff00]">Что держать под наблюдением</h4>
                <p className="text-gray-300 mb-6">
                  <span className="font-bold">Сон и его качество:</span> Обрати внимание на то, как качество сна влияет на твоё эмоциональное состояние и продуктивность. Возможно, стоит вести дневник сна.
                </p>
              </div>

              <div className="bg-[#1a2314] rounded-3xl p-8 border border-white/10">
                <h4 className="text-lg font-bold mb-4 text-[#c8ff00]">Одно маленькое действие на завтра</h4>
                <p className="text-gray-300">
                  <span className="font-bold">Запланируй 15 минут на утреннюю прогулку:</span> Это поможет зарядиться энергией и настроиться на продуктивный день, а также добавит немного свежести в твою утреннюю рутину.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#c8ff00]/20 to-[#c8ff00]/5 rounded-3xl p-12 md:p-16 border border-[#c8ff00]/20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Начни управлять энергией уже сегодня
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            3 минуты в день для лучшей версии себя
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-[#c8ff00] text-[#2d3a1f] hover:bg-[#b3e600] text-lg px-8 py-6 font-bold">
              <Icon name="Sparkles" size={20} className="mr-2" />
              Начать бесплатно
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-6">
            Регистрация за 30 секунд • Без кредитной карты
          </p>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-12 border-t border-white/10 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
              alt="FlowKat"
              className="w-6 h-6"
            />
            <span className="font-semibold text-[#c8ff00]">FlowKat</span>
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
