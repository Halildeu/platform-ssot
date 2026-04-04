-- Alert execution history and schedule execution log
-- Phase 2: Execution infrastructure for alert evaluation and scheduled report delivery

-- Alert execution events
CREATE TABLE IF NOT EXISTS alert_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES alert_rules(id) ON DELETE CASCADE,
  report_key VARCHAR(128) NOT NULL,
  field VARCHAR(128) NOT NULL,
  current_value NUMERIC,
  threshold NUMERIC,
  condition VARCHAR(32) NOT NULL,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  dedupe_key VARCHAR(256)
);

CREATE INDEX IF NOT EXISTS idx_alert_events_rule ON alert_events(rule_id);
CREATE INDEX IF NOT EXISTS idx_alert_events_report ON alert_events(report_key);
CREATE INDEX IF NOT EXISTS idx_alert_events_triggered ON alert_events(triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_events_dedupe ON alert_events(dedupe_key);

-- Extend alert_rules with execution tracking
ALTER TABLE alert_rules ADD COLUMN IF NOT EXISTS last_triggered_at TIMESTAMPTZ;
ALTER TABLE alert_rules ADD COLUMN IF NOT EXISTS cooldown_minutes INT DEFAULT 60;

-- Schedule execution log
CREATE TABLE IF NOT EXISTS schedule_execution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES report_schedules(id) ON DELETE CASCADE,
  report_key VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  format VARCHAR(16),
  file_path TEXT,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_schedule_log_schedule ON schedule_execution_log(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_log_started ON schedule_execution_log(started_at DESC);

-- Extend report_schedules with execution tracking
ALTER TABLE report_schedules ADD COLUMN IF NOT EXISTS last_run_at TIMESTAMPTZ;
ALTER TABLE report_schedules ADD COLUMN IF NOT EXISTS next_run_at TIMESTAMPTZ;

-- Distributed lock table (PG advisory lock alternative — row-based lease)
CREATE TABLE IF NOT EXISTS execution_locks (
  lock_name VARCHAR(128) PRIMARY KEY,
  locked_by VARCHAR(256) NOT NULL,
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
