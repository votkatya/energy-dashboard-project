-- Возвращаем все данные демо-пользователя в 2026 год
-- Т.к. на сервере БД CURRENT_DATE = 2026-02-07

UPDATE energy_entries 
SET entry_date = entry_date + INTERVAL '1 year'
WHERE user_id = 7 
AND entry_date >= '2025-01-01' 
AND entry_date < '2026-01-01';