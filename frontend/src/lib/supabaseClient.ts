import { createClient } from '@supabase/supabase-js';

// HARD-CODED TEST (Temporary for Proof of Concept)
// This bypasses Vercel environment variable injection issues
const url = "https://effxngshznsfhrqgmqpm.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZnhuZ3Noem5zZmhycWdtcXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1OTc0NDcsImV4cCI6MjA4ODE3MzQ0N30.QsQjryd_czsIjY_vnmglvx9xAaCf0lD577xOFjmAlK4";

export const supabase = createClient(url, key);

export const isSupabaseConfigured = true;
