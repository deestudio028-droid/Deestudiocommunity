import { createClient } from '@supabase/supabase-js';

// Read from environment variables if available, otherwise use placeholders
// The user should set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
