CREATE TABLE IF NOT EXISTS t_p45717398_energy_dashboard_pro.monthly_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p45717398_energy_dashboard_pro.users(id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    goal_score DECIMAL(3,1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, year, month)
);

CREATE INDEX idx_monthly_goals_user_date ON t_p45717398_energy_dashboard_pro.monthly_goals(user_id, year, month);
