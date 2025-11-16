-- Добавляем колонку tags в energy_entries для хранения тегов в формате JSONB
ALTER TABLE t_p45717398_energy_dashboard_pro.energy_entries 
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Создаём индекс для быстрого поиска по тегам
CREATE INDEX IF NOT EXISTS idx_energy_entries_tags ON t_p45717398_energy_dashboard_pro.energy_entries USING GIN (tags);

-- Создаём таблицу для денормализованной аналитики тегов (для ML и нейросетей)
CREATE TABLE IF NOT EXISTS t_p45717398_energy_dashboard_pro.tag_analytics (
  id SERIAL PRIMARY KEY,
  entry_id INTEGER NOT NULL,
  tag VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  entry_date DATE NOT NULL,
  user_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрой аналитики
CREATE INDEX IF NOT EXISTS idx_tag_analytics_user_tag ON t_p45717398_energy_dashboard_pro.tag_analytics(user_id, tag);
CREATE INDEX IF NOT EXISTS idx_tag_analytics_tag_score ON t_p45717398_energy_dashboard_pro.tag_analytics(tag, score);
CREATE INDEX IF NOT EXISTS idx_tag_analytics_date ON t_p45717398_energy_dashboard_pro.tag_analytics(entry_date);
CREATE INDEX IF NOT EXISTS idx_tag_analytics_entry_id ON t_p45717398_energy_dashboard_pro.tag_analytics(entry_id);
