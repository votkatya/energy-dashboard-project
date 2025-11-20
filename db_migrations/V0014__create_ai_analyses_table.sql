CREATE TABLE IF NOT EXISTS t_p45717398_energy_dashboard_pro.ai_analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    analysis_text TEXT NOT NULL,
    total_entries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_analyses_user_id ON t_p45717398_energy_dashboard_pro.ai_analyses(user_id);

COMMENT ON TABLE t_p45717398_energy_dashboard_pro.ai_analyses IS 'AI-анализы энергии пользователей (один актуальный на пользователя)';
COMMENT ON COLUMN t_p45717398_energy_dashboard_pro.ai_analyses.user_id IS 'ID пользователя';
COMMENT ON COLUMN t_p45717398_energy_dashboard_pro.ai_analyses.analysis_text IS 'Текст анализа от ChatGPT';
COMMENT ON COLUMN t_p45717398_energy_dashboard_pro.ai_analyses.total_entries IS 'Количество записей в момент анализа';
COMMENT ON COLUMN t_p45717398_energy_dashboard_pro.ai_analyses.created_at IS 'Дата первого создания анализа';
COMMENT ON COLUMN t_p45717398_energy_dashboard_pro.ai_analyses.updated_at IS 'Дата последнего обновления анализа';