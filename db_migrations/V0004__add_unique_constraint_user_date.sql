-- Добавляем уникальный constraint для предотвращения дублей записей на одну дату
ALTER TABLE t_p45717398_energy_dashboard_pro.energy_entries 
ADD CONSTRAINT energy_entries_user_date_unique UNIQUE (user_id, entry_date);