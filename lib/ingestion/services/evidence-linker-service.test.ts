import { describe, expect, test } from "vitest";
import { EvidenceLinkerService } from "./evidence-linker-service";

describe("EvidenceLinkerService", () => {
  test("creates evidence and provisional promise links", async () => {
    const service = new EvidenceLinkerService();
    const result = await service.createEvidenceAndLinkCandidates({
      sourceDocumentId: "doc-201",
      sourceText:
        "City council approved the housing budget. Oversight hearing announced this week.",
      promises: [
        {
          promiseId: "promise-id-1",
          officialId: "official-1",
          promiseKey: "promise-1",
          statementText: "We will approve a housing budget for affordable units.",
          extractionConfidence: 0.9,
          extractionModelVersion: "extract-v1",
          rationale: "Contains explicit commitment."
        }
      ]
    });

    expect(result.evidenceItems.length).toBeGreaterThan(0);
    expect(result.links.length).toBeGreaterThan(0);
    expect(result.links[0]?.promiseId).toBe("promise-id-1");
  });
});
