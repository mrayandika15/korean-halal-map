# Frontend Plan - Halal Korea MVP

Generated: 2026-02-04
Source PRD: docs/prd.md
Related: docs/backend-plan.md

---

## Overview

This frontend plan implements a mobile-first halal restaurant finder for Korea. The application displays restaurant data parsed from a local KMZ file, with map visualization using MapLibre GL JS, search/filter functionality, and optional favorites/ratings stored in Supabase.

**Key Requirements:**
- Display ~1,868 halal restaurant locations on an interactive map
- List view with search by name/city
- Restaurant detail view with halal status, address, and contact info
- Distance calculation from user location
- Favorites and ratings (persisted in Supabase)
- Custom brand design system

---

## Available UI Components

**shadcn/ui Components for Installation**

| Component | Purpose | Install Command |
|-----------|---------|-----------------|
| Button | Primary actions, navigation, filters | `npx shadcn@latest add button` |
| Card | Restaurant cards, detail panels | `npx shadcn@latest add card` |
| Input | Search input field | `npx shadcn@latest add input` |
| Badge | Halal status tags, category labels | `npx shadcn@latest add badge` |
| Dialog | Restaurant detail modal, filters | `npx shadcn@latest add dialog` |
| Drawer | Mobile filter panel, detail sheet | `npx shadcn@latest add drawer` |
| Select | City filter, category filter | `npx shadcn@latest add select` |
| Skeleton | Loading states | `npx shadcn@latest add skeleton` |
| Tabs | List/Map view toggle | `npx shadcn@latest add tabs` |
| Toggle | View mode switches | `npx shadcn@latest add toggle` |
| Tooltip | Map marker info | `npx shadcn@latest add tooltip` |
| Scroll Area | Restaurant list scrolling | `npx shadcn@latest add scroll-area` |
| Separator | Visual dividers | `npx shadcn@latest add separator` |
| Sheet | Side panel for details | `npx shadcn@latest add sheet` |
| Sonner | Toast notifications | `npx shadcn@latest add sonner` |

### Installation Command

```bash
npx shadcn@latest init
npx shadcn@latest add button card input badge dialog drawer select skeleton tabs toggle tooltip scroll-area separator sheet sonner
```

---

## Project Structure

### Directory Layout

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page (map + list)
│   ├── restaurant/
│   │   └── [id]/
│   │       └── page.tsx        # Restaurant detail page
│   └── globals.css             # Global styles + CSS variables
├── components/                  # SHARED UI only
│   ├── ui/                     # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   └── sonner.tsx
│   ├── layouts/
│   │   ├── app-shell.tsx       # Main app wrapper
│   │   └── mobile-header.tsx   # Mobile header with search
│   └── common/
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       ├── error-boundary.tsx
│       └── halal-status-badge.tsx
├── features/                    # BUSINESS LOGIC only
│   ├── restaurants/
│   │   ├── api/
│   │   │   └── queries.ts      # Data fetching hooks
│   │   ├── components/
│   │   │   ├── restaurant-card.tsx
│   │   │   ├── restaurant-list.tsx
│   │   │   ├── restaurant-detail.tsx
│   │   │   ├── restaurant-search.tsx
│   │   │   └── restaurant-filters.tsx
│   │   ├── hooks/
│   │   │   ├── use-restaurants.ts
│   │   │   ├── use-search.ts
│   │   │   └── use-user-location.ts
│   │   ├── stores/
│   │   │   └── filter-store.ts
│   │   └── types/
│   │       └── index.ts
│   ├── map/
│   │   ├── components/
│   │   │   ├── map-view.tsx
│   │   │   ├── map-marker.tsx
│   │   │   ├── map-cluster.tsx
│   │   │   ├── map-popup.tsx
│   │   │   └── map-controls.tsx
│   │   ├── hooks/
│   │   │   ├── use-map.ts
│   │   │   └── use-map-markers.ts
│   │   └── types/
│   │       └── index.ts
│   ├── favorites/
│   │   ├── api/
│   │   │   └── queries.ts      # Supabase favorites CRUD
│   │   ├── components/
│   │   │   ├── favorite-button.tsx
│   │   │   └── favorites-list.tsx
│   │   ├── hooks/
│   │   │   └── use-favorites.ts
│   │   └── types/
│   │       └── index.ts
│   └── ratings/
│       ├── api/
│       │   └── queries.ts      # Supabase ratings CRUD
│       ├── components/
│       │   ├── star-rating.tsx
│       │   └── rating-summary.tsx
│       ├── hooks/
│       │   └── use-ratings.ts
│       └── types/
│           └── index.ts
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── utils.ts                # cn() and utilities
│   └── constants.ts            # App constants
├── hooks/
│   ├── use-media-query.ts      # Responsive breakpoints
│   └── use-local-storage.ts    # Versioned localStorage
├── stores/
│   └── app-store.ts            # Global app state
├── types/
│   ├── restaurant.ts           # Restaurant types (from backend)
│   └── database.ts             # Supabase generated types
└── data/
    └── restaurants.ts          # Generated restaurant data
```

---

## Feature: Restaurants

### Purpose
Display, search, and filter halal restaurants from the parsed KMZ data.

### Components

#### Feature-Specific (src/features/restaurants/components/)

| Component | Purpose | Props |
|-----------|---------|-------|
| RestaurantCard | Display restaurant in list | `restaurant`, `distance?`, `onSelect`, `isFavorite?` |
| RestaurantList | Virtualized list of restaurants | `restaurants`, `onSelectRestaurant`, `isLoading` |
| RestaurantDetail | Full restaurant information | `restaurant`, `onClose` |
| RestaurantSearch | Search input with debounce | `value`, `onChange`, `placeholder` |
| RestaurantFilters | Category/status/city filters | `filters`, `onChange`, `cities` |

#### Shared UI Used (src/components/)

| Component | Source | Usage |
|-----------|--------|-------|
| Card | @shadcn | RestaurantCard container |
| Badge | @shadcn | Halal status indicator |
| Input | @shadcn | Search field |
| Select | @shadcn | Filter dropdowns |
| Skeleton | @shadcn | Loading placeholders |
| ScrollArea | @shadcn | Scrollable list container |
| Drawer | @shadcn | Mobile filters |

### Component Hierarchy

```
[HomePage]
├── [AppShell]
│   ├── [MobileHeader]
│   │   ├── RestaurantSearch
│   │   └── Button (filters toggle)
│   ├── [MainContent]
│   │   ├── Tabs (list/map toggle)
│   │   ├── [RestaurantList] (when list view)
│   │   │   ├── ScrollArea
│   │   │   └── RestaurantCard[]
│   │   │       ├── Card
│   │   │       ├── Badge (halal status)
│   │   │       └── FavoriteButton
│   │   └── [MapView] (when map view)
│   │       ├── MapMarker[]
│   │       └── MapPopup
│   └── [FilterDrawer]
│       └── RestaurantFilters
└── [RestaurantDetailSheet]
    ├── RestaurantDetail
    ├── StarRating
    └── FavoriteButton
```

### API Layer (src/features/restaurants/api/)

```typescript
// queries.ts - In-memory data access (no server fetching needed)
import { useMemo } from 'react';
import restaurantData from '@/data/restaurants';
import type { Restaurant, SearchFilters } from '../types';
import { searchRestaurants } from '@/lib/search';
import { sortByDistance } from '@/lib/geo';

export function useRestaurants(
  filters: SearchFilters,
  userLocation?: { lat: number; lng: number }
) {
  return useMemo(() => {
    let results = searchRestaurants(restaurantData.restaurants, filters);

    if (userLocation) {
      results = sortByDistance(
        results,
        userLocation.lat,
        userLocation.lng
      );
    }

    return {
      data: results,
      total: results.length,
      cities: restaurantData.cities,
    };
  }, [filters, userLocation?.lat, userLocation?.lng]);
}

export function useRestaurantById(id: string) {
  return useMemo(() => {
    return restaurantData.restaurants.find(r => r.id === id) ?? null;
  }, [id]);
}
```

### Types (src/features/restaurants/types/)

```typescript
// index.ts
import type { Restaurant as BaseRestaurant } from '@/types/restaurant';

export type { Restaurant } from '@/types/restaurant';

export interface RestaurantWithDistance extends BaseRestaurant {
  distance: number;
}

export interface SearchFilters {
  query: string;
  category: 'all' | 'restaurant' | 'mosque' | 'accommodation' | 'grocery' | 'other';
  halalStatus: 'all' | 'halal_certified' | 'muslim_friendly' | 'partially_halal' | 'seafood_only' | 'vegetarian';
  city: string | 'all';
}

export const defaultFilters: SearchFilters = {
  query: '',
  category: 'all',
  halalStatus: 'all',
  city: 'all',
};
```

### State Management

**Local State:**
- RestaurantSearch: Search query with debounce
- RestaurantList: Scroll position, selected item

**Global State (Zustand):**

```typescript
// src/features/restaurants/stores/filter-store.ts
import { create } from 'zustand';
import type { SearchFilters } from '../types';

interface FilterState {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  category: 'all',
  halalStatus: 'all',
  city: 'all',
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
```

---

## Feature: Map

### Purpose
Display restaurant locations on an interactive MapLibre GL map with clustering and popups.

### Components

#### Feature-Specific (src/features/map/components/)

| Component | Purpose | Props |
|-----------|---------|-------|
| MapView | Main map container | `restaurants`, `onMarkerClick`, `selectedId?` |
| MapMarker | Custom marker component | `restaurant`, `isSelected`, `onClick` |
| MapCluster | Cluster indicator | `count`, `onClick` |
| MapPopup | Restaurant preview popup | `restaurant`, `onViewDetails` |
| MapControls | Zoom, locate me buttons | `onLocate`, `onZoomIn`, `onZoomOut` |

### Component Hierarchy

```
[MapView]
├── maplibregl.Map (DOM element)
├── [MapControls]
│   ├── Button (zoom in)
│   ├── Button (zoom out)
│   └── Button (locate me)
└── [MapPopup] (conditional)
    ├── Card
    ├── Badge
    └── Button (view details)
```

### Hooks

```typescript
// src/features/map/hooks/use-map.ts
import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';

interface UseMapOptions {
  container: React.RefObject<HTMLDivElement>;
  center?: [number, number];
  zoom?: number;
}

export function useMap({ container, center = [127.0, 37.5], zoom = 11 }: UseMapOptions) {
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!container.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: container.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center,
      zoom,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const flyTo = useCallback((lng: number, lat: number, zoom = 15) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom });
  }, []);

  const fitBounds = useCallback((bounds: maplibregl.LngLatBoundsLike) => {
    mapRef.current?.fitBounds(bounds, { padding: 50 });
  }, []);

  return { map: mapRef, flyTo, fitBounds };
}
```

```typescript
// src/features/map/hooks/use-map-markers.ts
import { useEffect } from 'react';
import type maplibregl from 'maplibre-gl';
import type { RestaurantGeoJSON } from '@/types/restaurant';

export function useMapMarkers(
  map: maplibregl.Map | null,
  geojson: RestaurantGeoJSON,
  onMarkerClick: (id: string) => void
) {
  useEffect(() => {
    if (!map) return;

    // Add source
    map.addSource('restaurants', {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Add cluster layer
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'restaurants',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#16a34a',
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      },
    });

    // Add cluster count
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'restaurants',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 12,
      },
      paint: { 'text-color': '#ffffff' },
    });

    // Add unclustered points
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'restaurants',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'halalStatus'],
          'halal_certified', '#16a34a',
          'muslim_friendly', '#3b82f6',
          'partially_halal', '#f59e0b',
          'seafood_only', '#06b6d4',
          'vegetarian', '#84cc16',
          '#9ca3af',
        ],
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    // Click handler
    map.on('click', 'unclustered-point', (e) => {
      const id = e.features?.[0]?.properties?.id;
      if (id) onMarkerClick(id);
    });

    return () => {
      map.removeLayer('clusters');
      map.removeLayer('cluster-count');
      map.removeLayer('unclustered-point');
      map.removeSource('restaurants');
    };
  }, [map, geojson, onMarkerClick]);
}
```

### Dynamic Import for MapLibre

Per best practice `bundle-dynamic-imports.md`, MapLibre is a heavy library (~300KB) and should be dynamically imported:

```typescript
// src/features/map/components/map-view.tsx
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MapViewClient = dynamic(
  () => import('./map-view-client').then((m) => m.MapViewClient),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }
);

export function MapView(props: MapViewProps) {
  return <MapViewClient {...props} />;
}
```

---

## Feature: Favorites

### Purpose
Allow users to save favorite restaurants (persisted in Supabase).

### Components

| Component | Purpose | Props |
|-----------|---------|-------|
| FavoriteButton | Toggle favorite state | `restaurantId`, `isFavorite`, `onToggle` |
| FavoritesList | List of saved favorites | `favorites`, `onSelect`, `onRemove` |

### API Layer (src/features/favorites/api/)

```typescript
// queries.ts
import useSWR from 'swr';
import { useSWRMutation } from 'swr/mutation';
import { supabase } from '@/lib/supabase';

// Per best practice: client-swr-dedup.md - use SWR for automatic deduplication
const fetcher = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('restaurant_id')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map((f) => f.restaurant_id);
};

export function useFavorites(userId: string | null) {
  return useSWR(
    userId ? ['favorites', userId] : null,
    () => fetcher(userId!),
    { revalidateOnFocus: false }
  );
}

async function addFavorite(
  url: string,
  { arg }: { arg: { userId: string; restaurantId: string } }
) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: arg.userId, restaurant_id: arg.restaurantId });
  if (error) throw error;
}

async function removeFavorite(
  url: string,
  { arg }: { arg: { userId: string; restaurantId: string } }
) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', arg.userId)
    .eq('restaurant_id', arg.restaurantId);
  if (error) throw error;
}

export function useFavoriteMutation(userId: string) {
  const add = useSWRMutation('favorites-add', addFavorite);
  const remove = useSWRMutation('favorites-remove', removeFavorite);
  return { add, remove };
}
```

### Types

```typescript
// src/features/favorites/types/index.ts
export interface Favorite {
  id: string;
  user_id: string;
  restaurant_id: string;
  created_at: string;
}
```

---

## Feature: Ratings

### Purpose
Allow users to rate restaurants (1-5 stars, persisted in Supabase).

### Components

| Component | Purpose | Props |
|-----------|---------|-------|
| StarRating | Interactive star input/display | `value`, `onChange?`, `readonly?`, `size?` |
| RatingSummary | Average rating display | `restaurantId`, `averageRating`, `totalRatings` |

### API Layer (src/features/ratings/api/)

```typescript
// queries.ts
import useSWR from 'swr';
import { useSWRMutation } from 'swr/mutation';
import { supabase } from '@/lib/supabase';

export function useRatings(restaurantId: string) {
  return useSWR(['ratings', restaurantId], async () => {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('restaurant_id', restaurantId);
    if (error) throw error;

    const total = data.length;
    const average = total > 0
      ? data.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    return { average, total };
  });
}

export function useUserRating(userId: string | null, restaurantId: string) {
  return useSWR(
    userId ? ['user-rating', userId, restaurantId] : null,
    async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('user_id', userId!)
        .eq('restaurant_id', restaurantId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data?.rating ?? null;
    }
  );
}

export function useRatingMutation(userId: string, restaurantId: string) {
  return useSWRMutation(
    ['user-rating', userId, restaurantId],
    async (key, { arg }: { arg: number }) => {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: userId,
          restaurant_id: restaurantId,
          rating: arg,
        });
      if (error) throw error;
    }
  );
}
```

### Types

```typescript
// src/features/ratings/types/index.ts
export interface Rating {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface RatingSummary {
  average: number;
  total: number;
}
```

---

## Shared Components

### UI Components (src/components/ui/)
All shadcn components listed in "Available UI Components" section.

### Layout Components (src/components/layouts/)

```typescript
// app-shell.tsx
interface AppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AppShell({ children, header, footer }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
```

```typescript
// mobile-header.tsx
interface MobileHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  rightAction?: React.ReactNode;
}

export function MobileHeader({ title, onMenuClick, rightAction }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center px-4">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        )}
        {title && <h1 className="flex-1 text-lg font-semibold">{title}</h1>}
        {rightAction}
      </div>
    </header>
  );
}
```

### Common Components (src/components/common/)

```typescript
// halal-status-badge.tsx
import { Badge } from '@/components/ui/badge';
import type { HalalStatus } from '@/types/restaurant';

const statusConfig: Record<HalalStatus, { label: string; variant: string; className: string }> = {
  halal_certified: { label: 'Halal Certified', variant: 'default', className: 'bg-green-600' },
  muslim_friendly: { label: 'Muslim Friendly', variant: 'default', className: 'bg-blue-500' },
  partially_halal: { label: 'Partially Halal', variant: 'default', className: 'bg-amber-500' },
  seafood_only: { label: 'Seafood', variant: 'default', className: 'bg-cyan-500' },
  vegetarian: { label: 'Vegetarian', variant: 'default', className: 'bg-lime-500' },
  unknown: { label: 'Unknown', variant: 'secondary', className: '' },
};

export function HalalStatusBadge({ status }: { status: HalalStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant as any} className={config.className}>
      {config.label}
    </Badge>
  );
}
```

```typescript
// loading-spinner.tsx
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
```

```typescript
// empty-state.tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

---

## Supabase Integration

### Client Setup (src/lib/supabase.ts)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

### Database Schema (for reference)

```sql
-- favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- indexes for common queries
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_ratings_restaurant ON ratings(restaurant_id);
```

### Anonymous User ID

Since no authentication is required, use localStorage to persist a unique user ID:

```typescript
// src/hooks/use-user-id.ts
import { useLocalStorage } from './use-local-storage';
import { useMemo } from 'react';

// Per best practice: client-localstorage-schema.md - version localStorage keys
const USER_ID_KEY = 'user_id:v1';

function generateUserId(): string {
  return `anon_${crypto.randomUUID()}`;
}

export function useUserId(): string {
  const [userId] = useLocalStorage(USER_ID_KEY, generateUserId);
  return userId;
}
```

---

## Routing Structure

| Route | Page Component | Feature |
|-------|---------------|---------|
| / | HomePage | restaurants, map |
| /restaurant/[id] | RestaurantDetailPage | restaurants (detail) |

### HomePage Layout

```typescript
// app/page.tsx
import { Suspense } from 'react';
import { AppShell } from '@/components/layouts/app-shell';
import { RestaurantList } from '@/features/restaurants/components/restaurant-list';
import { MapView } from '@/features/map/components/map-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  return (
    <AppShell
      header={<HomeHeader />}
    >
      <div className="flex h-[calc(100vh-56px)] flex-col lg:flex-row">
        {/* List Panel */}
        <div className="h-1/2 lg:h-full lg:w-96 border-r">
          <Suspense fallback={<ListSkeleton />}>
            <RestaurantList />
          </Suspense>
        </div>

        {/* Map Panel */}
        <div className="h-1/2 lg:h-full lg:flex-1">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <MapView />
          </Suspense>
        </div>
      </div>
    </AppShell>
  );
}
```

---

## Data Flow

```
[Static JSON Data (build-time)]
         |
         v
[useRestaurants Hook] <-- [Filter Store (Zustand)]
         |
         v
[RestaurantList / MapView Components]
         |
         v
[User Interaction]
         |
         v
[Favorites/Ratings] --> [SWR Mutation] --> [Supabase]
         |
         v
[Optimistic Update] --> [SWR Cache Revalidation]
```

---

## Design System

### Color Palette (CSS Variables)

```css
/* app/globals.css */
@layer base {
  :root {
    /* Brand Colors */
    --primary: 142.1 76.2% 36.3%;      /* Green - halal indicator */
    --primary-foreground: 355.7 100% 97.3%;

    /* Halal Status Colors */
    --halal-certified: 142.1 76.2% 36.3%;
    --muslim-friendly: 217.2 91.2% 59.8%;
    --partially-halal: 38 92.1% 50.2%;
    --seafood: 187.9 85.7% 53.3%;
    --vegetarian: 82.7 78% 55.5%;

    /* Neutrals */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    /* UI */
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --border: 240 5.9% 90%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
  }
}
```

### Typography

```css
/* Use Geist font (already configured in layout.tsx) */
.font-sans { font-family: var(--font-geist-sans); }
.font-mono { font-family: var(--font-geist-mono); }
```

### Spacing Scale

Use Tailwind's default spacing scale (4px base):
- `p-2` = 8px, `p-4` = 16px, `p-6` = 24px
- Card padding: `p-4`
- List item spacing: `space-y-2`
- Section margins: `my-6`

---

## Performance Considerations

### Code Splitting

Per best practice `bundle-dynamic-imports.md`:

```typescript
// Dynamic import for MapLibre (heavy: ~300KB)
const MapView = dynamic(
  () => import('@/features/map/components/map-view-client'),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> }
);

// Dynamic import for Sheet (rarely used on desktop)
const RestaurantDetailSheet = dynamic(
  () => import('@/features/restaurants/components/restaurant-detail-sheet'),
  { loading: () => null }
);
```

### Memoization Strategy

Per best practice `rerender-memo.md`:

**Memoize:**
- RestaurantCard (receives props from parent list)
- MapMarker (rendered for each restaurant)
- HalalStatusBadge (pure presentational)

**Skip memo:**
- Page components (always re-render on route change)
- Small atomic components (Button, Badge)

```typescript
// Example: RestaurantCard
import { memo } from 'react';

export const RestaurantCard = memo(function RestaurantCard({
  restaurant,
  distance,
  onSelect,
  isFavorite,
}: RestaurantCardProps) {
  // Component implementation
});
```

### Avoid Barrel File Imports

Per best practice `bundle-barrel-imports.md`:

```typescript
// INCORRECT
import { Button, Card, Badge } from '@/components/ui';

// CORRECT
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
```

### Derived State

Per best practice `rerender-derived-state.md`:

```typescript
// INCORRECT (re-renders on every pixel change)
function RestaurantList() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  // ...
}

// CORRECT (re-renders only when boolean changes)
function RestaurantList() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  // ...
}
```

### Functional setState

Per best practice `rerender-functional-setstate.md`:

```typescript
// CORRECT - stable callbacks
const addToFavorites = useCallback((id: string) => {
  setFavorites(curr => [...curr, id]);
}, []);

const removeFromFavorites = useCallback((id: string) => {
  setFavorites(curr => curr.filter(fid => fid !== id));
}, []);
```

### Suspense Boundaries

Per best practice `async-suspense-boundaries.md`:

```typescript
// Show layout immediately, stream data in
function HomePage() {
  return (
    <AppShell header={<Header />}>
      <Suspense fallback={<ListSkeleton />}>
        <RestaurantList />
      </Suspense>
      <Suspense fallback={<MapSkeleton />}>
        <MapView />
      </Suspense>
    </AppShell>
  );
}
```

---

## Implementation Checklist

### Phase 1: Setup

- [ ] Initialize shadcn (`npx shadcn@latest init`)
- [ ] Install all shadcn components
- [ ] Configure design system CSS variables
- [ ] Set up project structure (features, components, lib)
- [ ] Configure next.config.ts with optimizePackageImports

### Phase 2: Core Components

- [ ] Create shared layout components (AppShell, MobileHeader)
- [ ] Create HalalStatusBadge component
- [ ] Create LoadingSpinner, EmptyState components
- [ ] Set up Zustand filter store

### Phase 3: Restaurant Feature

- [ ] Create RestaurantCard component
- [ ] Create RestaurantList with ScrollArea
- [ ] Create RestaurantSearch with debounce
- [ ] Create RestaurantFilters with Select components
- [ ] Create RestaurantDetail component
- [ ] Implement useRestaurants hook

### Phase 4: Map Feature

- [ ] Install maplibre-gl
- [ ] Create MapView with dynamic import
- [ ] Implement useMap hook
- [ ] Implement useMapMarkers hook
- [ ] Create MapPopup component
- [ ] Create MapControls component

### Phase 5: Favorites & Ratings

- [ ] Set up Supabase client
- [ ] Create database tables (see schema above)
- [ ] Implement useFavorites hook with SWR
- [ ] Create FavoriteButton component
- [ ] Implement useRatings hook with SWR
- [ ] Create StarRating component

### Phase 6: Polish

- [ ] Add loading states with Skeleton
- [ ] Add error boundaries
- [ ] Add toast notifications (Sonner)
- [ ] Test responsive design
- [ ] Optimize bundle size

---

## Installation Commands

```bash
# Initialize shadcn
npx shadcn@latest init

# Install shadcn components
npx shadcn@latest add button card input badge dialog drawer select skeleton tabs toggle tooltip scroll-area separator sheet sonner

# Install dependencies
bun add zustand swr @supabase/supabase-js maplibre-gl

# Install dev dependencies
bun add -D @types/maplibre-gl
```

### next.config.ts Updates

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Per best practice: bundle-barrel-imports.md
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
```

---

## References Used

| Best Practice | Applied To |
|--------------|-----------|
| `bundle-barrel-imports.md` | Direct imports, no barrel files |
| `bundle-dynamic-imports.md` | MapLibre lazy loading |
| `rerender-memo.md` | RestaurantCard, MapMarker memoization |
| `rerender-derived-state.md` | useMediaQuery for responsive |
| `rerender-functional-setstate.md` | Favorites/ratings state updates |
| `async-suspense-boundaries.md` | Page-level Suspense boundaries |
| `rendering-conditional-render.md` | Explicit ternary operators |
| `rendering-hoist-jsx.md` | Static skeleton elements |
| `client-swr-dedup.md` | SWR for favorites/ratings fetching |
| `client-localstorage-schema.md` | Versioned anonymous user ID |

---

## Notes

### Data Architecture

- **KMZ data**: Parsed at build time, served as static JSON
- **Favorites/Ratings**: Stored in Supabase, fetched client-side with SWR
- **No authentication**: Anonymous user ID stored in localStorage
- **Distance calculation**: Client-side using Haversine formula

### Mobile-First Design

- Default view: Stacked list + map (50/50 split)
- Desktop: Side-by-side list + map
- Touch-friendly: Large tap targets, swipe gestures for sheets

### Bundle Size Targets

- Initial JS: < 100KB
- MapLibre (lazy): ~300KB (loaded on demand)
- Total with map: < 500KB
