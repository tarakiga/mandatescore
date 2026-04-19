import { describe, expect, test } from "vitest";
import { ReadModelPublisherService, resetReadModelPublisherProgress } from "./read-model-publisher-service";
import { createEventEnvelope } from "../events/envelope";
import { publishTopicEnvelope } from "../events/publisher";
import { INGESTION_TOPICS } from "../events/topics";
import { getReadModelStore } from "../stores/read-model-store";

describe("ReadModelPublisherService", () => {
  test("processes refresh event and materializes read models", async () => {
    resetReadModelPublisherProgress();
    await publishTopicEnvelope(
      INGESTION_TOPICS.publishRefreshRequested,
      createEventEnvelope({
        traceId: "trace-refresh-1",
        payload: {
          official_id: "zohran-mamdani",
          reason: "test_refresh"
        }
      })
    );

    const service = new ReadModelPublisherService();
    const result = await service.runPendingRefreshes();

    expect(result.processedEvents).toBeGreaterThan(0);
    const store = getReadModelStore();
    expect((await store.listHomeTrending()).length).toBeGreaterThan(0);
    expect((await store.listOfficialProfiles()).length).toBeGreaterThan(0);
  });
});
