import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/ingestion/status-classify/route";

describe("status-classify route behavior", () => {
  test("returns 400 when required fields are missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/ingestion/status-classify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({})
      })
    );
    expect(response.status).toBe(400);
  });

  test("returns status decisions, score, and trend", async () => {
    const response = await POST(
      new Request("http://localhost/api/ingestion/status-classify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          officialId: "official-2",
          sourceDocumentId: "doc-2",
          sourceText: "Council approved the housing budget. We will build 1000 homes."
        })
      })
    );

    expect(response.status).toBe(200);
    const payload = await response.json() as {
      statusDecisions: unknown[];
      score: { mandateScore: number };
      trend: { trendScore: number };
      publishResults: unknown[];
    };
    expect(payload.statusDecisions.length).toBeGreaterThan(0);
    expect(payload.score.mandateScore).toBeGreaterThanOrEqual(0);
    expect(payload.trend.trendScore).toBeGreaterThanOrEqual(0);
    expect(payload.publishResults.length).toBeGreaterThan(0);
  });
});
