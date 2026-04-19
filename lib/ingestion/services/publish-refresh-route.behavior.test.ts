import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/ingestion/publish-refresh/route";

describe("publish-refresh route behavior", () => {
  test("triggers refresh for provided official and returns processing result", async () => {
    const response = await POST(
      new Request("http://localhost/api/ingestion/publish-refresh", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ officialId: "zohran-mamdani" })
      })
    );

    expect(response.status).toBe(200);
    const payload = await response.json() as {
      processedEvents: number;
      refreshedOfficialIds: string[];
    };
    expect(payload.processedEvents).toBeGreaterThanOrEqual(1);
    expect(payload.refreshedOfficialIds).toContain("zohran-mamdani");
  });
});
