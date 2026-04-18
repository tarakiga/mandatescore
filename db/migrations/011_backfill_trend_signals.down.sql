-- 011_backfill_trend_signals rollback
-- Reverse migration
-- Removes seeded trend signal rows.

BEGIN;

DELETE FROM official_trend_signal
WHERE id IN (
  '95d2f71b-9f4a-4b57-9f5c-733bc5fce100',
  '95d2f71b-9f4a-4b57-9f5c-733bc5fce101',
  '95d2f71b-9f4a-4b57-9f5c-733bc5fce102'
);

COMMIT;
