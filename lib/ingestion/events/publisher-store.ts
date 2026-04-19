import { Pool } from "pg";
import type { EventEnvelope } from "./envelope";
import type { IngestionTopic } from "./topics";
import type { DeadLetterEvent, PublishedTopicEvent } from "./publisher";

export interface PublisherStore {
  appendPublished(event: PublishedTopicEvent): Promise<void>;
  appendDeadLetter(event: DeadLetterEvent): Promise<void>;
  listPublished(): Promise<readonly PublishedTopicEvent[]>;
  listDeadLetters(): Promise<readonly DeadLetterEvent[]>;
  clear(): Promise<void>;
}

class InMemoryPublisherStore implements PublisherStore {
  private readonly publishedEvents: PublishedTopicEvent[] = [];
  private readonly deadLetterEvents: DeadLetterEvent[] = [];

  public async appendPublished(event: PublishedTopicEvent): Promise<void> {
    this.publishedEvents.push(event);
  }

  public async appendDeadLetter(event: DeadLetterEvent): Promise<void> {
    this.deadLetterEvents.push(event);
  }

  public async listPublished(): Promise<readonly PublishedTopicEvent[]> {
    return this.publishedEvents;
  }

  public async listDeadLetters(): Promise<readonly DeadLetterEvent[]> {
    return this.deadLetterEvents;
  }

  public async clear(): Promise<void> {
    this.publishedEvents.length = 0;
    this.deadLetterEvents.length = 0;
  }
}

class PostgresPublisherStore implements PublisherStore {
  private readonly pool: Pool;

  public constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async appendPublished(event: PublishedTopicEvent): Promise<void> {
    await this.pool.query(
      `
      INSERT INTO event_outbox (event_id, topic, payload_json, trace_id, schema_version, published_at)
      VALUES ($1, $2, $3::jsonb, $4, $5, $6)
      ON CONFLICT (event_id) DO NOTHING
      `,
      [
        event.envelope.event_id,
        event.topic,
        JSON.stringify(event.envelope.payload),
        event.envelope.trace_id,
        event.envelope.schema_version,
        event.publishedAt
      ]
    );
  }

  public async appendDeadLetter(event: DeadLetterEvent): Promise<void> {
    await this.pool.query(
      `
      INSERT INTO event_outbox (event_id, topic, payload_json, trace_id, schema_version, published_at)
      VALUES ($1, $2, $3::jsonb, $4, $5, $6)
      ON CONFLICT (event_id) DO NOTHING
      `,
      [
        event.envelope.event_id,
        `dead_letter.${event.topic}`,
        JSON.stringify({
          payload: event.envelope.payload,
          missingKeys: event.missingKeys,
          reason: event.reason,
          failedAt: event.failedAt
        }),
        event.envelope.trace_id,
        event.envelope.schema_version,
        event.failedAt
      ]
    );
  }

  public async listPublished(): Promise<readonly PublishedTopicEvent[]> {
    const { rows } = await this.pool.query<{
      topic: string;
      payload_json: Record<string, unknown>;
      trace_id: string;
      schema_version: "v1";
      published_at: string;
      event_id: string;
    }>(
      `
      SELECT event_id, topic, payload_json, trace_id, schema_version, published_at
      FROM event_outbox
      WHERE topic NOT LIKE 'dead_letter.%'
      ORDER BY published_at DESC NULLS LAST
      LIMIT 200
      `
    );

    return rows.map((row) => ({
      topic: row.topic as IngestionTopic,
      envelope: buildEnvelope(row),
      publishedAt: row.published_at ?? new Date().toISOString()
    }));
  }

  public async listDeadLetters(): Promise<readonly DeadLetterEvent[]> {
    const { rows } = await this.pool.query<{
      topic: string;
      payload_json: {
        payload?: Record<string, unknown>;
        missingKeys?: string[];
        reason?: string;
        failedAt?: string;
      };
      trace_id: string;
      schema_version: "v1";
      published_at: string;
      event_id: string;
    }>(
      `
      SELECT event_id, topic, payload_json, trace_id, schema_version, published_at
      FROM event_outbox
      WHERE topic LIKE 'dead_letter.%'
      ORDER BY published_at DESC NULLS LAST
      LIMIT 200
      `
    );

    return rows.map((row) => {
      const nestedTopic = row.topic.replace(/^dead_letter\./, "") as IngestionTopic;
      return {
        topic: nestedTopic,
        envelope: buildEnvelope({
          ...row,
          payload_json: row.payload_json.payload ?? {}
        }),
        missingKeys: row.payload_json.missingKeys ?? [],
        reason: row.payload_json.reason ?? "schema_contract_validation_failed",
        failedAt: row.payload_json.failedAt ?? row.published_at ?? new Date().toISOString()
      };
    });
  }

  public async clear(): Promise<void> {
    if (process.env.NODE_ENV !== "test") return;
    await this.pool.query("DELETE FROM event_outbox");
  }
}

let singletonStore: PublisherStore | null = null;

export function getPublisherStore(): PublisherStore {
  if (singletonStore) return singletonStore;

  const mode = process.env.INGESTION_EVENT_STORE?.toLowerCase();
  const connectionString = process.env.DATABASE_URL;

  if (mode === "postgres" && connectionString) {
    singletonStore = new PostgresPublisherStore(connectionString);
    return singletonStore;
  }

  singletonStore = new InMemoryPublisherStore();
  return singletonStore;
}

function buildEnvelope(input: {
  event_id: string;
  trace_id: string;
  schema_version: "v1";
  payload_json: Record<string, unknown>;
}): EventEnvelope<Record<string, unknown>> {
  return {
    event_id: input.event_id,
    trace_id: input.trace_id,
    occurred_at: new Date().toISOString(),
    schema_version: input.schema_version,
    payload: input.payload_json
  };
}
