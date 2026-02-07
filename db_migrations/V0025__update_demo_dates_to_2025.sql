-- Обновляем данные демо-пользователя с 2026 на 2025 год
-- Это нужно чтобы запросы "последние 14 дней" работали корректно

UPDATE energy_entries 
SET entry_date = entry_date - INTERVAL '1 year'
WHERE user_id = 7 
AND entry_date >= '2026-01-01' 
AND entry_date < '2027-01-01';