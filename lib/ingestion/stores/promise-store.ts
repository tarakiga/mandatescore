import { Pool } from "pg";
import type { PromiseCandidate } from "../types";

export type SavedPromiseRecord = PromiseCandidate & {
  readonly promiseId: string;
  readonly officialId: string;
  readonly sourceDocumentId?: string;
};

export interface PromiseStore {
  saveMany(input: {
    readonly officialId: string;
    readonly sourceDocumentId?: string;
    readonly promises: readonly PromiseCandidate[];
  }): Promise<readonly SavedPromiseRecord[]>;
}

class InMemoryPromiseStore implements PromiseStore {
  private readonly records: SavedPromiseRecord[] = [];

  public async saveMany(input: {
    readonly officialId: string;
    readonly sourceDocumentId?: string;
    readonly promises: readonly PromiseCandidate[];
  }): Promise<readonly SavedPromiseRecord[]> {
    const saved = input.promises.map((promise) => ({
      promiseId: crypto.randomUUID(),
      officialId: input.officialId,
      sourceDocumentId: input.sourceDocumentId,
      ...promise
    }));
    this.records.push(...saved);
    return saved;
  }
}

class PostgresPromiseStore implements PromiseStore {
  private readonly pool: Pool;

  public constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async saveMany(input: {
    readonly officialId: string;
    readonly sourceDocumentId?: string;
    readonly promises: readonly PromiseCandidate[];
  }): Promise<readonly SavedPromiseRecord[]> {
    const officialId = toOfficialUuid(input.officialId);
    if (!officialId) {
      throw new Error(`Invalid officialId for postgres mode: "${input.officialId}"`);
    }
    const normalizedSourceDocumentId = toOptionalUuid(input.sourceDocumentId);

    const saved: SavedPromiseRecord[] = [];
    for (const promise of input.promises) {
      const promiseId = crypto.randomUUID();
      await this.pool.query(
        `
        INSERT INTO promise
          (id, official_id, promise_key, statement_text, source_document_id, extraction_confidence, extraction_model_version)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (official_id, promise_key) DO NOTHING
        `,
        [
          promiseId,
          officialId,
          promise.promiseKey,
          promise.statementText,
          normalizedSourceDocumentId,
          promise.extractionConfidence,
          promise.extractionModelVersion
        ]
      );
      saved.push({
        promiseId,
        officialId,
        sourceDocumentId: normalizedSourceDocumentId ?? undefined,
        ...promise
      });
    }
    return saved;
  }
}

let singleton: PromiseStore | null = null;

export function getPromiseStore(): PromiseStore {
  if (singleton) return singleton;
  const mode = process.env.INGESTION_DATA_STORE?.toLowerCase();
  const connectionString = process.env.DATABASE_URL;
  singleton = mode === "postgres" && connectionString
    ? new PostgresPromiseStore(connectionString)
    : new InMemoryPromiseStore();
  return singleton;
}

const OFFICIAL_SLUG_TO_UUID: Readonly<Record<string, string>> = {
  "zohran-mamdani": "7fcd6c31-8703-4ece-a4a0-4fa1b2d9a800",
  "london-breed": "7fcd6c31-8703-4ece-a4a0-4fa1b2d9a801",
  "eric-adams": "7fcd6c31-8703-4ece-a4a0-4fa1b2d9a802"
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toOfficialUuid(input: string): string | null {
  if (UUID_REGEX.test(input)) return input;
  return OFFICIAL_SLUG_TO_UUID[input] ?? null;
}

function toOptionalUuid(input?: string): string | null {
  if (!input) return null;
  return UUID_REGEX.test(input) ? input : null;
}
