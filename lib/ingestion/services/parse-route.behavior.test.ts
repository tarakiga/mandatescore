import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/ingestion/parse/route";
import { clearEventBuffers } from "@/lib/ingestion/events/publisher";

describe("ingestion parse route behavior", () => {
  test("returns 400 when required fields are missing", async () => {
    const request = new Request("http://localhost/api/ingestion/parse", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({})
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test("returns 202 when publish succeeds", async () => {
    await clearEventBuffers();
    const request = new Request("http://localhost/api/ingestion/parse", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sourceDocumentId: "doc-100",
        sourceUrl: "https://example.com/manifesto"
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(202);
  });
});
