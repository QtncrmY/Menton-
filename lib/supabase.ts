import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yapsojutwgfeyiiohies.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhcHNvanV0d2dmZXlpaW9oaWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzA4NzAsImV4cCI6MjA5NDE0Njg3MH0.beeYsRP_lhgsu6ytAG4G3SbyiI7DXxltNW4guTE6_tU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
