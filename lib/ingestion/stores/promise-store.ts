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
          input.officialId,
          promise.promiseKey,
          promise.statementText,
          input.sourceDocumentId ?? null,
          promise.extractionConfidence,
          promise.extractionModelVersion
        ]
      );
      saved.push({
        promiseId,
        officialId: input.officialId,
        sourceDocumentId: input.sourceDocumentId,
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
