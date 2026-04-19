import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/ingestion/extract-promises/route";

describe("extract-promises route behavior", () => {
  test("returns 400 when officialId is missing", async () => {
    const request = new Request("http://localhost/api/ingestion/extract-promises", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sourceText: "We will build 1000 homes by 2027."
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test("returns candidates and saved promises when input is valid", async () => {
    const request = new Request("http://localhost/api/ingestion/extract-promises", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        officialId: "official-1",
        sourceDocumentId: "doc-1",
        sourceText: "We will build 1000 homes by 2027."
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json() as {
      candidates: unknown[];
      savedPromises: unknown[];
    };
    expect(payload.candidates.length).toBeGreaterThan(0);
    expect(payload.savedPromises.length).toBeGreaterThan(0);
  });
});
