import { describe, expect, test } from "vitest";
import { POST as classifyPost } from "@/app/api/ingestion/status-classify/route";
import { POST as publishRefreshPost } from "@/app/api/ingestion/publish-refresh/route";
import { GET as readModelsGet } from "@/app/api/ingestion/read-models/route";
import { DELETE as resetMetrics, GET as metricsGet } from "@/app/api/ingestion/metrics/route";
import { clearEventBuffers } from "@/lib/ingestion/events/publisher";
import { resetReadModelPublisherProgress } from "./read-model-publisher-service";

describe("phase2 e2e rehearsal", () => {
  test("runs classify -> refresh publish -> read-model + metrics verification", async () => {
    await clearEventBuffers();
    await resetMetrics();
    resetReadModelPublisherProgress();

    const classifyResponse = await classifyPost(
      new Request("http://localhost/api/ingestion/status-classify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          officialId: "zohran-mamdani",
          sourceDocumentId: "doc-phase2",
          sourceText:
            "Council approved the housing budget. We will build 1000 homes by 2027."
        })
      })
    );
    expect(classifyResponse.status).toBe(200);

    const refreshResponse = await publishRefreshPost(
      new Request("http://localhost/api/ingestion/publish-refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ officialId: "zohran-mamdani" })
      })
    );
    expect(refreshResponse.status).toBe(200);

    const readModelsResponse = await readModelsGet();
    expect(readModelsResponse.status).toBe(200);
    const readModelsPayload = await readModelsResponse.json() as {
      homeTrending: unknown[];
      homeUpdates: unknown[];
      officialProfiles: unknown[];
    };
    expect(readModelsPayload.homeTrending.length).toBeGreaterThan(0);
    expect(readModelsPayload.officialProfiles.length).toBeGreaterThan(0);

    const metricsResponse = await metricsGet();
    expect(metricsResponse.status).toBe(200);
    const metricsPayload = await metricsResponse.json() as {
      publish: { total: number; deadLetterRate: number };
      classifier: { total: number };
    };
    expect(metricsPayload.publish.total).toBeGreaterThan(0);
    expect(metricsPayload.publish.deadLetterRate).toBeGreaterThanOrEqual(0);
    expect(metricsPayload.classifier.total).toBeGreaterThan(0);
  });
});
