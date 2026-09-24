import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://keqqvlbykciratrschme.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcXF2bGJ5a2NpcmF0cnNjaG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzQ0NzIsImV4cCI6MjEwNTgxMDQ3Mn0.NBSvcInE7m6XmF49iPiv7mIEM6mJhcrUYqj9m18k0TU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
