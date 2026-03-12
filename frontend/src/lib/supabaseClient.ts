import { createClient } from '@supabase/supabase-js';

// Accessing directly from process.env with the NEXT_PUBLIC_ prefix
// This is the most standard way for Next.js to expose variables to the browser
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// No more placeholders or logic that can hide the error
// If these are missing, createClient will throw a very specific error we can see
export const supabase = createClient(
  url as string, 
  key as string
);

export const isSupabaseConfigured = !!url && !!key;
