# Development Plan - Halal Korea MVP

Generated: 2026-02-04
Source Plans: frontend-plan.md, backend-plan.md, ui-ux-plan.md

---

## Overview

This development plan consolidates the frontend, backend, and UI/UX specifications for the Halal Korea MVP - a mobile-first halal restaurant finder application for South Korea. The application displays ~1,868 restaurant locations from a local KMZ file, with interactive map visualization using MapLibre GL JS, search/filter functionality, and optional favorites/ratings stored in Supabase.

**Key Features:**
- KMZ data parsing at build-time to static JSON/GeoJSON
- Interactive map with clustering and popups
- Restaurant list with search and filters
- Favorites and ratings (anonymous device-based)
- Mobile-first responsive design

---

## Phase 0: Foundation

### Task 0.1: Initialize shadcn/ui
**Source:** frontend-plan.md
**Priority:** Critical
**Dependencies:** None

**Expected Output:**
- shadcn/ui initialized in the project
- `components.json` configuration file created
- Tailwind CSS configured with shadcn defaults
- `src/components/ui/` directory structure created

**Behavior:**
- shadcn components can be added via CLI
- Tailwind utility classes work correctly
- CSS variables for theming are available

**Steps to Reproduce:**
1. Run `npx shadcn@latest init`
2. Select default options (New York style, CSS variables)
3. Verify `components.json` exists at project root
4. Verify `src/components/ui/` directory exists
5. Verify `tailwind.config.ts` has shadcn presets

---

### Task 0.2: Install shadcn Components
**Source:** frontend-plan.md
**Priority:** Critical
**Dependencies:** Task 0.1

**Expected Output:**
- Components installed: button, card, input, badge, dialog, drawer, select, skeleton, tabs, toggle, tooltip, scroll-area, separator, sheet, sonner
- All component files in `src/components/ui/`

**Behavior:**
- Components importable from `@/components/ui/[name]`
- Components render with default shadcn styling

**Steps to Reproduce:**
1. Run `npx shadcn@latest add button card input badge dialog drawer select skeleton tabs toggle tooltip scroll-area separator sheet sonner`
2. Verify each component file exists in `src/components/ui/`
3. Import and render Button component in a test page
4. Verify it renders correctly with styling

---

### Task 0.3: Configure Design System CSS Variables
**Source:** ui-ux-plan.md
**Priority:** Critical
**Dependencies:** Task 0.1

**Expected Output:**
- File: `src/app/globals.css` with design tokens
- Brand colors defined (Primary Emerald #059669)
- Halal status colors defined
- Typography scale configured
- Spacing and radius variables set

**Behavior:**
- Primary color passes WCAG 4.5:1 contrast ratio
- CSS variables available globally via `var(--color-name)`
- Dark mode variables defined (for future use)

**Steps to Reproduce:**
1. Open `src/app/globals.css`
2. Verify CSS variables match ui-ux-plan.md specifications
3. Check `--primary: 142.1 76.2% 36.3%` (Emerald 600)
4. Verify halal status colors: `--halal-certified`, `--muslim-friendly`, etc.
5. Run contrast checker on primary vs white (target: 4.5:1+)

---

### Task 0.4: Install Core Dependencies
**Source:** frontend-plan.md, backend-plan.md
**Priority:** Critical
**Dependencies:** None

**Expected Output:**
- Dependencies installed: zustand, swr, @supabase/supabase-js, maplibre-gl
- Dev dependencies: @types/maplibre-gl
- KMZ parsing: fflate, fast-xml-parser
- All packages in package.json

**Behavior:**
- Packages importable without errors
- TypeScript types available for maplibre-gl

**Steps to Reproduce:**
1. Run `bun add zustand swr @supabase/supabase-js maplibre-gl fflate fast-xml-parser`
2. Run `bun add -D @types/maplibre-gl`
3. Verify packages in package.json dependencies
4. Import each package in a test file to verify no errors

---

### Task 0.5: Configure next.config.ts
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 0.4

**Expected Output:**
- File: `next.config.ts` with optimizePackageImports
- lucide-react added to optimizePackageImports

**Behavior:**
- Icon imports are tree-shaken
- Bundle size optimized for lucide-react

**Steps to Reproduce:**
1. Open `next.config.ts`
2. Verify `experimental.optimizePackageImports: ['lucide-react']`
3. Build the project with `bun run build`
4. Verify no bundle size warnings for lucide-react

---

### Task 0.6: Create Project Directory Structure
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** None

**Expected Output:**
- Directories created:
  - `src/features/restaurants/` (api, components, hooks, stores, types)
  - `src/features/map/` (components, hooks, types)
  - `src/features/favorites/` (api, components, hooks, types)
  - `src/features/ratings/` (api, components, hooks, types)
  - `src/components/layouts/`
  - `src/components/common/`
  - `src/lib/`
  - `src/hooks/`
  - `src/stores/`
  - `src/types/`
  - `src/data/`

**Behavior:**
- Feature-based architecture is established
- Import aliases work correctly (@/features, @/components, etc.)

**Steps to Reproduce:**
1. Create all directories as listed
2. Add a test file to each feature folder
3. Verify imports with @ alias work

---

### Task 0.7: Create TypeScript Type Definitions
**Source:** backend-plan.md
**Priority:** High
**Dependencies:** Task 0.6

**Expected Output:**
- File: `src/types/restaurant.ts` with Restaurant, PlaceCategory, HalalStatus types
- File: `src/types/database.ts` with Supabase generated types

**Behavior:**
- Types are correctly exported and importable
- Restaurant type matches KMZ data structure

**Steps to Reproduce:**
1. Open `src/types/restaurant.ts`
2. Verify PlaceCategory union type includes: restaurant, mosque, accommodation, grocery, other
3. Verify HalalStatus union type includes: halal_certified, muslim_friendly, partially_halal, seafood_only, vegetarian, unknown
4. Verify Restaurant interface has all required fields
5. Import types in a test file

---

## Phase 1: Backend Core

### Task 1.1: Create KMZ Parser Script
**Source:** backend-plan.md
**Priority:** Critical
**Dependencies:** Task 0.4, Task 0.7

**Expected Output:**
- File: `scripts/parse-kmz.ts`
- Parses `docs/geo.kmz` into JSON
- Outputs to `src/data/restaurants.ts` and `public/data/restaurants.geojson`

**Behavior:**
- Extracts ~1,868 placemarks from KMZ
- Parses description fields for halal status, address, phone
- Generates unique IDs for each restaurant
- Creates GeoJSON for map rendering

**Steps to Reproduce:**
1. Run `bun run scripts/parse-kmz.ts`
2. Verify `src/data/restaurants.ts` exists with restaurant array
3. Verify `public/data/restaurants.geojson` exists
4. Check restaurant count is approximately 1,868
5. Verify sample restaurant has: id, name, latitude, longitude, halalStatus

---

### Task 1.2: Create Supabase Migration - Initial Schema
**Source:** backend-plan.md
**Priority:** Critical
**Dependencies:** None

**Expected Output:**
- File: `supabase/migrations/001_initial_schema.sql`
- Tables: devices, favorites, ratings
- Indexes on device_id and restaurant_id columns
- Unique constraints for device+restaurant combinations

**Behavior:**
- Migration runs without errors on Supabase
- Tables created with correct column types
- bigint identity PKs, text for device_id/restaurant_id
- CHECK constraint on ratings (1-5)

**Steps to Reproduce:**
1. Run `supabase db push` (or apply migration)
2. Query `SELECT * FROM information_schema.tables WHERE table_schema = 'public'`
3. Verify tables: devices, favorites, ratings exist
4. Verify ratings.rating has CHECK constraint
5. Verify indexes exist on device_id and restaurant_id

---

### Task 1.3: Create Supabase Migration - RLS Policies
**Source:** backend-plan.md
**Priority:** Critical
**Dependencies:** Task 1.2

**Expected Output:**
- File: `supabase/migrations/002_rls_policies.sql`
- Helper function: `public.get_device_id()`
- RLS policies for devices, favorites, ratings tables
- Policies use (SELECT public.get_device_id()) pattern

**Behavior:**
- Devices can only access their own data
- Insert allowed for any device_id
- Select/Update/Delete restricted to own device_id
- Anonymous (anon) role has appropriate access

**Steps to Reproduce:**
1. Apply migration
2. Insert a favorite with device_id 'test-device-1'
3. Set header x-device-id: 'test-device-1' and query favorites
4. Verify own favorite is returned
5. Set header x-device-id: 'other-device' and query favorites
6. Verify no results returned (RLS blocks access)

---

### Task 1.4: Create Supabase Migration - Restaurant Stats View
**Source:** backend-plan.md
**Priority:** Medium
**Dependencies:** Task 1.2

**Expected Output:**
- File: `supabase/migrations/003_restaurant_stats_view.sql`
- Materialized view: `public.restaurant_stats`
- Columns: restaurant_id, favorite_count, average_rating, rating_count
- Unique index on restaurant_id
- Public read access granted to anon

**Behavior:**
- Aggregates favorite and rating counts per restaurant
- Average rating calculated with 2 decimal precision
- Can be refreshed with REFRESH MATERIALIZED VIEW

**Steps to Reproduce:**
1. Apply migration
2. Insert test favorites and ratings
3. Run `REFRESH MATERIALIZED VIEW CONCURRENTLY public.restaurant_stats`
4. Query stats view
5. Verify aggregated values match inserted data

---

### Task 1.5: Set Up Supabase Client
**Source:** backend-plan.md, frontend-plan.md
**Priority:** Critical
**Dependencies:** Task 0.4

**Expected Output:**
- File: `src/lib/supabase.ts` (or `src/lib/supabase/client.ts`)
- Supabase client configured with environment variables
- Custom header for x-device-id

**Behavior:**
- Client connects to Supabase project
- Device ID passed in headers for RLS
- TypeScript types applied to client

**Steps to Reproduce:**
1. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
2. Import supabase client
3. Run a test query (e.g., supabase.from('devices').select())
4. Verify connection works (may return empty array)

---

### Task 1.6: Create Device ID Management
**Source:** backend-plan.md
**Priority:** High
**Dependencies:** Task 1.5

**Expected Output:**
- File: `src/lib/device.ts`
- Function: `getOrCreateDeviceId()` using localStorage
- localStorage key: 'halal_korea_device_id'

**Behavior:**
- Generates UUID on first visit
- Persists device ID in localStorage
- Returns existing ID on subsequent visits

**Steps to Reproduce:**
1. Clear localStorage
2. Call getOrCreateDeviceId()
3. Verify UUID is generated and stored
4. Call again, verify same UUID returned
5. Check localStorage for 'halal_korea_device_id' key

---

## Phase 2: UI Components

### Task 2.1: Create Layout Components
**Source:** frontend-plan.md, ui-ux-plan.md
**Priority:** High
**Dependencies:** Task 0.2

**Expected Output:**
- File: `src/components/layouts/app-shell.tsx`
- File: `src/components/layouts/mobile-header.tsx`
- Props defined per frontend-plan.md

**Behavior:**
- AppShell wraps content with header/footer slots
- MobileHeader displays title, menu button, right action
- Header is sticky with backdrop blur

**Steps to Reproduce:**
1. Import AppShell in a test page
2. Render with children content
3. Verify layout structure (flex column, min-h-screen)
4. Render MobileHeader with title prop
5. Verify sticky positioning and styling

---

### Task 2.2: Create Common Components
**Source:** frontend-plan.md, ui-ux-plan.md
**Priority:** High
**Dependencies:** Task 0.2

**Expected Output:**
- File: `src/components/common/halal-status-badge.tsx`
- File: `src/components/common/loading-spinner.tsx`
- File: `src/components/common/empty-state.tsx`
- File: `src/components/common/error-boundary.tsx`

**Behavior:**
- HalalStatusBadge shows colored badge based on status
- LoadingSpinner shows animated spinner
- EmptyState shows message with optional action
- ErrorBoundary catches and displays errors

**Steps to Reproduce:**
1. Render HalalStatusBadge with status='halal_certified'
2. Verify green badge with "Halal Certified" text
3. Render HalalStatusBadge with status='muslim_friendly'
4. Verify amber badge with "Muslim Friendly" text
5. Render LoadingSpinner, verify animation
6. Render EmptyState with title and action, verify layout

---

### Task 2.3: Create Filter Store
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 0.4

**Expected Output:**
- File: `src/features/restaurants/stores/filter-store.ts`
- Zustand store with filters state
- Actions: setFilter, resetFilters
- Default filters: query='', category='all', halalStatus='all', city='all'

**Behavior:**
- Store persists filter state across components
- setFilter updates individual filter
- resetFilters restores defaults

**Steps to Reproduce:**
1. Import useFilterStore in a test component
2. Read initial filters state
3. Verify default values
4. Call setFilter('query', 'test')
5. Verify query updated
6. Call resetFilters()
7. Verify defaults restored

---

## Phase 3: Features

### Task 3.1: Create Restaurant Card Component
**Source:** frontend-plan.md, ui-ux-plan.md
**Priority:** High
**Dependencies:** Task 2.2, Task 0.2

**Expected Output:**
- File: `src/features/restaurants/components/restaurant-card.tsx`
- Uses Card, Badge from shadcn
- Props: restaurant, distance?, onSelect, isFavorite?
- Memoized with React.memo

**Behavior:**
- Displays restaurant name, halal status badge, address/city
- Shows distance if provided
- Shows favorite icon state
- Clickable with hover effect

**Steps to Reproduce:**
1. Import RestaurantCard
2. Render with mock restaurant data
3. Verify name, badge, and address display
4. Verify distance shows if provided
5. Click card, verify onSelect called
6. Verify hover shadow effect

---

### Task 3.2: Create Restaurant List Component
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 3.1

**Expected Output:**
- File: `src/features/restaurants/components/restaurant-list.tsx`
- Uses ScrollArea from shadcn
- Props: restaurants, onSelectRestaurant, isLoading

**Behavior:**
- Renders list of RestaurantCard components
- Shows skeleton loading state when isLoading
- Handles empty state with EmptyState component
- Scrollable within container

**Steps to Reproduce:**
1. Render RestaurantList with mock restaurants array
2. Verify cards rendered for each restaurant
3. Scroll list, verify scroll behavior
4. Render with isLoading=true, verify skeletons
5. Render with empty array, verify empty state

---

### Task 3.3: Create Restaurant Search Component
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 0.2

**Expected Output:**
- File: `src/features/restaurants/components/restaurant-search.tsx`
- Uses Input from shadcn
- Props: value, onChange, placeholder
- Debounced input (300ms)

**Behavior:**
- Shows search icon and clear button
- Debounces onChange calls
- Clear button resets input

**Steps to Reproduce:**
1. Render RestaurantSearch
2. Type "test" in input
3. Verify onChange called after 300ms debounce
4. Click clear button
5. Verify input cleared and onChange called with ''

---

### Task 3.4: Create Restaurant Filters Component
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 0.2

**Expected Output:**
- File: `src/features/restaurants/components/restaurant-filters.tsx`
- Uses Select, Drawer from shadcn
- Props: filters, onChange, cities

**Behavior:**
- Dropdowns for category, halal status, city
- Mobile: Opens in Drawer
- Desktop: Inline dropdowns

**Steps to Reproduce:**
1. Render RestaurantFilters with cities list
2. Select a category filter
3. Verify onChange called with updated filters
4. Select halal status filter
5. Verify onChange called
6. On mobile viewport, verify Drawer behavior

---

### Task 3.5: Create Restaurant Detail Component
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 2.2

**Expected Output:**
- File: `src/features/restaurants/components/restaurant-detail.tsx`
- Props: restaurant, onClose
- Shows full restaurant information

**Behavior:**
- Displays name, halal status badge, address, phone
- Shows opening hours if available
- Navigation and call buttons
- Close button triggers onClose

**Steps to Reproduce:**
1. Render RestaurantDetail with mock restaurant
2. Verify all fields display correctly
3. Click close button, verify onClose called
4. Click navigate button, verify external link opens
5. Verify phone number is clickable (tel: link)

---

### Task 3.6: Create useRestaurants Hook
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 1.1

**Expected Output:**
- File: `src/features/restaurants/api/queries.ts`
- Hook: useRestaurants(filters, userLocation?)
- Returns: { data, total, cities }

**Behavior:**
- Filters restaurants by query, category, status, city
- Sorts by distance if userLocation provided
- Returns unique cities for filter dropdown

**Steps to Reproduce:**
1. Import useRestaurants hook
2. Call with default filters
3. Verify all restaurants returned
4. Call with query filter
5. Verify filtered results
6. Call with userLocation
7. Verify sorted by distance

---

### Task 3.7: Create useUserLocation Hook
**Source:** frontend-plan.md
**Priority:** Medium
**Dependencies:** None

**Expected Output:**
- File: `src/features/restaurants/hooks/use-user-location.ts`
- Returns: { latitude, longitude, error, loading }

**Behavior:**
- Requests geolocation permission
- Returns coordinates on success
- Returns error on failure/denial
- Loading state while requesting

**Steps to Reproduce:**
1. Import useUserLocation hook
2. Call hook in component
3. Verify loading state initially true
4. Accept location permission
5. Verify coordinates returned
6. Deny permission, verify error state

---

## Phase 4: Map Feature

### Task 4.1: Create MapView Component (Dynamic Import)
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 0.4

**Expected Output:**
- File: `src/features/map/components/map-view.tsx` (wrapper with dynamic import)
- File: `src/features/map/components/map-view-client.tsx` (actual map)
- Dynamic import with SSR disabled

**Behavior:**
- MapLibre loaded only on client
- Shows skeleton while loading
- Map renders with default Korea center

**Steps to Reproduce:**
1. Import MapView component
2. Render on a page
3. Verify skeleton shows initially
4. Verify map loads after hydration
5. Verify no SSR errors

---

### Task 4.2: Create useMap Hook
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 0.4

**Expected Output:**
- File: `src/features/map/hooks/use-map.ts`
- Returns: { map, flyTo, fitBounds }
- Uses CartoDB positron style

**Behavior:**
- Initializes MapLibre map on mount
- Cleans up on unmount
- flyTo animates to location
- fitBounds fits markers in view

**Steps to Reproduce:**
1. Use hook with container ref
2. Verify map initializes
3. Call flyTo with coordinates
4. Verify map animates to location
5. Unmount component, verify cleanup

---

### Task 4.3: Create useMapMarkers Hook
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 4.2

**Expected Output:**
- File: `src/features/map/hooks/use-map-markers.ts`
- Adds GeoJSON source and layers to map
- Clustering enabled
- Click handler for markers

**Behavior:**
- Clusters markers when zoomed out
- Different colors per halal status
- Click triggers onMarkerClick callback

**Steps to Reproduce:**
1. Pass map instance and GeoJSON data
2. Verify markers appear on map
3. Zoom out, verify clustering
4. Click on marker
5. Verify callback called with restaurant ID

---

### Task 4.4: Create MapPopup Component
**Source:** frontend-plan.md, ui-ux-plan.md
**Priority:** High
**Dependencies:** Task 4.1

**Expected Output:**
- File: `src/features/map/components/map-popup.tsx`
- Props: restaurant, onViewDetails
- Uses Card from shadcn

**Behavior:**
- Shows restaurant name, badge, distance
- View Details button triggers onViewDetails
- Styled per ui-ux-plan wireframes

**Steps to Reproduce:**
1. Render MapPopup with mock restaurant
2. Verify name and badge display
3. Click View Details button
4. Verify onViewDetails called

---

### Task 4.5: Create MapControls Component
**Source:** frontend-plan.md
**Priority:** Medium
**Dependencies:** Task 0.2

**Expected Output:**
- File: `src/features/map/components/map-controls.tsx`
- Props: onLocate, onZoomIn, onZoomOut
- Zoom and locate buttons

**Behavior:**
- Zoom in/out buttons call respective callbacks
- Locate button triggers user location

**Steps to Reproduce:**
1. Render MapControls
2. Click zoom in button, verify callback
3. Click zoom out button, verify callback
4. Click locate button, verify callback

---

## Phase 5: Favorites and Ratings

### Task 5.1: Create useFavorites Hook
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 1.5, Task 1.6

**Expected Output:**
- File: `src/features/favorites/api/queries.ts`
- Hook: useFavorites(userId)
- Uses SWR for caching and deduplication

**Behavior:**
- Fetches user's favorites from Supabase
- Returns array of restaurant IDs
- Revalidates on mutation

**Steps to Reproduce:**
1. Import useFavorites hook
2. Call with device ID
3. Verify Supabase query executed
4. Add a favorite via Supabase
5. Verify hook returns updated list

---

### Task 5.2: Create FavoriteButton Component
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 5.1

**Expected Output:**
- File: `src/features/favorites/components/favorite-button.tsx`
- Props: restaurantId, isFavorite, onToggle
- Heart icon with fill state

**Behavior:**
- Filled heart when favorited
- Empty heart when not favorited
- Toggle on click with animation
- Optimistic update

**Steps to Reproduce:**
1. Render FavoriteButton with isFavorite=false
2. Verify empty heart icon
3. Click button
4. Verify heart fills (animation)
5. Verify onToggle called

---

### Task 5.3: Create useRatings Hook
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 1.5

**Expected Output:**
- File: `src/features/ratings/api/queries.ts`
- Hooks: useRatings(restaurantId), useUserRating(userId, restaurantId), useRatingMutation

**Behavior:**
- useRatings returns average and count
- useUserRating returns user's rating (or null)
- Mutation upserts rating

**Steps to Reproduce:**
1. Call useRatings with restaurant ID
2. Verify returns { average: 0, total: 0 } initially
3. Add rating via mutation
4. Verify useRatings returns updated average

---

### Task 5.4: Create StarRating Component
**Source:** frontend-plan.md, ui-ux-plan.md
**Priority:** High
**Dependencies:** None

**Expected Output:**
- File: `src/features/ratings/components/star-rating.tsx`
- Props: value, onChange?, readonly?, size?
- Interactive or display-only mode

**Behavior:**
- Shows 5 stars
- Filled stars based on value
- Interactive mode allows clicking stars
- Animation on star selection

**Steps to Reproduce:**
1. Render StarRating with value=3
2. Verify 3 stars filled
3. Render with onChange prop
4. Click 4th star
5. Verify onChange called with 4

---

### Task 5.5: Create RatingSummary Component
**Source:** frontend-plan.md
**Priority:** Medium
**Dependencies:** Task 5.4

**Expected Output:**
- File: `src/features/ratings/components/rating-summary.tsx`
- Props: averageRating, totalRatings
- Shows average and count

**Behavior:**
- Displays star rating visually
- Shows average number (e.g., "4.2")
- Shows total count (e.g., "23 ratings")

**Steps to Reproduce:**
1. Render RatingSummary with averageRating=4.2, totalRatings=23
2. Verify stars display 4.2/5
3. Verify "4.2" text displayed
4. Verify "23 ratings" text displayed

---

## Phase 6: Integration

### Task 6.1: Create Home Page
**Source:** frontend-plan.md
**Priority:** Critical
**Dependencies:** Task 3.2, Task 4.1, Task 2.1

**Expected Output:**
- File: `src/app/page.tsx`
- Split layout: List panel + Map panel
- Mobile: 50/50 vertical split
- Desktop: List (400px) + Map (flexible)

**Behavior:**
- Loads restaurants from static data
- List and map show same data
- Search/filter updates both views
- Selecting restaurant highlights on map

**Steps to Reproduce:**
1. Navigate to /
2. Verify list of restaurants displays
3. Verify map displays with markers
4. Search for a restaurant
5. Verify both list and map update
6. Click restaurant card
7. Verify marker highlighted on map

---

### Task 6.2: Create Restaurant Detail Page/Sheet
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 3.5, Task 5.2, Task 5.4

**Expected Output:**
- File: `src/app/restaurant/[id]/page.tsx` OR
- Sheet component for mobile detail view
- Integrates favorites and ratings

**Behavior:**
- Displays full restaurant details
- Favorite button toggles favorite state
- Star rating allows user rating
- Navigate button opens external maps

**Steps to Reproduce:**
1. Navigate to restaurant detail (via card click or URL)
2. Verify all restaurant info displays
3. Click favorite button, verify toggle
4. Rate restaurant, verify saved
5. Click navigate, verify external app opens

---

### Task 6.3: Connect Supabase to UI
**Source:** frontend-plan.md, backend-plan.md
**Priority:** High
**Dependencies:** Task 5.1, Task 5.3, Task 1.6

**Expected Output:**
- Favorites persisted to Supabase
- Ratings persisted to Supabase
- Device ID passed in all requests

**Behavior:**
- Favoriting a restaurant saves to Supabase
- Rating updates/creates in Supabase
- Data persists across sessions

**Steps to Reproduce:**
1. Favorite a restaurant
2. Refresh page
3. Verify favorite still shown
4. Rate a restaurant
5. Refresh page
6. Verify rating persisted

---

## Phase 7: Polish

### Task 7.1: Add Loading States
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 0.2

**Expected Output:**
- Skeleton loading for restaurant list
- Skeleton loading for restaurant detail
- Map loading indicator
- Button loading states

**Behavior:**
- Skeletons match content layout
- Shimmer animation on skeletons
- Loading states prevent double-clicks

**Steps to Reproduce:**
1. Throttle network in DevTools
2. Navigate to home page
3. Verify skeleton cards display while loading
4. Click restaurant, verify detail skeleton
5. Verify map shows loading state

---

### Task 7.2: Add Toast Notifications
**Source:** frontend-plan.md
**Priority:** Medium
**Dependencies:** Task 0.2

**Expected Output:**
- Sonner toasts integrated
- Toast on favorite added/removed
- Toast on rating submitted
- Toast on errors

**Behavior:**
- Toasts appear from bottom
- Auto-dismiss after 3 seconds
- Can be manually dismissed

**Steps to Reproduce:**
1. Favorite a restaurant
2. Verify "Saved to favorites" toast
3. Unfavorite
4. Verify "Removed from favorites" toast
5. Rate restaurant
6. Verify "Thanks for rating!" toast

---

### Task 7.3: Add Error Handling
**Source:** frontend-plan.md
**Priority:** High
**Dependencies:** Task 2.2

**Expected Output:**
- Error boundary at app level
- Error states for failed API calls
- Retry buttons on errors

**Behavior:**
- Errors caught and displayed gracefully
- Users can retry failed actions
- Console logs error details for debugging

**Steps to Reproduce:**
1. Simulate network error
2. Verify error message displayed
3. Verify retry button appears
4. Click retry, verify request retried

---

### Task 7.4: Accessibility Audit
**Source:** ui-ux-plan.md
**Priority:** High
**Dependencies:** All Phase 6 tasks

**Expected Output:**
- WCAG 2.1 AA compliance
- Keyboard navigation complete
- Screen reader tested
- Color contrast verified

**Behavior:**
- All interactive elements keyboard accessible
- Focus indicators visible
- ARIA labels on custom components
- No color-only information

**Steps to Reproduce:**
1. Run axe-core audit
2. Fix any violations
3. Tab through all interactive elements
4. Verify focus ring visible
5. Test with VoiceOver/NVDA
6. Verify all content announced correctly

---

### Task 7.5: Performance Optimization
**Source:** frontend-plan.md
**Priority:** Medium
**Dependencies:** All Phase 6 tasks

**Expected Output:**
- Initial JS < 100KB
- Lighthouse performance > 90
- MapLibre lazy loaded (~300KB)

**Behavior:**
- Fast initial load
- Map loads on demand
- No unnecessary re-renders

**Steps to Reproduce:**
1. Run Lighthouse audit
2. Verify performance score > 90
3. Check network tab for initial bundle size
4. Verify MapLibre loads only when map visible
5. Use React DevTools Profiler
6. Verify no unnecessary re-renders

---

### Task 7.6: Responsive Design Testing
**Source:** ui-ux-plan.md
**Priority:** High
**Dependencies:** All Phase 6 tasks

**Expected Output:**
- Mobile (< 640px): Single column, bottom nav
- Tablet (640-1024px): Split view
- Desktop (> 1024px): Full split view

**Behavior:**
- Layout adapts to screen size
- Touch targets 44x44px minimum
- No horizontal scroll

**Steps to Reproduce:**
1. Test at 375px width (iPhone SE)
2. Verify single column layout
3. Verify bottom navigation
4. Test at 768px width (iPad)
5. Verify split view
6. Test at 1280px width
7. Verify full desktop layout

---

## Summary

| Phase | Tasks | Critical | High | Medium | Low |
|-------|-------|----------|------|--------|-----|
| 0 - Foundation | 7 | 4 | 3 | 0 | 0 |
| 1 - Backend Core | 6 | 4 | 2 | 0 | 0 |
| 2 - UI Components | 3 | 0 | 3 | 0 | 0 |
| 3 - Features | 7 | 0 | 6 | 1 | 0 |
| 4 - Map Feature | 5 | 0 | 4 | 1 | 0 |
| 5 - Favorites/Ratings | 5 | 0 | 4 | 1 | 0 |
| 6 - Integration | 3 | 1 | 2 | 0 | 0 |
| 7 - Polish | 6 | 0 | 4 | 2 | 0 |
| **Total** | **42** | **9** | **28** | **5** | **0** |

---

## Quick Reference

### Critical Path
1. Task 0.1 (shadcn init) -> Task 0.2 (components) -> Task 2.1 (layouts)
2. Task 0.4 (deps) -> Task 1.1 (KMZ parser) -> Task 3.6 (useRestaurants)
3. Task 1.2 (schema) -> Task 1.3 (RLS) -> Task 1.5 (client) -> Task 5.1 (favorites)
4. Task 4.1 (MapView) -> Task 6.1 (Home Page)

### Parallel Tracks
- **Track A (UI):** Tasks 0.1-0.3, 2.1-2.3, 3.1-3.5
- **Track B (Backend):** Tasks 1.2-1.4 (Supabase migrations)
- **Track C (Data):** Tasks 0.4, 1.1, 0.7
- **Track D (Map):** Tasks 4.1-4.5 (after Task 0.4)

### Dependencies Graph (Simplified)
```
0.1 -> 0.2 -> 2.1, 2.2
0.1 -> 0.3
0.4 -> 1.1, 4.1
0.6 -> 0.7
1.2 -> 1.3, 1.4
0.4, 1.2, 1.3 -> 1.5 -> 1.6 -> 5.1, 5.3
1.1, 2.2 -> 3.1 -> 3.2
All 3.x, 4.x, 5.x -> 6.1, 6.2, 6.3
All 6.x -> 7.x
```

---
