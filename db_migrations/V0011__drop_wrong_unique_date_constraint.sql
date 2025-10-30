-- Удаляем неправильное уникальное ограничение только на entry_date
-- Это позволит разным пользователям иметь записи на одну и ту же дату
DROP INDEX IF EXISTS t_p45717398_energy_dashboard_pro.idx_energy_entries_unique_date;