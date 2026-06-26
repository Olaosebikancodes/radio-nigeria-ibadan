import { createClient } from '@supabase/supabase-js'

// Supabase is the backend database for this project.
// The URL and key are stored in the .env file at the project root as:
//   VITE_SUPABASE_URL=...
//   VITE_SUPABASE_ANON_KEY=...
// Never share or commit the .env file. If you need to change the project,
// update those two values — everything else connects automatically.
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
