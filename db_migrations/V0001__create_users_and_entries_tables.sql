-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса на email для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Создание таблицы записей энергии
CREATE TABLE IF NOT EXISTS energy_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    thoughts TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_energy_entries_user_id ON energy_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_entries_date ON energy_entries(date);
CREATE INDEX IF NOT EXISTS idx_energy_entries_user_date ON energy_entries(user_id, date DESC);