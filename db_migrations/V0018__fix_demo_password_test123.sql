-- Обновляем пароль для демо-пользователя test@test на test123
-- Формула: sha256('test123' + '0123456789abcdef0123456789abcdef')
-- Результат: 596c4e54e8715d6dce8caa553fcbde37b17b94c9cf46e5ca1f8dbcc78e17e4ee
UPDATE t_p45717398_energy_dashboard_pro.users 
SET password_hash = '0123456789abcdef0123456789abcdef::596c4e54e8715d6dce8caa553fcbde37b17b94c9cf46e5ca1f8dbcc78e17e4ee'
WHERE email = 'test@test';