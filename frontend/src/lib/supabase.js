import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Export null if not configured — components handle this gracefully
export const supabase = (url && key)
    ? createClient(url, key, {
        auth: { persistSession: false },
        global: { headers: { 'x-client-info': 'khushi-portfolio' } },
    })
    : null