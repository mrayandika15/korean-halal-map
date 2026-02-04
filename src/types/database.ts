// Placeholder for Supabase generated types
// Run `supabase gen types typescript` to generate actual types after setting up Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: number
          device_id: string
          created_at: string
          last_seen_at: string
        }
        Insert: {
          id?: number
          device_id: string
          created_at?: string
          last_seen_at?: string
        }
        Update: {
          id?: number
          device_id?: string
          created_at?: string
          last_seen_at?: string
        }
      }
      favorites: {
        Row: {
          id: number
          device_id: string
          restaurant_id: string
          created_at: string
        }
        Insert: {
          id?: number
          device_id: string
          restaurant_id: string
          created_at?: string
        }
        Update: {
          id?: number
          device_id?: string
          restaurant_id?: string
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: number
          device_id: string
          restaurant_id: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          device_id: string
          restaurant_id: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          device_id?: string
          restaurant_id?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      restaurant_stats: {
        Row: {
          restaurant_id: string
          favorite_count: number
          average_rating: number | null
          rating_count: number
        }
      }
    }
    Functions: {
      get_device_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: Record<string, never>
  }
}
