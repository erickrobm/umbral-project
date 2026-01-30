
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Fallback values to prevent 'supabaseUrl is required' crash
// This allows the app to load and show the "Setup Required" screen
const url = supabaseUrl || 'https://project.supabase.co';
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.benchmark';

export const supabase = createClient(url, key);
