import { describe, expect, test } from "vitest";
import { StatusClassifierService } from "./status-classifier-service";

describe("StatusClassifierService", () => {
  test("classifies promise statuses with confidence and citations", async () => {
    const service = new StatusClassifierService();
    const decisions = await service.classify({
      promises: [
        {
          promiseId: "p-id-1",
          officialId: "official-1",
          promiseKey: "p1",
          statementText: "We will approve a housing budget and deliver units.",
          extractionConfidence: 0.91,
          extractionModelVersion: "extract-v1",
          rationale: "Commitment detected"
        }
      ],
      evidenceItems: [
        {
          evidenceId: "e1",
          sourceDocumentId: "doc-1",
          evidenceType: "budget",
          summary: "The housing budget was approved by council.",
          confidence: 0.82,
          credibilityTier: 4
        }
      ]
    });

    expect(decisions).toHaveLength(1);
    expect(decisions[0]?.status).toBe("kept");
    expect(decisions[0]?.promiseId).toBe("p-id-1");
    expect(decisions[0]?.citations).toContain("e1");
  });

  test("downgrades kept candidate when guardrail is not satisfied", async () => {
    const service = new StatusClassifierService();
    const decisions = await service.classify({
      promises: [
        {
          promiseId: "p-id-2",
          officialId: "official-1",
          promiseKey: "p2",
          statementText: "We will pass a transit law this year.",
          extractionConfidence: 0.91,
          extractionModelVersion: "extract-v1",
          rationale: "Commitment detected"
        }
      ],
      evidenceItems: [
        {
          evidenceId: "e2",
          sourceDocumentId: "doc-2",
          evidenceType: "law",
          summary: "A transit law was discussed.",
          confidence: 0.6,
          credibilityTier: 2
        }
      ]
    });

    expect(decisions[0]?.status).toBe("in_progress");
    expect(decisions[0]?.guardrail.passed).toBe(false);
    expect(decisions[0]?.requiresReview).toBe(true);
  });
});
