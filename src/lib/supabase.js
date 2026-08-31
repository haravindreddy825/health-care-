import { createClient } from '@supabase/supabase-js'

// Safe environment variable retrieval across Vite and Node testing environments with fallback
const getEnv = (key, fallback = null) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key]
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]
  }
  return fallback
}

// Built-in project default credentials (allows zip download to work immediately without setup)
const DEFAULT_SUPABASE_URL = 'https://kxgewwqxejzzdfsryxsx.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Z2V3d3F4ZWp6emRmc3J5eHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwOTg5OTksImV4cCI6MjEwMzY3NDk5OX0.JKM7J38VjUbGm4vipD6zMOC1szcQSI5aG20DmmQHs5I'

const supabaseUrl = getEnv('VITE_SUPABASE_URL', DEFAULT_SUPABASE_URL)
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', DEFAULT_SUPABASE_ANON_KEY)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
