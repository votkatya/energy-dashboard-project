ALTER TABLE t_p45717398_energy_dashboard_pro.energy_entries 
DROP CONSTRAINT IF EXISTS energy_entries_score_check;

ALTER TABLE t_p45717398_energy_dashboard_pro.energy_entries 
ADD CONSTRAINT energy_entries_score_check CHECK (score >= 0 AND score <= 5);
