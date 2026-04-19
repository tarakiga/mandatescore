import { describe, expect, test } from "vitest";
import { validateTopicPayload, assertValidTopicEnvelope } from "./contract-validator";
import { createEventEnvelope } from "./envelope";
import { INGESTION_TOPICS } from "./topics";

describe("contract validator", () => {
  test("accepts valid document fetched payload", () => {
    const validation = validateTopicPayload(INGESTION_TOPICS.documentFetched, {
      source_document_id: "doc-1",
      content_hash: "abc",
      blob_path: "memory://doc-1",
      mime_type: "text/html",
      language_code: "en"
    });

    expect(validation.valid).toBe(true);
    expect(validation.missingKeys).toHaveLength(0);
  });

  test("reports missing keys", () => {
    const validation = validateTopicPayload(INGESTION_TOPICS.documentParsed, {
      source_document_id: "doc-1"
    });
    expect(validation.valid).toBe(false);
    expect(validation.missingKeys).toContain("block_count");
    expect(validation.missingKeys).toContain("parse_quality_score");
  });

  test("throws for invalid envelope", () => {
    const envelope = createEventEnvelope({
      traceId: "trace-1",
      payload: {
        source_document_id: "doc-1"
      }
    });

    expect(() =>
      assertValidTopicEnvelope(INGESTION_TOPICS.documentParsed, envelope as never)
    ).toThrow(/Invalid payload/);
  });
});
