ALTER TABLE t_p45717398_energy_dashboard_pro.users 
ADD COLUMN IF NOT EXISTS last_weekly_report_sent timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_burnout_warning_sent timestamp with time zone;