-- 010_seed_priority_jurisdictions
-- Forward migration
-- Seeds initial priority jurisdictions and officials for Phase 1.

BEGIN;

INSERT INTO source_registry (
  id,
  source_name,
  source_type,
  jurisdiction_code,
  base_url,
  credibility_tier,
  is_active
)
VALUES
  ('6ed91a8d-0d68-4b8f-a9b5-3ab274b7f700', 'NYC Mayor Official Site', 'speech', 'US-NY-NYC', 'https://www.nyc.gov', 4, TRUE),
  ('6ed91a8d-0d68-4b8f-a9b5-3ab274b7f701', 'London City Hall', 'report', 'UK-LON', 'https://www.london.gov.uk', 4, TRUE),
  ('6ed91a8d-0d68-4b8f-a9b5-3ab274b7f702', 'NYC Council Legislative Feed', 'gazette', 'US-NY-NYC', 'https://legistar.council.nyc.gov', 5, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO official (
  id,
  slug,
  display_name,
  office,
  country_code,
  jurisdiction,
  term_start,
  term_end
)
VALUES
  ('7fcd6c31-8703-4ece-a4a0-4fa1b2d9a800', 'zohran-mamdani', 'Zohran Mamdani', 'Mayor', 'US', 'New York City, US', '2026-01-01', '2030-12-31'),
  ('7fcd6c31-8703-4ece-a4a0-4fa1b2d9a801', 'london-breed', 'London Breed', 'Mayor', 'US', 'San Francisco, US', '2024-01-01', '2028-12-31'),
  ('7fcd6c31-8703-4ece-a4a0-4fa1b2d9a802', 'eric-adams', 'Eric Adams', 'Mayor', 'US', 'New York City, US', '2022-01-01', '2025-12-31')
ON CONFLICT (slug) DO NOTHING;

COMMIT;
