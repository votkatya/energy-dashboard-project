# KatFlow 💫
Приложение для отслеживания уровня энергии и предотвращения выгорания

## 🚀 Особенности

- 📊 Визуализация уровня энергии за период
- 📅 Календарь с историями
- 📈 Статистика и тренды
- 🎯 Целеполагание
- 📱 Адаптивный дизайн
- ⚡ Автообновление данных

## 🛠 Технологии

- **Frontend**: React 18 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **Routing**: React Router
- **Build**: Vite

## 📦 Установка

```bash
# Установка зависимостей
npm install

# Копирование переменных окружения
cp .env.example .env

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Превью продакшен сборки
npm run preview
```

## ⚙️ Конфигурация

### Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
# URL API для получения данных
VITE_API_URL=https://functions.poehali.dev/your-function-id

# URL Google Sheets (опционально)
VITE_GOOGLE_SHEET_URL=

# Флаги функциональности
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

## 🏗 Архитектура проекта

```
src/
├── components/        # UI компоненты
│   ├── ui/           # Базовые компоненты shadcn/ui
│   ├── EnergyCalendar.tsx
│   ├── EnergyStats.tsx
│   └── EnergyTrends.tsx
├── hooks/            # Custom hooks
│   └── useEnergyData.ts
├── lib/              # Утилиты и константы
│   ├── constants.ts
│   ├── energyUtils.ts
│   └── utils.ts
└── pages/            # Страницы
    └── Index.tsx
```

## 🎨 Кастомизация

### Цветовая схема

Цвета энергии можно настроить в `tailwind.config.ts`:

```typescript
colors: {
  energy: {
    low: 'hsl(var(--energy-low))',
    'medium-low': 'hsl(var(--energy-medium-low))',
    neutral: 'hsl(var(--energy-neutral))',
    good: 'hsl(var(--energy-good))',
    excellent: 'hsl(var(--energy-excellent))'
  }
}
```

### Цели и периоды

Настройте цели и периоды в `src/lib/constants.ts`:

```typescript
export const MONTHLY_GOAL = 4.0;
export const TIME_PERIOD_LIMITS = {
  '3days': 3,
  'week': 7,
  'month': 30,
  'year': 365,
};
```

## 🧪 Разработка

### Структура данных

```typescript
interface EnergyEntry {
  date: string;        // DD.MM.YYYY
  score: number;       // 1-5
  thoughts: string;
  category: string;
  week: string;
  month: string;
}
```

### API Response

```json
{
  "entries": [...],
  "stats": {
    "good": 8,
    "neutral": 3,
    "bad": 1,
    "average": 4.1,
    "total": 12
  }
}
```

## 🐛 Известные проблемы

- [ ] Динамические классы Tailwind не работают (используются фиксированные классы)
- [ ] Нет офлайн режима (работает только с активным интернетом)

## 🚧 Roadmap

- [ ] Офлайн поддержка с Service Worker
- [ ] Экспорт данных в CSV/PDF
- [ ] Уведомления и напоминания
- [ ] Темная тема
- [ ] Интеграция с календарем
- [ ] Мобильное приложение

## 📄 Лицензия

MIT

## 👤 Автор

KatFlow © 2025
