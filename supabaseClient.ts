import { createClient } from '@supabase/supabase-js';

// We cast import.meta to any to avoid TypeScript errors if 'vite/client' types are missing in the environment.
const env = (import.meta as any).env || {};

// Use environment variables if available, otherwise use placeholders/defaults to prevent crash.
// If these defaults are invalid, Supabase calls will fail gracefully, and the app will use mock data from DataContext.
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://crbzhmwdeqhqzrgurcve.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8_E3ipN-svWCnrBevilRbw_kifEmugN';

if (!env.VITE_SUPABASE_URL) {
  console.warn('Supabase env vars missing. Using fallback URL. Database features may be limited.');
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseKey
);