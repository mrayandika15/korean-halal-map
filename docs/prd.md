# Halal Korea List

## 1. Product Overview

**Name:** Halal Korea (working title)

**Goal:**

A simple test project that displays halal restaurant information in Korea

by **loading a local KMZ file bundled inside the codebase**.

The main purpose is to test:

- Local KMZ parsing
- Geographic data rendering with Maplibre
- UI list, search, and map integration

**Target Users:**

- Muslim travelers in Korea
- Muslim students and residents
- Anyone looking for halal food

---

## 2. Core Features (MVP)

### Must Have

1. **Local KMZ Data Loading**
    - KMZ file stored inside the repository
    - Extract and parse KMZ at build-time or runtime
    - Convert placemarks into structured restaurant data
2. **Restaurant List**
    - Restaurant name
    - City / area (parsed from description or coordinates)
    - Halal status (from KMZ description)
    - Distance from user (calculated from coordinates)
3. **Search**
    - Search by restaurant name
    - Search by city / area
4. **Restaurant Detail**
    - Name
    - Address (from KMZ description)
    - Halal information (certified / Muslim-friendly)
    - Opening hours (if available)
    - Phone number (if available)
5. **Map View**
    - Display restaurant markers using Maplibre
    - Center map based on user location
    - Open external navigation (optional)

---

### Nice to Have (Optional)

- Favorite / bookmark restaurant
- Simple rating (1–5 stars)

---

## 3. User Flow

1. Application loads local KMZ file
2. KMZ data is parsed into restaurant objects
3. User opens the app
4. App shows nearby halal restaurants
5. User searches or selects a restaurant
6. User views restaurant details on list or map

---

## 4. Data Structure (Derived from KMZ)

### Restaurant

- `id`
- `name` (Placemark name)
- `city` (best-effort parsing)
- `address` (from KMZ description)
- `latitude` (from coordinates)
- `longitude` (from coordinates)
- `halal_status` (parsed from description)
- `opening_hours` (optional)
- `phone` (optional)
- `source` = `local_kmz`

---

## 5. Data Source & Processing

**Primary Data Source:**

- Local KMZ file committed to the repository
(e.g. `/data/halal-restaurants.kmz`)

**Processing Flow:**

1. Read KMZ file from local filesystem
2. Extract KML from KMZ
3. Parse placemarks
4. Normalize data into in-memory objects
5. Serve data directly to UI (no external APIs)

---

## 6. Tech Stack

- Frontend: Next.js
- Backend: Supabase
- Maps: Maplibre GL JS
- Data Source: Local KMZ file

---

## 7. Out of Scope

- External APIs (Google Maps, Places, etc.)
- User authentication
- Reviews and comments
- Payment system
- Admin dashboard
- Database persistence

---

## 8. Success Criteria

- Local KMZ file loads without errors
- KMZ data is parsed correctly
- Restaurant list renders correctly
- Maplibre displays markers accurately
- Search works on parsed KMZ data

KMZ File : 
docs/geo.kmz
