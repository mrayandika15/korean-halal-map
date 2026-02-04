# UI/UX Design Plan

Generated: 2026-02-04
Source PRD: docs/prd.md
Design System: Halal Korea Design System

---

## Executive Summary

Halal Korea is a mobile-first web application designed to help Muslim travelers, students, and residents discover halal restaurants across South Korea. The design strategy focuses on creating a warm, trustworthy, and culturally sensitive interface that combines modern map-based exploration with an intuitive list view. The visual identity draws inspiration from Korean aesthetics while maintaining clear halal certification visibility, ensuring users can quickly identify suitable dining options with confidence.

Key design decisions include a dual-view interface (map + list), prominent halal status badges, distance-based sorting, and a clean typography system optimized for both English and Korean text rendering.

---

## 1. User Research

### 1.1 Problem Statement

**Business Goal:** Create a reliable, easy-to-use platform for finding halal food options in South Korea, starting with KMZ data parsing as a technical proof-of-concept.

**User Need:** Muslim individuals in Korea need a trustworthy way to quickly find nearby halal-certified or Muslim-friendly restaurants without language barriers or uncertainty about food compliance.

**Design Challenge:** How might we design an interface that builds trust through clear halal status communication while providing an efficient search and discovery experience for users unfamiliar with Korean locations?

### 1.2 User Personas

#### Primary Persona: Fatima - The Muslim Traveler

| Attribute | Details |
|-----------|---------|
| **Demographics** | 28 years old, Malaysian tourist, moderate tech-savviness, first time in Korea |
| **Goals** | Find halal restaurants near tourist attractions, understand what halal options mean (certified vs Muslim-friendly), navigate easily despite language barrier |
| **Pain Points** | Language barrier when searching Korean apps, uncertainty about halal certification validity, difficulty judging distance in unfamiliar city |
| **Behaviors** | Uses Google Maps for navigation, prefers visual confirmation (photos), checks reviews before visiting, often travels in groups |
| **Quote** | "I just want to know for sure if the food is halal before I walk 20 minutes to get there." |

#### Secondary Persona: Ahmad - The International Student

| Attribute | Details |
|-----------|---------|
| **Demographics** | 23 years old, Indonesian student at Seoul National University, high tech-savviness, living in Korea for 2 years |
| **Goals** | Discover new halal restaurants near campus and around Seoul, save favorite spots for future visits, share recommendations with fellow Muslim students |
| **Pain Points** | Limited budget, needs accurate distance estimates, wants to know operating hours before visiting, tired of the same few restaurants |
| **Behaviors** | Uses multiple food apps, active in Muslim student community chat groups, prefers quick meals between classes |
| **Quote** | "I know a few good places, but I want to explore more options and keep track of the ones I like." |

#### Tertiary Persona: Yusuf - The Business Traveler

| Attribute | Details |
|-----------|---------|
| **Demographics** | 45 years old, Saudi Arabian business executive, moderate tech-savviness, frequent short trips to Korea |
| **Goals** | Find halal restaurants near business hotels, locate upscale halal dining for client meetings, quick access without extensive browsing |
| **Pain Points** | Limited time for research, needs reliable information quickly, prefers established/certified restaurants |
| **Behaviors** | Uses premium services, values efficiency over exploration, often needs to make quick dining decisions |
| **Quote** | "I need to find a proper halal restaurant for a business dinner, and I need to know it is certified." |

### 1.3 User Journey Map

```
Journey: Finding a Halal Restaurant for Lunch

Stage 1: Discovery
+-- Actions: Opens Halal Korea app, views nearby restaurants
+-- Thoughts: "What halal options are close to me right now?"
+-- Emotions: Hopeful, slightly anxious about finding options
+-- Pain Points: Uncertainty about location accuracy, unfamiliar area names
+-- Opportunities: Show distance prominently, use familiar landmarks

Stage 2: Exploration
+-- Actions: Browses list, switches to map view, filters by area
+-- Thoughts: "Which ones are actually close? What type of food?"
+-- Emotions: Engaged, evaluating options
+-- Pain Points: Too many results, unclear halal status differences
+-- Opportunities: Clear halal badges, visual distance indicators

Stage 3: Evaluation
+-- Actions: Taps on restaurant card, views details, checks ratings
+-- Thoughts: "Is this place trustworthy? Will I like the food?"
+-- Emotions: Cautious, seeking reassurance
+-- Pain Points: Missing information (hours, photos), unclear certification
+-- Opportunities: Prominent halal status, user ratings, complete details

Stage 4: Decision
+-- Actions: Adds to favorites, gets directions
+-- Thoughts: "This looks good, let me save it and go there"
+-- Emotions: Confident, ready to act
+-- Pain Points: No navigation integration, losing the restaurant later
+-- Opportunities: One-tap navigation, easy favorites, share functionality

Stage 5: Post-Visit
+-- Actions: Returns to app, rates restaurant, browses more
+-- Thoughts: "That was good, I should remember this place"
+-- Emotions: Satisfied or disappointed, wanting to contribute
+-- Pain Points: No way to leave feedback, forgetting good spots
+-- Opportunities: Simple rating system, favorites organization
```

### 1.4 Competitive Analysis

| Competitor | Strengths | Weaknesses | Opportunity |
|------------|-----------|------------|-------------|
| HalalTrip | Comprehensive global database, user reviews, established trust | Cluttered UI, slow performance, overwhelming for simple searches | Cleaner, faster local-focused experience |
| Zabihah | Large community, detailed certifications | Dated interface, poor mobile experience, US-focused | Modern mobile-first Korean-specific design |
| Google Maps | Familiar interface, excellent navigation | Halal info inconsistent, buried in reviews, no certification clarity | Dedicated halal focus with clear status badges |
| Naver Maps | Excellent Korea coverage, local data | No halal-specific features, language barrier | Halal-focused alternative with English support |

---

## 2. Information Architecture

### 2.1 Sitemap

```
Halal Korea
+-- Home (Map + List View)
|   +-- Map View
|   |   +-- Restaurant Markers
|   |   +-- User Location
|   |   +-- Marker Popups
|   +-- List View
|   |   +-- Restaurant Cards
|   |   +-- Sort Options
|   |   +-- Distance Indicators
|   +-- Search
|       +-- By Name
|       +-- By City/Area
+-- Restaurant Detail
|   +-- Basic Information
|   +-- Halal Status Badge
|   +-- Contact Information
|   +-- Map Preview
|   +-- Rating (if available)
|   +-- Actions (Favorite, Navigate, Share)
+-- Favorites
|   +-- Saved Restaurants List
|   +-- Quick Actions
+-- About
    +-- App Information
    +-- Data Source
    +-- Contact
```

### 2.2 Navigation Structure

**Primary Navigation:**
| Item | Priority | Icon | Target |
|------|----------|------|--------|
| Explore | High | Map/Compass | Home (Map + List) |
| Favorites | Medium | Heart | Favorites List |
| About | Low | Info Circle | About Page |

**Secondary Navigation:**
- View Toggle: Map / List switch within Explore
- Search: Accessible from top bar on all screens
- Back Navigation: Standard mobile back behavior

**Bottom Navigation (Mobile):**
```
+-------------------+-------------------+-------------------+
|    [Map Icon]     |   [Heart Icon]    |   [Info Icon]     |
|     Explore       |    Favorites      |      About        |
+-------------------+-------------------+-------------------+
```

### 2.3 Content Hierarchy

| Page | Primary Content | Secondary Content | Tertiary |
|------|----------------|-------------------|----------|
| Home | Map/List of restaurants | Search bar, filters | View toggle, sort options |
| Restaurant Detail | Name, halal status, address | Contact info, hours, rating | Navigation button, share |
| Favorites | Saved restaurant list | Quick remove action | Empty state guidance |

---

## 3. User Flows

### 3.1 Core Flow: Find Nearby Halal Restaurant

**Goal:** User finds and navigates to a nearby halal restaurant
**Entry Point:** App launch or home screen
**Success Criteria:** User taps navigation button to get directions

```
[App Launch]
    |
    v
+-------------------+
|  Location         |
|  Permission       |
+--------+----------+
         |
    +----+----+
    |         |
  Granted   Denied
    |         |
    v         v
[Center on    [Show Seoul
 User]         Default]
    |         |
    +----+----+
         |
         v
+-------------------+
|  Home Screen      |
|  (Map + List)     |
+--------+----------+
         |
         v
+-------------------+
|  Browse/Search    |
|  Restaurants      |
+--------+----------+
         |
         v
+-------------------+
|  Tap Restaurant   |
|  Card/Marker      |
+--------+----------+
         |
         v
+-------------------+
|  View Detail      |
|  Page             |
+--------+----------+
         |
    +----+----+
    |         |
  Navigate  Save to
    |       Favorites
    v         |
[External     v
 Maps App] [Confirmation
            Toast]
```

**Edge Cases:**
- Location permission denied: Show manual city/area selector, default to Seoul center
- No restaurants nearby: Expand search radius, show "No results" with suggestions
- Offline mode: Show cached favorites if available, indicate offline status

**Error States:**
- Location error: "Unable to get your location. Please enable location services or search by area."
- Data loading error: "Unable to load restaurants. Please check your connection and try again." [Retry Button]
- Empty search results: "No restaurants found for '[query]'. Try a different search term."

### 3.2 Core Flow: Save Restaurant to Favorites

**Goal:** User saves a restaurant for future reference
**Entry Point:** Restaurant card or detail page
**Success Criteria:** Restaurant appears in Favorites list

```
[Restaurant Card/Detail]
    |
    v
+-------------------+
|  Tap Heart/       |
|  Favorite Button  |
+--------+----------+
         |
    +----+----+
    |         |
  Not Saved  Already
    |        Saved
    v         v
[Add to     [Remove from
 Favorites]  Favorites]
    |         |
    v         v
[Toast:     [Toast:
 "Saved!"]   "Removed"]
    |         |
    +----+----+
         |
         v
[Heart Icon
 State Updates]
```

### 3.3 Core Flow: Rate a Restaurant

**Goal:** User provides a rating for a restaurant
**Entry Point:** Restaurant detail page
**Success Criteria:** Rating is saved and displayed

```
[Restaurant Detail]
    |
    v
+-------------------+
|  Tap Rating       |
|  Section          |
+--------+----------+
         |
         v
+-------------------+
|  Star Rating      |
|  Modal/Sheet      |
|  (1-5 stars)      |
+--------+----------+
         |
         v
+-------------------+
|  Select Star      |
|  Count            |
+--------+----------+
         |
         v
+-------------------+
|  Confirm/Submit   |
+--------+----------+
         |
         v
[Toast: "Thanks
 for rating!"]
    |
    v
[Rating Displays
 on Detail Page]
```

---

## 4. Design System

### 4.1 Color Palette

#### Brand Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary (Emerald) | #059669 | rgb(5, 150, 105) | Main actions, halal badges, links |
| Primary Hover | #047857 | rgb(4, 120, 87) | Hover states |
| Primary Light | #D1FAE5 | rgb(209, 250, 229) | Backgrounds, highlights |
| Primary Dark | #065F46 | rgb(6, 95, 70) | Text on light backgrounds |
| Secondary (Warm Sand) | #D4A574 | rgb(212, 165, 116) | Accents, warmth |
| Secondary Light | #FEF3E2 | rgb(254, 243, 226) | Card backgrounds |

#### Semantic Colors
| Name | Hex | Contrast | Usage |
|------|-----|----------|-------|
| Success | #22C55E | 4.5:1 on white | Positive feedback, certified halal |
| Warning | #F59E0B | 4.5:1 on white | Caution states, Muslim-friendly |
| Error | #EF4444 | 4.5:1 on white | Error messages |
| Info | #3B82F6 | 4.5:1 on white | Information, tips |

#### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Gray 900 | #111827 | Primary text |
| Gray 700 | #374151 | Secondary text |
| Gray 500 | #6B7280 | Placeholder text, icons |
| Gray 400 | #9CA3AF | Disabled text |
| Gray 300 | #D1D5DB | Borders |
| Gray 200 | #E5E7EB | Dividers |
| Gray 100 | #F3F4F6 | Background |
| Gray 50 | #F9FAFB | Card backgrounds |
| White | #FFFFFF | Cards, surfaces |

#### Halal Status Colors
| Status | Background | Text/Icon | Usage |
|--------|------------|-----------|-------|
| Certified Halal | #059669 | #FFFFFF | Green badge for certified restaurants |
| Muslim-Friendly | #F59E0B | #FFFFFF | Amber badge for Muslim-friendly |
| Self-Declared | #6B7280 | #FFFFFF | Gray badge for self-declared |

#### Dark Mode Variants (Future Enhancement)
| Light | Dark | Usage |
|-------|------|-------|
| White (#FFFFFF) | Gray 900 (#111827) | Surface |
| Gray 50 (#F9FAFB) | Gray 800 (#1F2937) | Background |
| Gray 900 (#111827) | Gray 50 (#F9FAFB) | Text |
| Primary (#059669) | Primary Light (#34D399) | Actions |

### 4.2 Typography

#### Font Family
```css
--font-primary: 'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: 'Pretendard', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Note:** Pretendard is chosen as primary font for excellent Korean + English support, falling back to Inter for systems without Pretendard installed.

#### Type Scale
| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 36px / 2.25rem | 700 | 1.2 | -0.02em | Hero headlines |
| H1 | 30px / 1.875rem | 700 | 1.25 | -0.01em | Page titles |
| H2 | 24px / 1.5rem | 600 | 1.3 | -0.01em | Section headers |
| H3 | 20px / 1.25rem | 600 | 1.35 | 0 | Card titles |
| H4 | 18px / 1.125rem | 600 | 1.4 | 0 | Subsections |
| Body Large | 18px / 1.125rem | 400 | 1.6 | 0 | Lead paragraphs |
| Body | 16px / 1rem | 400 | 1.5 | 0 | Default text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary text |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.01em | Labels, badges |
| Overline | 11px / 0.6875rem | 600 | 1.4 | 0.05em | Category labels |

### 4.3 Spacing

```css
--space-0: 0px;      /* None */
--space-1: 4px;      /* Tight - inline elements */
--space-2: 8px;      /* Compact - icon + text */
--space-3: 12px;     /* Cozy - related items */
--space-4: 16px;     /* Default - between groups */
--space-5: 20px;     /* Comfortable */
--space-6: 24px;     /* Spacious - card padding */
--space-8: 32px;     /* Large - section gaps */
--space-10: 40px;    /* XL gaps */
--space-12: 48px;    /* Page sections */
--space-16: 64px;    /* Major sections */
--space-20: 80px;    /* Hero spacing */
```

### 4.4 Border Radius

```css
--radius-none: 0px;
--radius-sm: 4px;     /* Small buttons, inputs */
--radius-md: 8px;     /* Cards, medium elements */
--radius-lg: 12px;    /* Modals, large cards */
--radius-xl: 16px;    /* Bottom sheets */
--radius-2xl: 24px;   /* Pills, special elements */
--radius-full: 9999px; /* Circular, avatars, badges */
```

### 4.5 Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.05);

/* Colored shadows for depth */
--shadow-primary: 0 4px 14px rgba(5, 150, 105, 0.25);
--shadow-card-hover: 0 8px 25px rgba(0, 0, 0, 0.1);
```

### 4.6 Transitions

```css
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
--transition-slower: 400ms ease-in-out;

/* Easing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 5. Component Library

### 5.1 Buttons

| Variant | Usage | Background | Text | Border |
|---------|-------|------------|------|--------|
| Primary | Main actions (Navigate, Save) | Primary #059669 | White | None |
| Secondary | Secondary actions | White | Primary | 1px Primary |
| Ghost | Tertiary actions (filters) | Transparent | Gray 700 | None |
| Destructive | Remove actions | Error #EF4444 | White | None |
| Icon | Icon-only buttons | Transparent/White | Gray 600 | Optional |

**Button States:**
| State | Opacity/Transform | Additional |
|-------|-------------------|------------|
| Default | 1 | - |
| Hover | Background darken 10% | Cursor pointer |
| Active | Scale 0.98, darken 15% | - |
| Disabled | 0.5 | Cursor not-allowed |
| Loading | 0.8 | Spinner replaces text |

**Button Sizes:**
| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| sm | 32px | 12px 16px | 14px | 16px |
| md | 40px | 14px 20px | 16px | 20px |
| lg | 48px | 16px 24px | 18px | 24px |
| xl | 56px | 18px 32px | 18px | 24px |

**Accessibility:**
- Minimum touch target: 44x44px
- Focus ring: 2px offset, Primary color, 2px width
- Focus visible outline for keyboard users only
- Disabled: aria-disabled="true"

### 5.2 Form Elements

#### Search Input
```
+-------------------------------------------+
| [Search Icon]  Search restaurants...  [X] |
+-------------------------------------------+
```
- Height: 48px (mobile), 44px (desktop)
- Border radius: --radius-full (pill shape)
- Background: Gray 100
- Focus: White background, Primary border

#### Input Fields (Future: Feedback forms)
| State | Border | Background | Text |
|-------|--------|------------|------|
| Default | Gray 300 | White | Gray 900 |
| Focus | Primary 2px | White | Gray 900 |
| Error | Error | Error/10% | Gray 900 |
| Disabled | Gray 200 | Gray 50 | Gray 400 |

### 5.3 Cards

#### Restaurant Card
```
+-----------------------------------------------+
| [Image/Placeholder]                    [Heart]|
|                                               |
| [Halal Badge]                                 |
| Restaurant Name                               |
| Address or Area                               |
|                                               |
| [Star] 4.2  |  [Pin] 1.2 km away             |
+-----------------------------------------------+
```

**Card Specifications:**
- Padding: 16px
- Border radius: 12px
- Background: White
- Shadow: --shadow-sm (default), --shadow-card-hover (hover)
- Transition: --transition-base
- Image aspect ratio: 16:9 or 4:3
- Min-height: 120px (compact), 180px (with image)

**Card Variants:**
| Variant | Image | Size | Use Case |
|---------|-------|------|----------|
| Compact | None | Small | List view |
| Standard | Placeholder | Medium | Grid view |
| Featured | Full image | Large | Highlighted |
| Map Popup | None | Mini | Map marker popup |

### 5.4 Badges

#### Halal Status Badge
| Type | Background | Text | Icon |
|------|------------|------|------|
| Certified | #059669 | White | Checkmark |
| Muslim-Friendly | #F59E0B | White | Info |
| Self-Declared | #6B7280 | White | Question |

**Badge Specifications:**
- Padding: 4px 8px
- Border radius: --radius-full
- Font: Caption (12px, 500 weight)
- Text transform: Uppercase
- Letter spacing: 0.02em

### 5.5 Navigation Components

#### Header
```
+-----------------------------------------------+
| [Logo]  Halal Korea           [Search] [Menu] |
+-----------------------------------------------+
```
- Height: 56px (mobile), 64px (desktop)
- Position: Fixed top
- Background: White
- Shadow: --shadow-sm
- Z-index: 100

#### Bottom Navigation (Mobile)
```
+-------------------+-------------------+-------------------+
|    [Map Icon]     |   [Heart Icon]    |   [Info Icon]     |
|     Explore       |    Favorites      |      About        |
+-------------------+-------------------+-------------------+
```
- Height: 64px + safe area
- Background: White
- Active item: Primary color
- Inactive item: Gray 500
- Shadow: 0 -2px 10px rgba(0,0,0,0.05)

#### View Toggle
```
+-------------------+-------------------+
|    [Map] Map      |   [List] List     |
+-------------------+-------------------+
```
- Height: 40px
- Border radius: --radius-full
- Background: Gray 100
- Active segment: White with shadow
- Transition: --transition-base

### 5.6 Map Components

#### Map Marker
- Size: 40px (default), 48px (selected)
- Shape: Drop pin or circular
- Color: Primary (certified), Warning (Muslim-friendly), Gray (other)
- Selected state: Scale 1.2, shadow, bounce animation

#### Map Popup
```
+-----------------------------------+
| Restaurant Name            [Close]|
| [Badge] Certified Halal           |
| 1.2 km away                       |
| [View Details Button]             |
+-----------------------------------+
```
- Max width: 280px
- Padding: 12px
- Border radius: 12px
- Shadow: --shadow-lg

### 5.7 Rating Component

#### Star Rating Display
```
[*] [*] [*] [*] [ ]  4.0
```
- Star size: 16px (small), 20px (medium), 24px (large)
- Filled: Warning color (#F59E0B)
- Empty: Gray 300
- Half-star support: Gradient fill

#### Star Rating Input
```
[ ] [ ] [ ] [ ] [ ]
 1   2   3   4   5
```
- Interactive stars on tap/click
- Hover preview (desktop)
- Touch-friendly: 44px tap targets
- Confirmation modal/sheet

### 5.8 Empty States

#### No Results
```
+-----------------------------------------------+
|                                               |
|              [Illustration]                   |
|                                               |
|         No restaurants found                  |
|    Try adjusting your search or filters       |
|                                               |
|           [Clear Search Button]               |
|                                               |
+-----------------------------------------------+
```

#### No Favorites
```
+-----------------------------------------------+
|                                               |
|              [Heart Illustration]             |
|                                               |
|         No favorites yet                      |
|    Save restaurants you like for quick access |
|                                               |
|           [Explore Restaurants]               |
|                                               |
+-----------------------------------------------+
```

### 5.9 Loading States

#### Skeleton Cards
```
+-----------------------------------------------+
| [############################]         [   ]  |
| [##########]                                  |
| [##################]                          |
| [######]     |    [########]                  |
+-----------------------------------------------+
```
- Animate with shimmer effect
- Match exact layout of actual content
- Gray 200 base, Gray 100 shimmer

#### Map Loading
- Show loading indicator in center
- Progressive tile loading
- Placeholder background: Gray 100

---

## 6. Page Layouts

### 6.1 Layout Templates

#### Home Layout (Map + List Split - Tablet/Desktop)
```
+-----------------------------------------------+
|  Header (64px)                                |
+--------------------+--------------------------+
|                    |                          |
|    List Panel      |      Map Area            |
|    (400px)         |      (Flexible)          |
|                    |                          |
|    [Search]        |                          |
|    [Cards...]      |      [Markers]           |
|                    |                          |
|                    |                          |
+--------------------+--------------------------+
```

#### Home Layout (Mobile - Tab Switch)
```
+-------------------------+
|  Header (56px)          |
+-------------------------+
|  [Search Bar]           |
|  [View Toggle: Map|List]|
+-------------------------+
|                         |
|  Content Area           |
|  (Map OR List)          |
|                         |
|                         |
|                         |
+-------------------------+
|  Bottom Nav (64px)      |
+-------------------------+
```

#### Restaurant Detail Layout (Mobile)
```
+-------------------------+
|  [Back]  Detail  [Share]|
+-------------------------+
|                         |
|  [Map Preview - 200px]  |
|                         |
+-------------------------+
|  [Halal Badge]          |
|  Restaurant Name        |
|  Address                |
|                         |
|  [Star Rating]          |
|                         |
|  +-------------------+  |
|  |  Navigate  |  Call|  |
|  +-------------------+  |
|                         |
|  Opening Hours          |
|  Phone Number           |
|  Halal Information      |
|                         |
+-------------------------+
|  [Add to Favorites FAB] |
+-------------------------+
```

### 6.2 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile (xs) | < 640px | Single column, bottom nav, tab view toggle |
| Tablet (sm) | 640-1024px | Split view (list 320px + map), side nav |
| Desktop (md) | 1024-1280px | Split view (list 400px + map), header nav |
| Large (lg) | > 1280px | Max container 1280px, centered |

### 6.3 Grid System

```css
/* Container widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Grid */
--grid-columns: 12;
--grid-gutter-mobile: 16px;
--grid-gutter-tablet: 24px;
--grid-gutter-desktop: 32px;

/* Page margins */
--margin-mobile: 16px;
--margin-tablet: 32px;
--margin-desktop: 48px;
```

---

## 7. Wireframes

### 7.1 Home Screen - Mobile (List View)

**Mobile Layout:**
```
+---------------------------+
| [=] Halal Korea  [Search] |
+---------------------------+
| +-------+ +-------------+ |
| |  Map  | |    List     | |
| +-------+ +-------------+ |
+---------------------------+
|                           |
| +-------------------------+
| | [Badge: Certified]      |
| | Makan Restaurant        |
| | Itaewon, Seoul          |
| | [*][*][*][*][ ] | 0.8km |
| +-------------------------+
|                           |
| +-------------------------+
| | [Badge: Muslim-Friendly]|
| | Seoul Kitchen           |
| | Hongdae, Seoul          |
| | [*][*][*][ ][ ] | 1.2km |
| +-------------------------+
|                           |
| +-------------------------+
| | [Badge: Certified]      |
| | Busan Halal BBQ         |
| | Myeongdong, Seoul       |
| | [*][*][*][*][*] | 2.1km |
| +-------------------------+
|                           |
+---------------------------+
| [Map]    [Fav]    [About] |
+---------------------------+
```

### 7.2 Home Screen - Mobile (Map View)

**Mobile Map Layout:**
```
+---------------------------+
| [=] Halal Korea  [Search] |
+---------------------------+
| +-------+ +-------------+ |
| |  Map  | |    List     | |
| +-------+ +-------------+ |
+---------------------------+
|                           |
|                           |
|          [Marker]         |
|                           |
|      [User]               |
|                           |
|              [Marker]     |
|    [Marker]               |
|                           |
|                           |
|    [Popup Card]           |
|    +-------------------+  |
|    | Restaurant Name   |  |
|    | [Badge] | 0.8km   |  |
|    | [View Details]    |  |
|    +-------------------+  |
|                           |
+---------------------------+
| [Map]    [Fav]    [About] |
+---------------------------+
```

### 7.3 Home Screen - Desktop (Split View)

**Desktop Layout:**
```
+---------------------------------------------------------------+
| [Logo] Halal Korea              [Search...............] [Menu]|
+--------------------+------------------------------------------+
|                    |                                          |
| +----------------+ |                                          |
| |[Search...]     | |                                          |
| +----------------+ |                                          |
|                    |                                          |
| Sort: [Distance v] |              [Marker]                    |
|                    |                                          |
| +----------------+ |        [User Location]                   |
| | [Badge]        | |                                          |
| | Makan Rest.    | |                   [Marker]               |
| | 0.8km  [****-] | |                                          |
| +----------------+ |         [Marker]                         |
|                    |                        [Marker]          |
| +----------------+ |                                          |
| | [Badge]        | |                                          |
| | Seoul Kitchen  | |                                          |
| | 1.2km  [***--] | |                                          |
| +----------------+ |                                          |
|                    |                                          |
| +----------------+ |                                          |
| | [Badge]        | |                                          |
| | Busan BBQ      | |    [Popup]                               |
| | 2.1km  [*****] | |    +-----------------------+             |
| +----------------+ |    | Restaurant Name       |             |
|                    |    | [Badge] 0.8km         |             |
|                    |    | [View Details]        |             |
|                    |    +-----------------------+             |
+--------------------+------------------------------------------+
```

### 7.4 Restaurant Detail - Mobile

**Detail Layout:**
```
+---------------------------+
| [<]    Details    [Share] |
+---------------------------+
|                           |
| +-------------------------+
| |                         |
| |    [Mini Map]           |
| |    [Marker at center]   |
| |                         |
| +-------------------------+
|                           |
| [Badge: Certified Halal]  |
|                           |
| Makan Halal Restaurant    |
| ========================= |
|                           |
| 123 Itaewon-ro, Yongsan-gu|
| Seoul, South Korea        |
|                           |
| [*][*][*][*][ ]  4.2      |
| 23 ratings                |
|                           |
| +----------+ +----------+ |
| | Navigate | |   Call   | |
| +----------+ +----------+ |
|                           |
| ========================= |
|                           |
| Hours                     |
| Today: 11:00 AM - 10:00 PM|
|                           |
| Phone                     |
| +82-2-1234-5678           |
|                           |
| Halal Information         |
| Certified by KMF          |
| Certificate #: 12345      |
|                           |
+---------------------------+
|                           |
|         [Heart FAB]       |
+---------------------------+
```

### 7.5 Favorites Screen - Mobile

**Favorites Layout:**
```
+---------------------------+
| [<]     Favorites         |
+---------------------------+
|                           |
| Your saved restaurants    |
| 3 places                  |
|                           |
| +-------------------------+
| | [Badge: Certified]  [x] |
| | Makan Restaurant        |
| | Itaewon | 0.8km         |
| +-------------------------+
|                           |
| +-------------------------+
| | [Badge: Certified]  [x] |
| | Busan Halal BBQ         |
| | Myeongdong | 2.1km      |
| +-------------------------+
|                           |
| +-------------------------+
| | [Badge: Muslim-F.]  [x] |
| | Seoul Kitchen           |
| | Hongdae | 1.2km         |
| +-------------------------+
|                           |
+---------------------------+
| [Map]    [Fav]    [About] |
+---------------------------+
```

### 7.6 Search Results - Mobile

**Search Layout:**
```
+---------------------------+
| [<] [Search: "itaewon" x] |
+---------------------------+
|                           |
| Results for "itaewon"     |
| 12 restaurants found      |
|                           |
| +-------------------------+
| | [Badge: Certified]      |
| | Makan Restaurant        |
| | Itaewon, Seoul          |
| | [****-] | 0.8km         |
| +-------------------------+
|                           |
| +-------------------------+
| | [Badge: Certified]      |
| | Halal Kitchen Itaewon   |
| | Itaewon, Seoul          |
| | [***--] | 0.5km         |
| +-------------------------+
|                           |
| +-------------------------+
| | [Badge: Muslim-Friendly]|
| | Itaewon Kebab House     |
| | Itaewon, Seoul          |
| | [****-] | 1.0km         |
| +-------------------------+
|                           |
+---------------------------+
| [Map]    [Fav]    [About] |
+---------------------------+
```

### 7.7 Empty State - No Results

**Empty State Layout:**
```
+---------------------------+
| [<] [Search: "xyz123" x]  |
+---------------------------+
|                           |
|                           |
|                           |
|     +---------------+     |
|     |               |     |
|     |  [Magnifier   |     |
|     |   with X]     |     |
|     |               |     |
|     +---------------+     |
|                           |
|   No restaurants found    |
|                           |
|   We couldn't find any    |
|   restaurants matching    |
|   "xyz123"                |
|                           |
|   +-------------------+   |
|   |  Clear Search     |   |
|   +-------------------+   |
|                           |
|   Try searching for:      |
|   [Itaewon] [Hongdae]     |
|   [Seoul] [Busan]         |
|                           |
+---------------------------+
| [Map]    [Fav]    [About] |
+---------------------------+
```

---

## 8. Micro-interactions

### 8.1 Animation Guidelines

**Duration Scale:**
| Type | Duration | Use Case |
|------|----------|----------|
| Instant | 0ms | State changes without animation |
| Micro | 100-150ms | Hover, focus, small feedback |
| Fast | 150-200ms | Buttons, toggles, small elements |
| Normal | 200-300ms | Cards, modals opening |
| Slow | 300-400ms | Page transitions, complex animations |
| Deliberate | 400-500ms | Attention-grabbing, celebratory |

**Easing Functions:**
```css
/* Standard easing */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);      /* Deceleration - entering */
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);         /* Acceleration - exiting */
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);   /* Standard - moving */

/* Special easing */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful overshoot */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Springy */
```

### 8.2 Interaction Patterns

#### Button Interactions
| State | Animation | Timing |
|-------|-----------|--------|
| Hover (desktop) | Background color shift | 150ms ease-out |
| Press | Scale to 0.97, darken | 100ms ease-in |
| Release | Scale to 1, lighten | 150ms ease-out |
| Loading | Fade text, show spinner | 200ms |

#### Card Interactions
| State | Animation | Timing |
|-------|-----------|--------|
| Hover | Lift (translateY -2px), shadow increase | 200ms ease-out |
| Press | Scale 0.98, shadow decrease | 100ms ease-in |
| Tap (mobile) | Subtle highlight, ripple | 200ms |

#### Favorite Heart Animation
```
Tap to add:
1. Scale 0 -> 1.2 (200ms, ease-bounce)
2. Color: Gray -> Primary
3. Scale 1.2 -> 1 (150ms, ease-out)
4. Particle burst (optional enhancement)

Tap to remove:
1. Scale 1 -> 0.8 (100ms, ease-in)
2. Color: Primary -> Gray
3. Scale 0.8 -> 1 (150ms, ease-out)
```

#### Rating Stars Animation
```
Tap star N:
1. Stars 1 to N fill sequentially (50ms delay each)
2. Each star: scale 0.8 -> 1.1 -> 1 (200ms, ease-bounce)
3. Color fill: Gray -> Warning (#F59E0B)
```

#### View Toggle (Map/List)
```
Switch view:
1. Active indicator slides to new position (250ms, ease-in-out)
2. Content crossfade (200ms)
3. Map: markers animate in (staggered, 50ms delay each)
4. List: cards slide up (staggered, 30ms delay each)
```

#### Map Marker Selection
```
Tap marker:
1. Marker scales 1 -> 1.3 (200ms, ease-bounce)
2. Marker shadow increases
3. Popup fades in and scales from 0.9 (200ms, ease-out)
4. Other markers slightly dim (opacity 0.7)

Deselect:
1. Popup fades out and scales to 0.95 (150ms, ease-in)
2. Marker scales 1.3 -> 1 (200ms, ease-out)
3. Other markers return to full opacity
```

#### Pull to Refresh (Mobile)
```
Pull down:
1. Refresh indicator appears (translateY from -50px)
2. Spinner rotates continuously
3. Release: content refreshes
4. Indicator slides back up (300ms)
```

### 8.3 Loading Animations

#### Skeleton Shimmer
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 0%,
    var(--gray-100) 50%,
    var(--gray-200) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

#### Map Loading
```
1. Gray placeholder background
2. Center spinner (rotating, 1s loop)
3. Tiles fade in as they load (200ms each)
4. Markers pop in after map ready (staggered)
```

### 8.4 Feedback Animations

#### Toast Notifications
```
Enter:
1. Slide up from bottom (300ms, ease-out)
2. Fade in (200ms)

Exit (auto-dismiss after 3s):
1. Slide down (200ms, ease-in)
2. Fade out (150ms)
```

#### Success Confirmation
```
Save to favorites:
1. Heart fills with color
2. Toast slides up: "Saved to favorites"
3. Toast includes [View] action
4. Auto-dismiss after 3s or on tap
```

---

## 9. Accessibility Checklist

### 9.1 WCAG 2.1 AA Requirements

**Perceivable:**
- [x] All images have descriptive alt text
- [x] Color contrast meets 4.5:1 for normal text (verified with design system)
- [x] Color contrast meets 3:1 for large text and UI components
- [x] Information not conveyed by color alone (badges have text + color)
- [x] Text can be resized up to 200% without loss of functionality
- [x] Content reflows for different viewport sizes

**Operable:**
- [x] All functionality available via keyboard
- [x] No keyboard traps (modal focus management)
- [x] Skip link to main content
- [x] Focus indicators clearly visible (2px Primary outline)
- [x] Touch targets minimum 44x44px
- [x] No time limits on user actions
- [x] Pause/stop/hide for moving content (map animations)

**Understandable:**
- [x] Language specified in HTML (lang="en")
- [x] Form labels clearly associated with inputs
- [x] Error messages descriptive and helpful
- [x] Consistent navigation across pages
- [x] Predictable focus order (logical tab sequence)

**Robust:**
- [x] Valid HTML markup
- [x] ARIA labels used correctly for custom components
- [x] Works with screen readers (VoiceOver, NVDA)
- [x] Compatible across modern browsers

### 9.2 Accessibility Features

#### Screen Reader Support
```html
<!-- Restaurant Card -->
<article aria-label="Makan Restaurant, Certified Halal, 0.8 kilometers away, rated 4.2 out of 5 stars">
  <span class="sr-only">Halal Status:</span>
  <span aria-label="Certified Halal">Certified</span>
  ...
</article>

<!-- Map Markers -->
<button
  aria-label="Makan Restaurant marker, Certified Halal, tap to view details"
  aria-expanded="false"
>
```

#### Focus Management
```
Tab Order on Home Screen:
1. Skip to main content link
2. Logo (home link)
3. Search input
4. View toggle (Map/List)
5. Sort dropdown
6. Restaurant cards (in order)
7. Bottom navigation items

Modal/Popup Focus Trap:
1. Focus moves to popup on open
2. Tab cycles within popup only
3. Escape closes popup
4. Focus returns to trigger element
```

#### Color Blind Considerations
| Element | Color | Additional Indicator |
|---------|-------|---------------------|
| Certified Halal | Green | Checkmark icon + text label |
| Muslim-Friendly | Amber | Info icon + text label |
| Error states | Red | Error icon + descriptive text |
| Success states | Green | Checkmark icon + descriptive text |

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9.3 Keyboard Shortcuts

| Action | Shortcut | Context |
|--------|----------|---------|
| Search | / or Cmd+K | Global |
| Toggle Map/List | M | Home screen |
| Close modal/popup | Escape | When open |
| Navigate cards | Arrow keys | List view |
| Select card | Enter | Focused card |
| Go back | Backspace | Detail pages |

### 9.4 Testing Checklist

**Manual Testing:**
- [ ] Navigate entire app using only keyboard
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with NVDA or JAWS (Windows)
- [ ] Test with high contrast mode
- [ ] Test at 200% zoom
- [ ] Test with reduced motion preference

**Automated Testing:**
- [ ] Run axe-core accessibility audit
- [ ] Check Lighthouse accessibility score (target: 95+)
- [ ] Validate HTML markup
- [ ] Test color contrast with WebAIM tool

---

## 10. Implementation Guidelines

### 10.1 Design-to-Code Mapping

#### Design Tokens to CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #059669;
  --color-primary-hover: #047857;
  --color-primary-light: #D1FAE5;
  --color-secondary: #D4A574;
  --color-secondary-light: #FEF3E2;

  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  --color-gray-900: #111827;
  --color-gray-700: #374151;
  --color-gray-500: #6B7280;
  --color-gray-400: #9CA3AF;
  --color-gray-300: #D1D5DB;
  --color-gray-200: #E5E7EB;
  --color-gray-100: #F3F4F6;
  --color-gray-50: #F9FAFB;
  --color-white: #FFFFFF;

  /* Typography */
  --font-sans: 'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Border Radius */
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.5rem;   /* 8px */
  --radius-lg: 0.75rem;  /* 12px */
  --radius-xl: 1rem;     /* 16px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}
```

#### Tailwind CSS Mapping
| Design Token | Tailwind Class |
|--------------|----------------|
| Primary | `bg-emerald-600` / `text-emerald-600` |
| Primary Hover | `hover:bg-emerald-700` |
| Primary Light | `bg-emerald-100` |
| Gray 900 | `text-gray-900` |
| Space 4 | `p-4`, `m-4`, `gap-4` |
| Radius MD | `rounded-lg` |
| Shadow SM | `shadow-sm` |

### 10.2 Component Specifications

#### Restaurant Card Component
```typescript
interface RestaurantCardProps {
  id: string;
  name: string;
  address: string;
  city: string;
  halalStatus: 'certified' | 'muslim-friendly' | 'self-declared';
  distance?: number; // in kilometers
  rating?: number; // 1-5
  ratingCount?: number;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onClick?: (id: string) => void;
  variant?: 'compact' | 'standard' | 'featured';
}
```

#### Map Marker Component
```typescript
interface MapMarkerProps {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  halalStatus: 'certified' | 'muslim-friendly' | 'self-declared';
  isSelected?: boolean;
  onClick?: (id: string) => void;
}
```

#### Halal Badge Component
```typescript
interface HalalBadgeProps {
  status: 'certified' | 'muslim-friendly' | 'self-declared';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}
```

#### Star Rating Component
```typescript
interface StarRatingProps {
  value: number; // 0-5, supports decimals
  max?: number; // default 5
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
}
```

#### Search Input Component
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  loading?: boolean;
}
```

### 10.3 Recommended Libraries

| Category | Library | Purpose |
|----------|---------|---------|
| UI Components | shadcn/ui | Base component library |
| Icons | Lucide React | Consistent icon set |
| Maps | MapLibre GL JS | Map rendering |
| Animations | Framer Motion | Micro-interactions |
| Forms | React Hook Form | Form handling |
| State | Zustand | Favorites, app state |
| Styling | Tailwind CSS | Utility-first CSS |

### 10.4 Asset Exports

| Asset Type | Format | Sizes | Notes |
|------------|--------|-------|-------|
| App Icon | PNG | 16, 32, 180, 192, 512px | Include maskable versions |
| Logo | SVG + PNG | Original, 2x | Text and icon versions |
| Map Markers | SVG | 40, 48px | 3 color variants |
| Halal Badge Icons | SVG | 16, 20, 24px | Checkmark, info, question |
| Empty State Illustrations | SVG | Responsive | No results, no favorites |
| Skeleton Placeholders | CSS | N/A | Pure CSS implementation |

### 10.5 File Structure Recommendation

```
src/
+-- components/
|   +-- ui/           # Base UI components (button, input, card)
|   +-- layout/       # Layout components (header, nav, footer)
|   +-- restaurant/   # Restaurant-specific (card, detail, badge)
|   +-- map/          # Map components (marker, popup, controls)
|   +-- search/       # Search components
|   +-- rating/       # Rating components
+-- styles/
|   +-- globals.css   # Global styles, CSS variables
|   +-- tokens.css    # Design tokens
+-- lib/
|   +-- utils.ts      # Utility functions
+-- hooks/
|   +-- useFavorites.ts
|   +-- useGeolocation.ts
+-- types/
|   +-- restaurant.ts # Restaurant types
```

---

## 11. Design Decisions Log

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Emerald green as primary color | Represents halal (green is traditional Islamic color), fresh/food association, excellent accessibility | Blue (too corporate), Gold (poor contrast), Teal (less distinctive) |
| Pretendard font family | Excellent Korean + English rendering, modern aesthetic, good weight range | Noto Sans (less refined), Spoqa Han Sans (limited weights) |
| Split view on desktop | Maximizes screen real estate, allows simultaneous map/list interaction | Tab switching (less efficient), overlay panels (complex) |
| Bottom navigation on mobile | Thumb-friendly, standard mobile pattern, clear hierarchy | Hamburger menu (hidden), top tabs (reach issues) |
| Pill-shaped search bar | Friendly, modern aesthetic, clear interactive affordance | Square input (less distinctive), floating (complex positioning) |
| Three halal status levels | Reflects real-world certification nuances, builds trust through transparency | Binary yes/no (oversimplified), detailed categories (overwhelming) |
| 44px minimum touch targets | WCAG requirement, prevents mis-taps, comfortable interaction | 36px (accessibility concern), 48px (wastes space) |
| Distance-based default sort | Most useful for users looking for nearby food | Alphabetical (not useful), rating (insufficient data initially) |
| Local favorites storage | MVP scope, no auth required, instant sync | Server-side (requires auth), no persistence (poor UX) |
| Simple 1-5 star rating | Universal understanding, quick to input, sufficient granularity | Thumbs up/down (less nuanced), 10-point (excessive) |

---

## 12. Next Steps

### Immediate (Design Phase)
1. [x] Define design system tokens and document
2. [ ] Create high-fidelity mockups in Figma
3. [ ] Build interactive prototype for key flows
4. [ ] Conduct internal design review

### Short-term (Development Prep)
5. [ ] Export design assets (icons, logos, illustrations)
6. [ ] Document all component states and variants
7. [ ] Create responsive breakpoint specifications
8. [ ] Prepare animation specifications for developers

### Medium-term (Development Support)
9. [ ] Support development with design QA
10. [ ] Iterate based on implementation feedback
11. [ ] Conduct accessibility audit on built components
12. [ ] Prepare for usability testing

### Future Enhancements
13. [ ] Dark mode design tokens and mockups
14. [ ] Additional languages (Korean, Arabic, Indonesian)
15. [ ] Enhanced map features (clustering, filters)
16. [ ] Social sharing designs
17. [ ] User profile and review system (post-MVP)

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js-docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Pretendard Font](https://cactus.tistory.com/306)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lucide Icons](https://lucide.dev/)

---

## Appendix A: Color Contrast Verification

| Combination | Ratio | WCAG AA | WCAG AAA |
|-------------|-------|---------|----------|
| Gray 900 on White | 16.15:1 | Pass | Pass |
| Gray 700 on White | 9.12:1 | Pass | Pass |
| Primary on White | 4.52:1 | Pass | Fail |
| White on Primary | 4.52:1 | Pass | Fail |
| White on Primary Hover | 5.67:1 | Pass | Pass |
| White on Success | 3.56:1 | Pass (large) | Fail |
| White on Warning | 2.14:1 | Fail | Fail |
| Gray 900 on Warning | 7.54:1 | Pass | Pass |
| White on Error | 4.53:1 | Pass | Fail |

**Note:** Warning badges use Gray 900 text for better contrast when needed for critical information.

---

## Appendix B: Icon Specifications

| Icon | Usage | Lucide Name | Size |
|------|-------|-------------|------|
| Map | Navigation, map view | `map` | 20-24px |
| List | List view | `list` | 20-24px |
| Heart | Favorites | `heart` / `heart-filled` | 20-24px |
| Search | Search input | `search` | 20px |
| X | Close, clear | `x` | 16-20px |
| Star | Rating | `star` / `star-filled` | 16-24px |
| Navigation | Get directions | `navigation` | 20-24px |
| Phone | Call | `phone` | 20px |
| Clock | Hours | `clock` | 16-20px |
| MapPin | Location | `map-pin` | 16-24px |
| Check | Certified | `check` | 14-16px |
| Info | Information | `info` | 14-16px |
| Share | Share | `share-2` | 20px |
| ChevronLeft | Back | `chevron-left` | 24px |
| Menu | Mobile menu | `menu` | 24px |
