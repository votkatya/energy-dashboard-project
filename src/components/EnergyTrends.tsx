import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const EnergyTrends = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-l-4 border-l-energy-excellent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" size={24} className="text-energy-excellent" />
            Общий тренд
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-r from-energy-excellent/20 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Средний балл за месяц</span>
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-4xl font-heading font-bold text-energy-excellent">4.2</div>
              <p className="text-sm text-muted-foreground mt-2">
                +0.4 по сравнению с прошлым месяцем
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-energy-excellent/10 to-transparent border border-energy-excellent/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">😊</span>
                  <div className="text-2xl font-heading font-bold text-energy-excellent">71%</div>
                </div>
                <p className="text-sm text-muted-foreground">Хорошие дни</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-energy-neutral/10 to-transparent border border-energy-neutral/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">😐</span>
                  <div className="text-2xl font-heading font-bold text-energy-neutral">24%</div>
                </div>
                <p className="text-sm text-muted-foreground">Нейтральные дни</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={24} />
            Паттерны и наблюдения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-medium mb-1">Лучшие дни недели</p>
                  <p className="text-sm text-muted-foreground">
                    Выходные показывают стабильно высокий уровень энергии (4.8 средний балл)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-l-accent">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium mb-1">Тренд улучшения</p>
                  <p className="text-sm text-muted-foreground">
                    За последние 3 месяца количество хороших дней выросло на 15%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-energy-good/10 to-transparent border-l-4 border-l-energy-good">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-medium mb-1">Самый продуктивный период</p>
                  <p className="text-sm text-muted-foreground">
                    Неделя 06.10 - 13.10 с средним баллом 4.4
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <p className="text-sm">Продолжай поддерживать активность в выходные дни</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <p className="text-sm">Обрати внимание на понедельники - в этот день энергия часто ниже</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <p className="text-sm">Старайся записывать заметки о днях - это помогает выявить паттерны</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyTrends;