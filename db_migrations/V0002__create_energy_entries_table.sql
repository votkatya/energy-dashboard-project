-- Создаём таблицу для хранения записей энергии
CREATE TABLE IF NOT EXISTS energy_entries (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 4),
    thoughts TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаём индекс для быстрого поиска по дате
CREATE INDEX idx_energy_entries_date ON energy_entries(entry_date DESC);

-- Создаём индекс для фильтрации по оценке
CREATE INDEX idx_energy_entries_score ON energy_entries(score);

-- Добавляем уникальное ограничение на дату (одна запись в день)
CREATE UNIQUE INDEX idx_energy_entries_unique_date ON energy_entries(entry_date);