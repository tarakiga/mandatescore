import { describe, expect, test } from "vitest";
import { createEventEnvelope } from "../events/envelope";
import { getMonitoringSnapshot, recordClassifierDecisions, recordPublishResult, resetMonitoringMetrics } from "./metrics";
import type { PublishResult } from "../events/publisher";
import type { PromiseStatusDecision } from "../types";

describe("ingestion monitoring metrics", () => {
  test("tracks dlq rate, publish latency p95 and classifier confidence buckets", () => {
    resetMonitoringMetrics();

    const publishedResult: PublishResult = {
      status: "published",
      event: {
        topic: "document.fetched.v1",
        envelope: createEventEnvelope({
          traceId: "t1",
          occurredAt: "2026-01-01T00:00:00.000Z",
          payload: {
            source_document_id: "doc",
            content_hash: "h",
            blob_path: "memory://doc",
            mime_type: "text/html",
            language_code: "en"
          }
        }),
        publishedAt: "2026-01-01T00:00:01.000Z"
      }
    };

    const deadLetterResult: PublishResult = {
      status: "dead_letter",
      event: {
        topic: "document.parsed.v1",
        envelope: createEventEnvelope({
          traceId: "t2",
          payload: { source_document_id: "doc" }
        }),
        missingKeys: ["block_count", "parse_quality_score"],
        reason: "schema_contract_validation_failed",
        failedAt: "2026-01-01T00:00:02.000Z"
      }
    };

    recordPublishResult(publishedResult);
    recordPublishResult(deadLetterResult);

    const decisions: PromiseStatusDecision[] = [
      {
        promiseId: "p1",
        promiseKey: "k1",
        status: "kept",
        confidence: 0.92,
        explanation: "ok",
        citations: [],
        requiresReview: false,
        classifierModelVersion: "status-v1",
        guardrail: { passed: true }
      },
      {
        promiseId: "p2",
        promiseKey: "k2",
        status: "in_progress",
        confidence: 0.68,
        explanation: "ok",
        citations: [],
        requiresReview: true,
        classifierModelVersion: "status-v1",
        guardrail: { passed: false, reason: "x" }
      }
    ];
    recordClassifierDecisions(decisions);

    const snapshot = getMonitoringSnapshot();
    expect(snapshot.publish.total).toBe(2);
    expect(snapshot.publish.deadLetterTotal).toBe(1);
    expect(snapshot.publish.deadLetterRate).toBe(0.5);
    expect(snapshot.publish.latencyP95Ms).toBeGreaterThanOrEqual(0);
    expect(snapshot.classifier.confidenceBuckets.gte_0_90).toBe(1);
    expect(snapshot.classifier.confidenceBuckets["0_60_to_0_74"]).toBe(1);
  });
});
