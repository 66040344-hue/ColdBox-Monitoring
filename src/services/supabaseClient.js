import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Configuration
 * 
 * Note: Project Ref extracted from JWT: 'vxzbgfrdrzdsifmqnvdl'
 * URL format MUST be: https://<project-ref>.supabase.co
 */
const PROJECT_REF = 'vxzbgfrdrzdsifmqnvdl';
const DEFAULT_URL = `https://${PROJECT_REF}.supabase.co`;
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4emJnZnJkcnpkc2lmbXFudmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mzk3NTEsImV4cCI6MjEwMTUxNTc1MX0._lQrHVitWHD1fiPUivOAMBeEY-69Msedab7l3_bTc5I';

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY
};

// Check if credentials are set correctly
export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_CONFIG.url &&
    SUPABASE_CONFIG.url.startsWith('https://') &&
    !SUPABASE_CONFIG.url.includes('YOUR_PROJECT_ID') &&
    SUPABASE_CONFIG.anonKey
  );
};

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
