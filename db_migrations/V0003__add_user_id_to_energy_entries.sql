-- Добавляем колонку user_id в таблицу energy_entries
ALTER TABLE t_p45717398_energy_dashboard_pro.energy_entries 
ADD COLUMN user_id INTEGER;

-- Создаём внешний ключ на таблицу users
ALTER TABLE t_p45717398_energy_dashboard_pro.energy_entries 
ADD CONSTRAINT fk_energy_entries_user 
FOREIGN KEY (user_id) REFERENCES t_p45717398_energy_dashboard_pro.users(id);

-- Создаём индекс для быстрого поиска записей пользователя
CREATE INDEX idx_energy_entries_user_date 
ON t_p45717398_energy_dashboard_pro.energy_entries(user_id, entry_date DESC);

-- Создаём уникальный индекс: один пользователь - одна запись в день
CREATE UNIQUE INDEX idx_energy_entries_unique_user_date 
ON t_p45717398_energy_dashboard_pro.energy_entries(user_id, entry_date) 
WHERE user_id IS NOT NULL;