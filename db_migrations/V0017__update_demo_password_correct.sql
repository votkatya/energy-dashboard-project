-- Обновляем пароль для демо-пользователя test@test
-- Пароль: demo123 
-- Salt: демо-соль для простоты
-- SHA256('demo123' + '0123456789abcdef0123456789abcdef') = 
UPDATE t_p45717398_energy_dashboard_pro.users 
SET password_hash = '0123456789abcdef0123456789abcdef::3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1'
WHERE email = 'test@test';