import { createClient } from '@supabase/supabase-js';

// Try multiple sources for the keys to be absolutely sure we catch them
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  (process.env as any).SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  (process.env as any).SUPABASE_KEY || 
  (process.env as any).SUPABASE_ANON_KEY || 
  '';

// Log for debugging (will be visible in Vercel build logs and browser console)
if (typeof window !== 'undefined') {
  console.log('Supabase Init Check:', {
    hasUrl: !!supabaseUrl,
    urlLength: supabaseUrl?.length,
    hasKey: !!supabaseAnonKey,
    keyLength: supabaseAnonKey?.length
  });
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

// Simplified check: if it's not the placeholder and not empty, it's configured
export const isSupabaseConfigured = !!supabaseUrl && !supabaseUrl.includes('placeholder');
