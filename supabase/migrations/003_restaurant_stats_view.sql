-- Migration: 003_restaurant_stats_view.sql
-- Purpose: Create materialized view for aggregated restaurant statistics
-- Up

-- Materialized view for restaurant statistics
-- Aggregates favorites and ratings per restaurant for fast lookups
CREATE MATERIALIZED VIEW public.restaurant_stats AS
SELECT
  restaurant_id,
  COUNT(DISTINCT f.device_id) AS favorite_count,
  COALESCE(ROUND(AVG(r.rating)::NUMERIC, 2), 0) AS average_rating,
  COUNT(r.id) AS rating_count
FROM
  (SELECT DISTINCT restaurant_id FROM public.favorites
   UNION
   SELECT DISTINCT restaurant_id FROM public.ratings) AS restaurants
LEFT JOIN public.favorites f USING (restaurant_id)
LEFT JOIN public.ratings r USING (restaurant_id)
GROUP BY restaurant_id;

-- Unique index on restaurant_id for fast lookups and REFRESH CONCURRENTLY support
CREATE UNIQUE INDEX idx_restaurant_stats_id ON public.restaurant_stats (restaurant_id);

-- Grant read access to anonymous users
GRANT SELECT ON public.restaurant_stats TO anon;

-- Comment for documentation
COMMENT ON MATERIALIZED VIEW public.restaurant_stats IS 'Aggregated favorites and ratings per restaurant. Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY public.restaurant_stats;';

-- Down (for rollback)
-- DROP MATERIALIZED VIEW IF EXISTS public.restaurant_stats;
