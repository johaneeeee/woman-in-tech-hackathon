import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

// Public client config (the anon key is meant to ship in apps; row level security
// guards the data). The service role key never lives here.
const SUPABASE_URL = 'https://fryuhnxvtlizgrhuuziz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeXVobnh2dGxpemdyaHV1eml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0ODkwOTIsImV4cCI6MjExMDA2NTA5Mn0.5tSawa-BVsbMQLOA-8qNXw-7J5FqN8r1NgViftsvznI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
