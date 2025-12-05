import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: "Target",
      title: "Трекинг привычек",
      description: "Отслеживайте свои привычки каждый день и следите за прогрессом в реальном времени"
    },
    {
      icon: "TrendingUp",
      title: "Аналитика и прогнозы",
      description: "ИИ анализирует ваши данные и предсказывает результаты на неделю вперёд"
    },
    {
      icon: "Zap",
      title: "Уровень энергии",
      description: "Отмечайте уровень энергии и находите оптимальные паттерны для продуктивности"
    },
    {
      icon: "Heart",
      title: "Защита от выгорания",
      description: "Система предупредит вас о риске выгорания и порекомендует отдых"
    },
    {
      icon: "Bell",
      title: "Умные напоминания",
      description: "Настройте персональные напоминания для каждой привычки"
    },
    {
      icon: "Award",
      title: "Стрики и достижения",
      description: "Мотивация через серии успешных дней и систему достижений"
    }
  ];

  const steps = [
    {
      icon: "Plus",
      title: "Добавь привычку",
      description: "Создай свою первую привычку за 10 секунд"
    },
    {
      icon: "Check",
      title: "Отмечай каждый день",
      description: "Быстрая отметка выполнения одним кликом"
    },
    {
      icon: "BarChart3",
      title: "Смотри прогресс",
      description: "Анализируй статистику и тренды"
    },
    {
      icon: "Trophy",
      title: "Достигай целей",
      description: "Получай инсайты и развивай привычки"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="Sparkles" size={20} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">HabitFlow</span>
        </div>
        <Link to="/login">
          <Button variant="outline">Войти</Button>
        </Link>
      </header>

      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Твой личный трекер{" "}
            <span className="text-primary">привычек</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Формируй полезные привычки, отслеживай прогресс и получай персональные рекомендации на основе ИИ-аналитики
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                <Icon name="Rocket" size={20} className="mr-2" />
                Начать бесплатно
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                Войти в аккаунт
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
          <p className="text-muted-foreground text-lg">Четыре простых шага к успеху</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name={step.icon} size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 bg-card/30 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Возможности приложения</h2>
          <p className="text-muted-foreground text-lg">Всё необходимое для эффективного управления привычками</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all hover:scale-105 animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon name={feature.icon} size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="p-12 md:p-16 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Начни меняться уже сегодня
            </h2>
            <p className="text-lg text-muted-foreground">
              Присоединяйся к тысячам пользователей, которые достигают своих целей с HabitFlow
            </p>
            <Link to="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                <Icon name="Sparkles" size={20} className="mr-2" />
                Начать бесплатно
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Регистрация за 30 секунд • Без кредитной карты
            </p>
          </div>
        </Card>
      </section>

      <footer className="container mx-auto px-4 py-12 border-t border-border/50 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Sparkles" size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold">HabitFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 HabitFlow. Формируй привычки, меняй жизнь.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
