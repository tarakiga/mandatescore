-- 011_backfill_trend_signals
-- Forward migration
-- Backfills initial trend signals for seeded officials using formula version trend-v1.

BEGIN;

INSERT INTO official_trend_signal (
  id,
  official_id,
  window_start,
  window_end,
  search_volume_index,
  recency_index,
  evidence_velocity_index,
  score_movement_index,
  trend_score,
  formula_version
)
VALUES
  (
    '95d2f71b-9f4a-4b57-9f5c-733bc5fce100',
    '7fcd6c31-8703-4ece-a4a0-4fa1b2d9a800',
    NOW() - INTERVAL '7 days',
    NOW(),
    88.00,
    90.00,
    84.00,
    75.00,
    85.85,
    'trend-v1'
  ),
  (
    '95d2f71b-9f4a-4b57-9f5c-733bc5fce101',
    '7fcd6c31-8703-4ece-a4a0-4fa1b2d9a801',
    NOW() - INTERVAL '7 days',
    NOW(),
    74.00,
    81.00,
    62.00,
    60.00,
    70.45,
    'trend-v1'
  ),
  (
    '95d2f71b-9f4a-4b57-9f5c-733bc5fce102',
    '7fcd6c31-8703-4ece-a4a0-4fa1b2d9a802',
    NOW() - INTERVAL '7 days',
    NOW(),
    61.00,
    69.00,
    48.00,
    45.00,
    57.45,
    'trend-v1'
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
