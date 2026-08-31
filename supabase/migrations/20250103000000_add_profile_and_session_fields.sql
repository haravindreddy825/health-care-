-- Migration: 20250103000000_add_profile_and_session_fields.sql
-- Description: Add profile_id, session_id, observation_duration, and monitoring_mode to health_readings

ALTER TABLE public.health_readings 
  ADD COLUMN IF NOT EXISTS profile_id TEXT DEFAULT 'User 001',
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS observation_duration TEXT DEFAULT '2 minutes',
  ADD COLUMN IF NOT EXISTS monitoring_mode TEXT DEFAULT 'Demo Sensor Mode';

CREATE INDEX IF NOT EXISTS idx_health_readings_profile_id ON public.health_readings (profile_id);
