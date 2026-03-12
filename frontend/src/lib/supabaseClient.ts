import { createClient } from '@supabase/supabase-js';

// Bulletproof variable loading
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log configuration status to browser console (safe for non-secrets)
if (typeof window !== 'undefined') {
  console.log('--- StackForge Auth Status ---');
  console.log('Supabase URL Configured:', !!supabaseUrl);
  console.log('Supabase Key Configured:', !!supabaseAnonKey);
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables are missing from Vercel settings.');
  }
  console.log('------------------------------');
}

// Initialize with fallbacks to prevent crash, but AuthContext will handle the 'real' failure
export const supabase = createClient(
  supabaseUrl || 'https://missing-url.supabase.co', 
  supabaseAnonKey || 'missing-key'
);

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;
