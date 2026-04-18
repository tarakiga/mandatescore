-- 010_seed_priority_jurisdictions rollback
-- Reverse migration
-- Removes seeded priority jurisdictions and officials.

BEGIN;

DELETE FROM official
WHERE id IN (
  '7fcd6c31-8703-4ece-a4a0-4fa1b2d9a800',
  '7fcd6c31-8703-4ece-a4a0-4fa1b2d9a801',
  '7fcd6c31-8703-4ece-a4a0-4fa1b2d9a802'
);

DELETE FROM source_registry
WHERE id IN (
  '6ed91a8d-0d68-4b8f-a9b5-3ab274b7f700',
  '6ed91a8d-0d68-4b8f-a9b5-3ab274b7f701',
  '6ed91a8d-0d68-4b8f-a9b5-3ab274b7f702'
);

COMMIT;
