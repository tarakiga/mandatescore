import { describe, expect, test } from "vitest";
import { PromiseExtractionService } from "./promise-extraction-service";

describe("PromiseExtractionService", () => {
  test("extracts candidates with model metadata", async () => {
    const service = new PromiseExtractionService();
    const candidates = await service.extractFromText(
      "We will build 10,000 housing units by 2027. We commit to reduce transport delays."
    );

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]?.extractionModelVersion).toBe("extract-v1");
    expect(candidates[0]?.promiseKey).toContain("promise-");
  });
});
