import { describe, expect, test } from "vitest";
import { runParsePipeline } from "./pipeline";
import { clearEventBuffers } from "./events/publisher";

describe("ingestion pipeline", () => {
  test("emits contract-compliant fetched and parsed events", async () => {
    await clearEventBuffers();
    const result = await runParsePipeline({
      traceId: "trace-xyz",
      sourceDocumentId: "doc-123",
      sourceUrl: "https://example.com/promise"
    });

    expect(result.fetchedEvent.payload.topic).toBe("document.fetched.v1");
    expect(result.fetchedEvent.payload.source_document_id).toBe("doc-123");
    expect(result.parsedEvent.payload.topic).toBe("document.parsed.v1");
    expect(result.parsedEvent.payload.block_count).toBeGreaterThan(0);
    expect(result.publishResults.every((entry) => entry.status === "published")).toBe(true);
  });
});
