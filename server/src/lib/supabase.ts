import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not set. Database features will be unavailable.')
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseKey || 'placeholder-key'
)
