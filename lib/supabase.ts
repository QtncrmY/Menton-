import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eztrkovvfmjmeyubiiwu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dHJrb3Z2Zm1qbWV5dWJpaXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODYzMTgsImV4cCI6MjA5NjY2MjMxOH0.nWGUHnA6LBte7GhWZeZPgY1Gp_K_8MvpYJLKJ7Q3nfM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
