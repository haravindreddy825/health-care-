-- Migration: 20250102000000_extend_health_analysis.sql
-- Description: Extend health_analysis table with optional AI assessment fields

ALTER TABLE public.health_analysis 
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_risk_assessment TEXT,
  ADD COLUMN IF NOT EXISTS immediate_action TEXT,
  ADD COLUMN IF NOT EXISTS observations JSONB;
