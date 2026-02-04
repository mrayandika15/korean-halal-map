-- Migration: 001_initial_schema.sql
-- Description: Initial schema for Halal Korea MVP
-- Tables: devices, favorites, ratings
-- Created: 2026-02-04

-- ============================================================================
-- DEVICES TABLE
-- Purpose: Track anonymous devices for favorites/ratings without authentication
-- ============================================================================

CREATE TABLE public.devices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on device_id for lookups
CREATE INDEX idx_devices_device_id ON public.devices (device_id);

COMMENT ON TABLE public.devices IS 'Anonymous device tracking for favorites and ratings';
COMMENT ON COLUMN public.devices.device_id IS 'Client-generated UUID stored in localStorage';

-- ============================================================================
-- FAVORITES TABLE
-- Purpose: Store user favorites (bookmarked restaurants)
-- ============================================================================

CREATE TABLE public.favorites (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint: one favorite per device per restaurant
  CONSTRAINT unique_device_restaurant_favorite UNIQUE (device_id, restaurant_id)
);

-- Index for querying favorites by device
CREATE INDEX idx_favorites_device_id ON public.favorites (device_id);

-- Index for counting favorites per restaurant
CREATE INDEX idx_favorites_restaurant_id ON public.favorites (restaurant_id);

COMMENT ON TABLE public.favorites IS 'Device-based restaurant favorites/bookmarks';

-- ============================================================================
-- RATINGS TABLE
-- Purpose: Store user ratings (1-5 stars)
-- ============================================================================

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

-- Composite index for common query pattern (average calculation)
CREATE INDEX idx_ratings_restaurant_rating ON public.ratings (restaurant_id, rating);

COMMENT ON TABLE public.ratings IS 'Device-based restaurant ratings (1-5 stars)';

-- ============================================================================
-- DOWN MIGRATION (for rollback)
-- Run these statements in reverse order to rollback
-- ============================================================================
-- DROP TABLE IF EXISTS public.ratings;
-- DROP TABLE IF EXISTS public.favorites;
-- DROP TABLE IF EXISTS public.devices;
