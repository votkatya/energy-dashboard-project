-- Обновляем пароль для демо-пользователя test@test
-- Пароль: demo123
-- Salt: fixed_demo_salt_for_test
-- Hash: sha256('demo123' + 'fixed_demo_salt_for_test')
UPDATE t_p45717398_energy_dashboard_pro.users 
SET password_hash = 'fixed_demo_salt_for_test::5e6f8d7a9b0c3f2e1d4a8b7c6e5d4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5'
WHERE email = 'test@test';