-- Migration: 002_rls_policies.sql
-- Description: Row Level Security policies for Halal Korea MVP
-- Enables RLS on devices, favorites, ratings tables
-- Uses device_id from x-device-id header for access control
-- Created: 2026-02-04

-- ============================================================================
-- HELPER FUNCTION
-- Purpose: Extract device_id from request header for RLS policies
-- Performance: Using (SELECT public.get_device_id()) pattern prevents
--              re-evaluation per row
-- ============================================================================

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

COMMENT ON FUNCTION public.get_device_id() IS 'Extracts device_id from x-device-id request header for RLS';

-- ============================================================================
-- DEVICES TABLE RLS
-- Purpose: Devices can only access their own record
-- Insert: Allowed for any device (to register new devices)
-- Select/Update: Restricted to own device_id
-- ============================================================================

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Allow inserting new devices (anonymous access for registration)
CREATE POLICY devices_insert_policy ON public.devices
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading own device record only
CREATE POLICY devices_select_policy ON public.devices
  FOR SELECT
  TO anon
  USING (device_id = (SELECT public.get_device_id()));

-- Allow updating own device record (e.g., last_seen_at)
CREATE POLICY devices_update_policy ON public.devices
  FOR UPDATE
  TO anon
  USING (device_id = (SELECT public.get_device_id()))
  WITH CHECK (device_id = (SELECT public.get_device_id()));

-- ============================================================================
-- FAVORITES TABLE RLS
-- Purpose: Devices can only manage their own favorites
-- Insert: Must match own device_id
-- Select/Delete: Restricted to own device_id
-- ============================================================================

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Allow inserting favorites for own device only
CREATE POLICY favorites_insert_policy ON public.favorites
  FOR INSERT
  TO anon
  WITH CHECK (device_id = (SELECT public.get_device_id()));

-- Allow reading own favorites only
CREATE POLICY favorites_select_policy ON public.favorites
  FOR SELECT
  TO anon
  USING (device_id = (SELECT public.get_device_id()));

-- Allow deleting own favorites only
CREATE POLICY favorites_delete_policy ON public.favorites
  FOR DELETE
  TO anon
  USING (device_id = (SELECT public.get_device_id()));

-- ============================================================================
-- RATINGS TABLE RLS
-- Purpose: Devices can only manage their own ratings
-- Insert: Must match own device_id
-- Select/Update/Delete: Restricted to own device_id
-- ============================================================================

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Allow inserting ratings for own device only
CREATE POLICY ratings_insert_policy ON public.ratings
  FOR INSERT
  TO anon
  WITH CHECK (device_id = (SELECT public.get_device_id()));

-- Allow reading own ratings only
CREATE POLICY ratings_select_policy ON public.ratings
  FOR SELECT
  TO anon
  USING (device_id = (SELECT public.get_device_id()));

-- Allow updating own ratings only
CREATE POLICY ratings_update_policy ON public.ratings
  FOR UPDATE
  TO anon
  USING (device_id = (SELECT public.get_device_id()))
  WITH CHECK (device_id = (SELECT public.get_device_id()));

-- Allow deleting own ratings only
CREATE POLICY ratings_delete_policy ON public.ratings
  FOR DELETE
  TO anon
  USING (device_id = (SELECT public.get_device_id()));

-- ============================================================================
-- DOWN MIGRATION (for rollback)
-- Run these statements in reverse order to rollback
-- ============================================================================
-- DROP POLICY IF EXISTS ratings_delete_policy ON public.ratings;
-- DROP POLICY IF EXISTS ratings_update_policy ON public.ratings;
-- DROP POLICY IF EXISTS ratings_select_policy ON public.ratings;
-- DROP POLICY IF EXISTS ratings_insert_policy ON public.ratings;
-- ALTER TABLE public.ratings DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS favorites_delete_policy ON public.favorites;
-- DROP POLICY IF EXISTS favorites_select_policy ON public.favorites;
-- DROP POLICY IF EXISTS favorites_insert_policy ON public.favorites;
-- ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;
--
-- DROP POLICY IF EXISTS devices_update_policy ON public.devices;
-- DROP POLICY IF EXISTS devices_select_policy ON public.devices;
-- DROP POLICY IF EXISTS devices_insert_policy ON public.devices;
-- ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
--
-- DROP FUNCTION IF EXISTS public.get_device_id();
