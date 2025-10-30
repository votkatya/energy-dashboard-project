-- Add notification settings columns to users table
ALTER TABLE t_p45717398_energy_dashboard_pro.users 
ADD COLUMN notification_settings JSONB DEFAULT '{
  "dailyReminder": false,
  "dailyReminderTime": "21:00",
  "burnoutWarnings": true,
  "achievements": true,
  "weeklyReport": false
}'::jsonb,
ADD COLUMN telegram_chat_id BIGINT NULL;