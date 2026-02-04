import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/src/types/database'

/**
 * Get the Supabase URL from environment variables.
 * Throws an error if not configured.
 */
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }
  return url
}

/**
 * Get the Supabase anonymous key from environment variables.
 * Throws an error if not configured.
 */
function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return key
}

/**
 * Get the device ID from localStorage for RLS policies.
 * Returns empty string on server-side or if not available.
 */
function getDeviceIdHeader(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const DEVICE_ID_KEY = 'halal_korea_device_id'
  return localStorage.getItem(DEVICE_ID_KEY) || ''
}

/**
 * Supabase client configured with:
 * - TypeScript types from Database interface
 * - Custom x-device-id header for RLS policies
 *
 * The x-device-id header is used by Supabase RLS policies to identify
 * the current device and restrict data access to only that device's
 * favorites and ratings.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  getSupabaseUrl(),
  getSupabaseAnonKey(),
  {
    global: {
      headers: {
        'x-device-id': getDeviceIdHeader(),
      },
    },
    auth: {
      // Disable auto-refresh since we're using anonymous device-based auth
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

/**
 * Create a Supabase client with a specific device ID.
 * Useful when the device ID is known at call time (e.g., after initialization).
 *
 * @param deviceId - The device ID to use for RLS policies
 * @returns A new Supabase client configured with the device ID header
 */
export function createSupabaseClientWithDeviceId(
  deviceId: string
): SupabaseClient<Database> {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: {
        'x-device-id': deviceId,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
