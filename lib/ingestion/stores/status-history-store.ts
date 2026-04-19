import { Pool } from "pg";
import type { PromiseStatusDecision } from "../types";

export interface StatusHistoryStore {
  saveMany(input: {
    readonly statusDecisions: readonly PromiseStatusDecision[];
    readonly decidedBy: string;
  }): Promise<void>;
}

class InMemoryStatusHistoryStore implements StatusHistoryStore {
  public async saveMany(): Promise<void> {
    // No-op for local in-memory mode.
  }
}

class PostgresStatusHistoryStore implements StatusHistoryStore {
  private readonly pool: Pool;

  public constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async saveMany(input: {
    readonly statusDecisions: readonly PromiseStatusDecision[];
    readonly decidedBy: string;
  }): Promise<void> {
    for (const decision of input.statusDecisions) {
      await this.pool.query(
        `
        INSERT INTO promise_status_history
          (id, promise_id, status, confidence, explanation, classifier_model_version, effective_at, decided_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          crypto.randomUUID(),
          decision.promiseId,
          decision.status,
          decision.confidence,
          decision.explanation,
          decision.classifierModelVersion,
          new Date().toISOString(),
          input.decidedBy
        ]
      );
    }
  }
}

let singleton: StatusHistoryStore | null = null;

export function getStatusHistoryStore(): StatusHistoryStore {
  if (singleton) return singleton;
  const mode = process.env.INGESTION_DATA_STORE?.toLowerCase();
  const connectionString = process.env.DATABASE_URL;
  singleton =
    mode === "postgres" && connectionString
      ? new PostgresStatusHistoryStore(connectionString)
      : new InMemoryStatusHistoryStore();
  return singleton;
}
