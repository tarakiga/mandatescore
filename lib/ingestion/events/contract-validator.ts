import type { EventEnvelope } from "./envelope";
import type { IngestionTopic } from "./topics";

const requiredPayloadKeysByTopic: Readonly<Record<IngestionTopic, readonly string[]>> = {
  "source.discovered.v1": ["source_registry_id", "source_url", "source_published_at"],
  "document.fetched.v1": ["source_document_id", "content_hash", "blob_path", "mime_type", "language_code"],
  "document.parsed.v1": ["source_document_id", "block_count", "parse_quality_score"],
  "promise.extracted.v1": ["promise_id", "official_id", "promise_key", "confidence"],
  "evidence.created.v1": ["evidence_item_id", "source_document_id", "evidence_type"],
  "promise.evidence_linked.v1": ["promise_id", "evidence_item_id", "confidence", "requires_review"],
  "promise.status_computed.v1": ["promise_id", "status", "confidence", "explanation", "requires_review"],
  "review.decision.v1": ["entity_type", "entity_id", "decision", "reviewer_id", "notes"],
  "score.recomputed.v1": ["official_id", "mandate_score", "kept_count", "in_progress_count", "broken_count"],
  "trend.recomputed.v1": ["official_id", "trend_score", "formula_version", "signals"],
  "publish.refresh_requested.v1": ["official_id", "reason"],
  "publish.completed.v1": ["official_id", "published_at", "read_model_version"]
};

export function validateTopicPayload(topic: IngestionTopic, payload: unknown): {
  readonly valid: boolean;
  readonly missingKeys: readonly string[];
} {
  if (!payload || typeof payload !== "object") {
    return { valid: false, missingKeys: [...requiredPayloadKeysByTopic[topic]] };
  }

  const record = payload as Record<string, unknown>;
  const missingKeys = requiredPayloadKeysByTopic[topic].filter((key) => !(key in record));
  return { valid: missingKeys.length === 0, missingKeys };
}

export function assertValidTopicEnvelope(
  topic: IngestionTopic,
  envelope: EventEnvelope<Record<string, unknown>>
): void {
  const validation = validateTopicPayload(topic, envelope.payload);
  if (!validation.valid) {
    throw new Error(
      `Invalid payload for topic "${topic}". Missing keys: ${validation.missingKeys.join(", ")}`
    );
  }
}
