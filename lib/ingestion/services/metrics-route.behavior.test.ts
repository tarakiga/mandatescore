import { describe, expect, test } from "vitest";
import { DELETE, GET } from "@/app/api/ingestion/metrics/route";
import { publishTopicEnvelope } from "@/lib/ingestion/events/publisher";
import { createEventEnvelope } from "@/lib/ingestion/events/envelope";
import { INGESTION_TOPICS } from "@/lib/ingestion/events/topics";

describe("metrics route behavior", () => {
  test("returns ingestion metrics snapshot", async () => {
    await DELETE();
    await publishTopicEnvelope(
      INGESTION_TOPICS.documentFetched,
      createEventEnvelope({
        traceId: "metrics-t",
        payload: {
          source_document_id: "doc-m",
          content_hash: "abc",
          blob_path: "memory://doc-m",
          mime_type: "text/html",
          language_code: "en"
        }
      })
    );

    const response = await GET();
    expect(response.status).toBe(200);
    const payload = await response.json() as {
      publish: { total: number };
    };
    expect(payload.publish.total).toBeGreaterThanOrEqual(1);
  });
});
