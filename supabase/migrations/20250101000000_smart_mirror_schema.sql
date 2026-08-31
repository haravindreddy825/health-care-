-- Migration: 20250101000000_smart_mirror_schema.sql
-- Description: Create health_readings, health_analysis, and recommendations tables for AI Smart Health Mirror

-- 1. Create health_readings table
CREATE TABLE IF NOT EXISTS public.health_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    heart_rate INTEGER NULL,
    temperature NUMERIC(5, 2) NULL,
    fatigue_level TEXT NOT NULL DEFAULT 'Low',
    posture_status TEXT NOT NULL DEFAULT 'Good',
    face_detected BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create health_analysis table
CREATE TABLE IF NOT EXISTS public.health_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reading_id UUID NOT NULL REFERENCES public.health_readings(id) ON DELETE CASCADE,
    health_status TEXT NOT NULL,
    wellness_score INTEGER NOT NULL CHECK (wellness_score >= 0 AND wellness_score <= 100),
    risk_level TEXT NOT NULL,
    analysis TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.health_analysis(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_health_readings_created_at ON public.health_readings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_readings_user_id ON public.health_readings (user_id);
CREATE INDEX IF NOT EXISTS idx_health_analysis_reading_id ON public.health_analysis (reading_id);
CREATE INDEX IF NOT EXISTS idx_health_analysis_created_at ON public.health_analysis (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_analysis_id ON public.recommendations (analysis_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.health_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Allow public/authenticated read and insert for the Smart Mirror prototype

DROP POLICY IF EXISTS "Allow select health_readings" ON public.health_readings;
CREATE POLICY "Allow select health_readings"
    ON public.health_readings
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow insert health_readings" ON public.health_readings;
CREATE POLICY "Allow insert health_readings"
    ON public.health_readings
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select health_analysis" ON public.health_analysis;
CREATE POLICY "Allow select health_analysis"
    ON public.health_analysis
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow insert health_analysis" ON public.health_analysis;
CREATE POLICY "Allow insert health_analysis"
    ON public.health_analysis
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select recommendations" ON public.recommendations;
CREATE POLICY "Allow select recommendations"
    ON public.recommendations
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow insert recommendations" ON public.recommendations;
CREATE POLICY "Allow insert recommendations"
    ON public.recommendations
    FOR INSERT
    WITH CHECK (true);
