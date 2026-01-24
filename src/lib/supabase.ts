import { createClient } from '@supabase/supabase-js'

// Get environment variables (Vite uses import.meta.env, not process.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables exist and are not placeholders
if (!supabaseUrl || supabaseUrl.includes('your_supabase')) {
    throw new Error(
        'Missing or invalid VITE_SUPABASE_URL environment variable. Please add your actual Supabase project URL to .env.local'
    )
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your_supabase')) {
    throw new Error(
        'Missing or invalid VITE_SUPABASE_ANON_KEY environment variable. Please add your actual Supabase anon key to .env.local'
    )
}

// Log for debugging (only in development)
if (import.meta.env.DEV) {
    console.log('✅ Supabase URL:', supabaseUrl)
    console.log('✅ Supabase Key exists:', !!supabaseAnonKey)
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseAnonKey &&
        !supabaseUrl.includes('your_supabase') &&
        !supabaseAnonKey.includes('your_supabase')
}

// Export types for TypeScript
export type Database = any // TODO: Generate types from Supabase CLI
