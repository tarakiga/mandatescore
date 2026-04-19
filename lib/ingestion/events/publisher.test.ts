import { beforeEach, describe, expect, test } from "vitest";
import { createEventEnvelope } from "./envelope";
import { clearEventBuffers, listDeadLetterEvents, listPublishedEvents, publishTopicEnvelope } from "./publisher";
import { INGESTION_TOPICS } from "./topics";

describe("publisher", () => {
  beforeEach(async () => {
    await clearEventBuffers();
  });

  test("publishes valid envelope", async () => {
    const envelope = createEventEnvelope({
      traceId: "trace-ok",
      payload: {
        source_document_id: "doc-1",
        content_hash: "abc123",
        blob_path: "memory://doc-1",
        mime_type: "text/html",
        language_code: "en"
      }
    });

    const result = await publishTopicEnvelope(INGESTION_TOPICS.documentFetched, envelope as never);
    expect(result.status).toBe("published");
    expect(await listPublishedEvents()).toHaveLength(1);
    expect(await listDeadLetterEvents()).toHaveLength(0);
  });

  test("routes invalid envelope to dead-letter", async () => {
    const envelope = createEventEnvelope({
      traceId: "trace-bad",
      payload: {
        source_document_id: "doc-2"
      }
    });

    const result = await publishTopicEnvelope(INGESTION_TOPICS.documentParsed, envelope as never);
    expect(result.status).toBe("dead_letter");
    expect(await listPublishedEvents()).toHaveLength(0);
    expect(await listDeadLetterEvents()).toHaveLength(1);
    expect((await listDeadLetterEvents())[0]?.reason).toBe("schema_contract_validation_failed");
  });
});
