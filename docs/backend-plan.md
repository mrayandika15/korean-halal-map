# Backend Plan - Halal Korea

Generated: 2026-02-04
Source PRD: /Users/muhammadrayandika/Documents/repository/korean-halal-map/docs/prd.md

---

## Overview

This backend plan covers two data sources:

1. **KMZ Data (Static):** Restaurant/place information parsed at build-time from local KMZ file
2. **Supabase (Dynamic):** User favorites and ratings stored in Postgres with anonymous device-based identification

Per user requirements:
- No user authentication required
- Device-based identification using localStorage device IDs
- Favorites and ratings features enabled

---

## Current Database State

**Status:** New Supabase project (no existing tables for this application)

### Gap Analysis

| PRD Requirement | Current State | Action Needed |
|-----------------|---------------|---------------|
| Restaurant data | KMZ file exists | Build-time parsing (no DB) |
| Favorites | Missing | Create `favorites` table |
| Ratings | Missing | Create `ratings` table |
| Device tracking | Missing | Create `devices` table |

---

## Architecture Overview

```
+------------------+     +-------------------+     +------------------+
|   KMZ File       |     |   Next.js App     |     |   Supabase       |
|   (docs/geo.kmz) |---->|   (Client)        |<--->|   (Postgres)     |
+------------------+     +-------------------+     +------------------+
        |                        |                        |
        v                        v                        v
  Build-time parse         Static JSON            favorites table
  to public/data/          + Supabase JS          ratings table
                           Client                  devices table
```

---

## Part 1: Static KMZ Data Processing

*(Unchanged from previous plan)*

### Data Source: `docs/geo.kmz`
- ~1,868 placemarks across 9 categories
- Parsed at build-time to JSON/GeoJSON
- Served as static files from `public/data/`

### Type Definitions

```typescript
// src/types/restaurant.ts

export type PlaceCategory =
  | 'restaurant'
  | 'mosque'
  | 'accommodation'
  | 'grocery'
  | 'other';

export type HalalStatus =
  | 'halal_certified'
  | 'muslim_friendly'
  | 'partially_halal'
  | 'seafood_only'
  | 'vegetarian'
  | 'unknown';

export interface Restaurant {
  id: string;
  name: string;
  category: PlaceCategory;
  halalStatus: HalalStatus;
  city: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  cuisineType: string | null;
  priceMin: number | null;
  openingHours: string | null;
  phone: string | null;
  externalUrl: string | null;
  imageUrl: string | null;
  rawDescription: string;
  source: 'local_kmz';
}
```

---

## Part 2: Supabase Database Schema

### Design Decisions

**Best Practice Reference:** `@~/.claude/skills/supabase-postgres-best-practices/references/schema-primary-keys.md`

- Using `bigint generated always as identity` for primary keys (sequential, 8 bytes, SQL-standard)
- Using `text` for restaurant_id (matches KMZ-generated base64 IDs)
- Using `text` for device_id (client-generated UUID stored in localStorage)
- Using `timestamptz` for all timestamps (timezone-aware)

**Best Practice Reference:** `@~/.claude/skills/supabase-postgres-best-practices/references/schema-data-types.md`

- `smallint` for rating (1-5 range, saves space vs integer)
- `text` for string fields (no artificial limits)
- `boolean` for is_active (proper type, not varchar)

---

### Table: devices

**Purpose:** Track anonymous devices for favorites/ratings without authentication

```sql
-- Devices table: anonymous device tracking
-- Best Practice: bigint identity for PK, text for device UUID
CREATE TABLE public.devices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on device_id for lookups
-- Best Practice Reference: query-missing-indexes.md
CREATE INDEX idx_devices_device_id ON public.devices (device_id);

COMMENT ON TABLE public.devices IS 'Anonymous device tracking for favorites and ratings';
COMMENT ON COLUMN public.devices.device_id IS 'Client-generated UUID stored in localStorage';
```

**Design Decisions:**
- `device_id` is client-generated UUID, stored in localStorage
- `last_seen_at` updated on each interaction for analytics
- No authentication required - device_id serves as anonymous identifier

---

### Table: favorites

**Purpose:** Store user favorites (bookmarked restaurants)

```sql
-- Favorites table: device bookmarks
CREATE TABLE public.favorites (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint: one favorite per device per restaurant
  CONSTRAINT unique_device_restaurant_favorite UNIQUE (device_id, restaurant_id)
);

-- Index for querying favorites by device
-- Best Practice Reference: query-missing-indexes.md
CREATE INDEX idx_favorites_device_id ON public.favorites (device_id);

-- Index for counting favorites per restaurant
CREATE INDEX idx_favorites_restaurant_id ON public.favorites (restaurant_id);

COMMENT ON TABLE public.favorites IS 'Device-based restaurant favorites/bookmarks';
```

**Design Decisions:**
- Per `schema-primary-keys.md`: Using bigint identity for PK
- Per `query-missing-indexes.md`: Indexes on both lookup columns
- Composite unique constraint prevents duplicate favorites
- No FK to devices table (allows favorites even if device record missing)

---

### Table: ratings

**Purpose:** Store user ratings (1-5 stars)

```sql
-- Ratings table: device ratings for restaurants
CREATE TABLE public.ratings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint: one rating per device per restaurant
  CONSTRAINT unique_device_restaurant_rating UNIQUE (device_id, restaurant_id)
);

-- Index for querying ratings by device
CREATE INDEX idx_ratings_device_id ON public.ratings (device_id);

-- Index for calculating average ratings per restaurant
CREATE INDEX idx_ratings_restaurant_id ON public.ratings (restaurant_id);

-- Composite index for common query pattern
-- Best Practice Reference: query-composite-indexes.md
CREATE INDEX idx_ratings_restaurant_rating ON public.ratings (restaurant_id, rating);

COMMENT ON TABLE public.ratings IS 'Device-based restaurant ratings (1-5 stars)';
```

**Design Decisions:**
- Per `schema-data-types.md`: Using `smallint` for rating (1-5 range)
- CHECK constraint ensures valid rating values
- Composite index for efficient average calculations
- `updated_at` allows rating changes

---

### View: restaurant_stats

**Purpose:** Pre-aggregated statistics for restaurants

```sql
-- Materialized view for restaurant statistics
-- Refreshed periodically for performance
CREATE MATERIALIZED VIEW public.restaurant_stats AS
SELECT
  restaurant_id,
  COUNT(DISTINCT f.device_id) AS favorite_count,
  COALESCE(AVG(r.rating)::NUMERIC(3,2), 0) AS average_rating,
  COUNT(r.id) AS rating_count
FROM
  (SELECT DISTINCT restaurant_id FROM public.favorites
   UNION
   SELECT DISTINCT restaurant_id FROM public.ratings) AS restaurants
LEFT JOIN public.favorites f USING (restaurant_id)
LEFT JOIN public.ratings r USING (restaurant_id)
GROUP BY restaurant_id;

-- Index for fast lookups
CREATE UNIQUE INDEX idx_restaurant_stats_id ON public.restaurant_stats (restaurant_id);

COMMENT ON MATERIALIZED VIEW public.restaurant_stats IS 'Aggregated favorites and ratings per restaurant';
```

**Refresh Strategy:**
```sql
-- Refresh periodically (e.g., every 5 minutes via cron or on-demand)
REFRESH MATERIALIZED VIEW CONCURRENTLY public.restaurant_stats;
```

---

## Row Level Security (RLS)

**Best Practice Reference:** `@~/.claude/skills/supabase-postgres-best-practices/references/security-rls-basics.md`

Since there's no authentication, we use device_id passed from the client. RLS policies ensure:
1. Devices can only read/write their own favorites and ratings
2. Anyone can read aggregate statistics

### RLS for devices table

```sql
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Allow inserting new devices (anonymous access)
CREATE POLICY devices_insert_policy ON public.devices
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading own device record
CREATE POLICY devices_select_policy ON public.devices
  FOR SELECT
  TO anon
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- Allow updating own device (last_seen_at)
CREATE POLICY devices_update_policy ON public.devices
  FOR UPDATE
  TO anon
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id')
  WITH CHECK (device_id = current_setting('request.headers', true)::json->>'x-device-id');
```

### RLS for favorites table

```sql
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Allow inserting own favorites
CREATE POLICY favorites_insert_policy ON public.favorites
  FOR INSERT
  TO anon
  WITH CHECK (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- Allow reading own favorites
CREATE POLICY favorites_select_policy ON public.favorites
  FOR SELECT
  TO anon
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- Allow deleting own favorites
CREATE POLICY favorites_delete_policy ON public.favorites
  FOR DELETE
  TO anon
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');
```

### RLS for ratings table

```sql
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Allow inserting own ratings
CREATE POLICY ratings_insert_policy ON public.ratings
  FOR INSERT
  TO anon
  WITH CHECK (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- Allow reading own ratings
CREATE POLICY ratings_select_policy ON public.ratings
  FOR SELECT
  TO anon
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- Allow updating own ratings
CREATE POLICY ratings_update_policy ON public.ratings
  FOR UPDATE
  TO anon
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id')
  WITH CHECK (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- Allow deleting own ratings
CREATE POLICY ratings_delete_policy ON public.ratings
  FOR DELETE
  TO anon
  USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');
```

### RLS for restaurant_stats (public read)

```sql
-- Stats are public (read-only view)
-- No RLS needed on materialized view as it's read-only aggregate data
```

**Performance Note per `security-rls-performance.md`:**
- Using `(select current_setting(...))` pattern would be ideal but requires stored function
- For this MVP with low traffic, direct current_setting is acceptable
- Consider adding helper function if performance becomes an issue

---

## Alternative: Simplified RLS with Function

**Best Practice Reference:** `@~/.claude/skills/supabase-postgres-best-practices/references/security-rls-performance.md`

For better RLS performance, create a helper function:

```sql
-- Helper function to get device_id from request header
CREATE OR REPLACE FUNCTION public.get_device_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-device-id',
    ''
  );
$$;

-- Then use in policies:
CREATE POLICY favorites_select_policy ON public.favorites
  FOR SELECT
  TO anon
  USING (device_id = (SELECT public.get_device_id()));
```

---

## Queries

### Query: Get Device Favorites

**Purpose:** Fetch all favorites for a device with restaurant stats

```sql
-- Optimized query using indexes
SELECT
  f.restaurant_id,
  f.created_at AS favorited_at,
  rs.average_rating,
  rs.rating_count
FROM public.favorites f
LEFT JOIN public.restaurant_stats rs ON rs.restaurant_id = f.restaurant_id
WHERE f.device_id = $1
ORDER BY f.created_at DESC;
```

**Why This Approach per `query-missing-indexes.md`:**
- Uses `idx_favorites_device_id` index for WHERE clause
- LEFT JOIN to stats view for additional data
- ORDER BY created_at uses index scan

---

### Query: Get Restaurant Stats

**Purpose:** Get aggregated stats for multiple restaurants

```sql
-- Batch fetch stats for restaurant list
SELECT
  restaurant_id,
  favorite_count,
  average_rating,
  rating_count
FROM public.restaurant_stats
WHERE restaurant_id = ANY($1::text[]);
```

**Why This Approach per `data-n-plus-one.md`:**
- Single query for multiple restaurants (avoids N+1)
- Uses unique index on restaurant_id
- Returns all needed data in one round trip

---

### Query: Toggle Favorite

**Purpose:** Add or remove a favorite

```sql
-- Upsert favorite (insert or delete if exists)
-- Using ON CONFLICT for atomic operation
INSERT INTO public.favorites (device_id, restaurant_id)
VALUES ($1, $2)
ON CONFLICT (device_id, restaurant_id)
DO NOTHING
RETURNING id;

-- If no rows returned, delete instead
DELETE FROM public.favorites
WHERE device_id = $1 AND restaurant_id = $2
RETURNING id;
```

---

### Query: Upsert Rating

**Purpose:** Add or update a rating

```sql
-- Upsert rating with updated_at
INSERT INTO public.ratings (device_id, restaurant_id, rating)
VALUES ($1, $2, $3)
ON CONFLICT (device_id, restaurant_id)
DO UPDATE SET
  rating = EXCLUDED.rating,
  updated_at = now()
RETURNING id, rating;
```

**Why This Approach:**
- Atomic operation (no race conditions)
- Uses unique constraint for conflict detection
- Updates `updated_at` on change

---

## API Endpoints

### POST /api/device

**Purpose:** Register or update device

**Request:**
```typescript
interface RegisterDeviceRequest {
  device_id: string; // Client-generated UUID
}
```

**Response:**
```typescript
interface DeviceResponse {
  id: number;
  device_id: string;
  created_at: string;
}
```

**Supabase Client Code:**
```typescript
// src/lib/supabase/device.ts
import { supabase } from './client';

export async function registerDevice(deviceId: string) {
  const { data, error } = await supabase
    .from('devices')
    .upsert(
      { device_id: deviceId, last_seen_at: new Date().toISOString() },
      { onConflict: 'device_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

### GET /api/favorites

**Purpose:** Get device's favorites

**Headers:**
```
x-device-id: <device-uuid>
```

**Response:**
```typescript
interface FavoritesResponse {
  favorites: Array<{
    restaurant_id: string;
    favorited_at: string;
    average_rating: number;
    rating_count: number;
  }>;
}
```

**Supabase Client Code:**
```typescript
// src/lib/supabase/favorites.ts
import { supabase } from './client';

export async function getFavorites(deviceId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      restaurant_id,
      created_at,
      restaurant_stats (
        average_rating,
        rating_count
      )
    `)
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

---

### POST /api/favorites

**Purpose:** Add a favorite

**Headers:**
```
x-device-id: <device-uuid>
```

**Request:**
```typescript
interface AddFavoriteRequest {
  restaurant_id: string;
}
```

**Supabase Client Code:**
```typescript
export async function addFavorite(deviceId: string, restaurantId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ device_id: deviceId, restaurant_id: restaurantId })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { alreadyExists: true };
    }
    throw error;
  }
  return data;
}
```

---

### DELETE /api/favorites/:restaurant_id

**Purpose:** Remove a favorite

**Headers:**
```
x-device-id: <device-uuid>
```

**Supabase Client Code:**
```typescript
export async function removeFavorite(deviceId: string, restaurantId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('device_id', deviceId)
    .eq('restaurant_id', restaurantId);

  if (error) throw error;
}
```

---

### GET /api/ratings/:restaurant_id

**Purpose:** Get device's rating for a restaurant

**Headers:**
```
x-device-id: <device-uuid>
```

**Response:**
```typescript
interface RatingResponse {
  rating: number | null;
  average_rating: number;
  rating_count: number;
}
```

**Supabase Client Code:**
```typescript
export async function getRating(deviceId: string, restaurantId: string) {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('device_id', deviceId)
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (error) throw error;
  return data?.rating ?? null;
}
```

---

### POST /api/ratings

**Purpose:** Add or update a rating

**Headers:**
```
x-device-id: <device-uuid>
```

**Request:**
```typescript
interface SetRatingRequest {
  restaurant_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
}
```

**Supabase Client Code:**
```typescript
export async function setRating(
  deviceId: string,
  restaurantId: string,
  rating: number
) {
  const { data, error } = await supabase
    .from('ratings')
    .upsert(
      {
        device_id: deviceId,
        restaurant_id: restaurantId,
        rating,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'device_id,restaurant_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

### GET /api/restaurants/:id/stats

**Purpose:** Get aggregated stats for a restaurant

**Response:**
```typescript
interface RestaurantStatsResponse {
  favorite_count: number;
  average_rating: number;
  rating_count: number;
}
```

**Supabase Client Code:**
```typescript
export async function getRestaurantStats(restaurantId: string) {
  const { data, error } = await supabase
    .from('restaurant_stats')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (error) throw error;
  return data ?? {
    favorite_count: 0,
    average_rating: 0,
    rating_count: 0
  };
}
```

---

## Data Access Patterns

### Pattern: Device ID Management

**Problem:** Need to identify devices without authentication

**Solution:** Generate UUID on client, store in localStorage, pass via header

**Best Practice Reference:** No authentication pattern for anonymous access

```typescript
// src/lib/device.ts

const DEVICE_ID_KEY = 'halal_korea_device_id';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}
```

---

### Pattern: Supabase Client with Device Header

**Problem:** Pass device_id to Supabase for RLS

**Solution:** Configure client with custom headers

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { getOrCreateDeviceId } from '../device';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: () => ({
      'x-device-id': getOrCreateDeviceId(),
    }),
  },
});
```

---

### Pattern: Batch Stats Fetching

**Problem:** Need stats for multiple restaurants on list view

**Solution:** Single query with IN clause

**Best Practice Reference:** `@~/.claude/skills/supabase-postgres-best-practices/references/data-n-plus-one.md`

```typescript
// src/lib/supabase/stats.ts

export async function getBatchStats(restaurantIds: string[]) {
  if (restaurantIds.length === 0) return {};

  const { data, error } = await supabase
    .from('restaurant_stats')
    .select('*')
    .in('restaurant_id', restaurantIds);

  if (error) throw error;

  // Convert to map for O(1) lookup
  return data.reduce((acc, stat) => {
    acc[stat.restaurant_id] = stat;
    return acc;
  }, {} as Record<string, typeof data[0]>);
}
```

---

## Connection Management

**Best Practice Reference:** `@~/.claude/skills/supabase-postgres-best-practices/references/conn-pooling.md`

- **Connection pooler:** Use Supabase's built-in PgBouncer (Supavisor)
- **Pool mode:** Transaction mode (default, best for serverless)
- **Connection string:** Use pooler URL from Supabase dashboard

```typescript
// Environment variables
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

// For server-side operations (if needed)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
```

---

## Migration Plan

### Migration 1: Initial Schema

```sql
-- Migration: 001_initial_schema.sql
-- Up

-- Devices table
CREATE TABLE public.devices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_devices_device_id ON public.devices (device_id);

-- Favorites table
CREATE TABLE public.favorites (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_device_restaurant_favorite UNIQUE (device_id, restaurant_id)
);

CREATE INDEX idx_favorites_device_id ON public.favorites (device_id);
CREATE INDEX idx_favorites_restaurant_id ON public.favorites (restaurant_id);

-- Ratings table
CREATE TABLE public.ratings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_device_restaurant_rating UNIQUE (device_id, restaurant_id)
);

CREATE INDEX idx_ratings_device_id ON public.ratings (device_id);
CREATE INDEX idx_ratings_restaurant_id ON public.ratings (restaurant_id);
CREATE INDEX idx_ratings_restaurant_rating ON public.ratings (restaurant_id, rating);

-- Down
DROP TABLE IF EXISTS public.ratings;
DROP TABLE IF EXISTS public.favorites;
DROP TABLE IF EXISTS public.devices;
```

---

### Migration 2: RLS Policies

```sql
-- Migration: 002_rls_policies.sql
-- Up

-- Helper function
CREATE OR REPLACE FUNCTION public.get_device_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::json->>'x-device-id',
    ''
  );
$$;

-- Devices RLS
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY devices_insert_policy ON public.devices
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY devices_select_policy ON public.devices
  FOR SELECT TO anon
  USING (device_id = (SELECT public.get_device_id()));

CREATE POLICY devices_update_policy ON public.devices
  FOR UPDATE TO anon
  USING (device_id = (SELECT public.get_device_id()))
  WITH CHECK (device_id = (SELECT public.get_device_id()));

-- Favorites RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY favorites_insert_policy ON public.favorites
  FOR INSERT TO anon
  WITH CHECK (device_id = (SELECT public.get_device_id()));

CREATE POLICY favorites_select_policy ON public.favorites
  FOR SELECT TO anon
  USING (device_id = (SELECT public.get_device_id()));

CREATE POLICY favorites_delete_policy ON public.favorites
  FOR DELETE TO anon
  USING (device_id = (SELECT public.get_device_id()));

-- Ratings RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY ratings_insert_policy ON public.ratings
  FOR INSERT TO anon
  WITH CHECK (device_id = (SELECT public.get_device_id()));

CREATE POLICY ratings_select_policy ON public.ratings
  FOR SELECT TO anon
  USING (device_id = (SELECT public.get_device_id()));

CREATE POLICY ratings_update_policy ON public.ratings
  FOR UPDATE TO anon
  USING (device_id = (SELECT public.get_device_id()))
  WITH CHECK (device_id = (SELECT public.get_device_id()));

CREATE POLICY ratings_delete_policy ON public.ratings
  FOR DELETE TO anon
  USING (device_id = (SELECT public.get_device_id()));

-- Down
DROP POLICY IF EXISTS ratings_delete_policy ON public.ratings;
DROP POLICY IF EXISTS ratings_update_policy ON public.ratings;
DROP POLICY IF EXISTS ratings_select_policy ON public.ratings;
DROP POLICY IF EXISTS ratings_insert_policy ON public.ratings;
ALTER TABLE public.ratings DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS favorites_delete_policy ON public.favorites;
DROP POLICY IF EXISTS favorites_select_policy ON public.favorites;
DROP POLICY IF EXISTS favorites_insert_policy ON public.favorites;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS devices_update_policy ON public.devices;
DROP POLICY IF EXISTS devices_select_policy ON public.devices;
DROP POLICY IF EXISTS devices_insert_policy ON public.devices;
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS public.get_device_id();
```

---

### Migration 3: Restaurant Stats View

```sql
-- Migration: 003_restaurant_stats_view.sql
-- Up

CREATE MATERIALIZED VIEW public.restaurant_stats AS
SELECT
  restaurant_id,
  COUNT(DISTINCT f.device_id) AS favorite_count,
  COALESCE(AVG(r.rating)::NUMERIC(3,2), 0) AS average_rating,
  COUNT(r.id) AS rating_count
FROM
  (SELECT DISTINCT restaurant_id FROM public.favorites
   UNION
   SELECT DISTINCT restaurant_id FROM public.ratings) AS restaurants
LEFT JOIN public.favorites f USING (restaurant_id)
LEFT JOIN public.ratings r USING (restaurant_id)
GROUP BY restaurant_id;

CREATE UNIQUE INDEX idx_restaurant_stats_id ON public.restaurant_stats (restaurant_id);

-- Public read access (no RLS on materialized view)
GRANT SELECT ON public.restaurant_stats TO anon;

-- Down
DROP MATERIALIZED VIEW IF EXISTS public.restaurant_stats;
```

---

## TypeScript Types for Supabase

```typescript
// src/types/database.ts

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: number;
          device_id: string;
          created_at: string;
          last_seen_at: string;
        };
        Insert: {
          device_id: string;
          created_at?: string;
          last_seen_at?: string;
        };
        Update: {
          device_id?: string;
          last_seen_at?: string;
        };
      };
      favorites: {
        Row: {
          id: number;
          device_id: string;
          restaurant_id: string;
          created_at: string;
        };
        Insert: {
          device_id: string;
          restaurant_id: string;
          created_at?: string;
        };
        Update: never;
      };
      ratings: {
        Row: {
          id: number;
          device_id: string;
          restaurant_id: string;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          device_id: string;
          restaurant_id: string;
          rating: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rating?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      restaurant_stats: {
        Row: {
          restaurant_id: string;
          favorite_count: number;
          average_rating: number;
          rating_count: number;
        };
      };
    };
  };
}
```

---

## Required Dependencies

```bash
# Supabase client
bun add @supabase/supabase-js

# KMZ parsing (from original plan)
bun add fflate fast-xml-parser
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## File Structure

```
korean-halal-map/
├── docs/
│   ├── prd.md
│   ├── backend-plan.md
│   └── geo.kmz
├── scripts/
│   └── parse-kmz.ts
├── public/
│   └── data/
│       ├── restaurants.json
│       └── restaurants.geojson
├── src/
│   ├── types/
│   │   ├── restaurant.ts
│   │   └── database.ts
│   └── lib/
│       ├── device.ts
│       ├── data.ts
│       ├── geo.ts
│       ├── search.ts
│       ├── map.ts
│       └── supabase/
│           ├── client.ts
│           ├── device.ts
│           ├── favorites.ts
│           ├── ratings.ts
│           └── stats.ts
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_restaurant_stats_view.sql
└── package.json
```

---

## Checklist

Before implementation, verify:

### Schema
- [x] All tables have proper primary keys (bigint identity)
- [x] Indexes on all WHERE and JOIN columns
- [x] Unique constraints for business rules
- [x] CHECK constraints for data validation
- [x] Timestamps use TIMESTAMPTZ

### RLS
- [x] RLS enabled on all user-data tables
- [x] Helper function for device_id extraction
- [x] Policies use (SELECT ...) pattern for performance
- [x] anon role has appropriate access

### Queries
- [x] All queries use indexes (no sequential scans)
- [x] N+1 queries avoided with batch fetching
- [x] Upsert operations are atomic

### Client
- [x] Device ID stored in localStorage
- [x] Supabase client configured with device header
- [x] Type-safe database types generated

---

## References Used

- `@~/.claude/skills/supabase-postgres-best-practices/references/schema-primary-keys.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/schema-data-types.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/query-missing-indexes.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/query-composite-indexes.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/security-rls-basics.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/security-rls-performance.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/conn-pooling.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/data-n-plus-one.md`
- `@~/.claude/skills/supabase-postgres-best-practices/references/data-batch-inserts.md`
