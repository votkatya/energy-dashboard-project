import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0f0a]/80 border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
              alt="FlowKat"
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-[#c8ff00]">FlowKat</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Политика конфиденциальности
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">1. Общие положения</h2>
            <p className="text-gray-300 leading-relaxed">
              Щербакова Екатерина Станиславовна (далее — Оператор) обрабатывает персональные данные пользователей сайта{" "}
              <a href="https://flowkat.ru" className="text-[#c8ff00] hover:underline">https://flowkat.ru</a> в соответствии с Федеральным законом №152-ФЗ «О персональных данных».
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Главная цель — защита ваших прав, безопасности и конфиденциальности личной информации.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Настоящая политика применяется ко всем данным, которые Оператор получает от пользователей сайта FlowKat.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">2. Какие данные мы собираем</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Мы можем обрабатывать следующие персональные данные:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>фамилия, имя, отчество</li>
              <li>адрес электронной почты</li>
              <li>номер телефона</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">3. Зачем мы собираем данные</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Персональные данные используются для:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>предоставления доступа к сервисам и материалам сайта;</li>
              <li>связи с пользователем;</li>
              <li>улучшения качества сервиса.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">4. Как обрабатываются данные</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Мы можем выполнять следующие действия с данными:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>сбор и хранение;</li>
              <li>обновление и уточнение;</li>
              <li>использование;</li>
              <li>обезличивание;</li>
              <li>удаление и уничтожение.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Данные обрабатываются как автоматически, так и без использования автоматических средств.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">5. Передача данных третьим лицам</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Персональные данные не передаются третьим лицам, за исключением:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>требований законодательства РФ;</li>
              <li>вашего прямого согласия;</li>
              <li>необходимости исполнения договора.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Данные, переданные сторонним сервисам (платежные системы, сервисы связи и др.), обрабатываются по их собственным политикам конфиденциальности. Оператор не несёт ответственности за их действия.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">6. Срок хранения</h2>
            <p className="text-gray-300 leading-relaxed">
              Данные хранятся только столько времени, сколько необходимо для целей обработки или в соответствии с требованиями закона.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">7. Ваши права</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Вы имеете право:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>узнать, какие данные о вас хранятся;</li>
              <li>потребовать их исправление или удаление;</li>
              <li>отозвать согласие на обработку персональных данных;</li>
              <li>подать жалобу в уполномоченные органы или суд.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Для этого вы можете написать на почту:{" "}
              <a href="mailto:470394272@mail.ru" className="text-[#c8ff00] hover:underline">
                470394272@mail.ru
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">8. Обязанности пользователя</h2>
            <p className="text-gray-300 leading-relaxed">
              Пользователь обязан предоставлять достоверные данные и уведомлять об их изменении.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">9. Безопасность данных</h2>
            <p className="text-gray-300 leading-relaxed">
              Оператор принимает все необходимые меры для защиты персональных данных от утечки, несанкционированного доступа и неправомерного использования.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">10. Конфиденциальность</h2>
            <p className="text-gray-300 leading-relaxed">
              Персональные данные не раскрываются третьим лицам без согласия пользователя, кроме случаев, предусмотренных законом.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">11. Отзыв согласия</h2>
            <p className="text-gray-300 leading-relaxed">
              Вы можете в любой момент отозвать согласие на обработку персональных данных, направив письмо на:{" "}
              <a href="mailto:470394272@mail.ru" className="text-[#c8ff00] hover:underline">
                470394272@mail.ru
              </a>{" "}
              с темой «Отзыв согласия на обработку персональных данных».
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">12. Изменения политики</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Политика может обновляться. Актуальная версия всегда доступна по адресу:{" "}
              <a href="https://flowkat.ru/privacy" className="text-[#c8ff00] hover:underline">
                https://flowkat.ru/privacy
              </a>
            </p>
            <p className="text-gray-300 leading-relaxed">
              Политика действует бессрочно до момента её замены новой версией.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link to="/">
            <Button className="bg-[#c8ff00] text-[#0a0f0a] hover:bg-[#b3e600] font-bold rounded-full px-8">
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 FlowKat. Все права защищены.
            </p>
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-[#c8ff00] transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
