import type { EventEnvelope } from "./envelope";
import { validateTopicPayload } from "./contract-validator";
import type { IngestionTopic } from "./topics";
import { getPublisherStore } from "./publisher-store";
import { recordPublishResult } from "../monitoring/metrics";

export type PublishedTopicEvent = {
  readonly topic: IngestionTopic;
  readonly envelope: EventEnvelope<Record<string, unknown>>;
  readonly publishedAt: string;
};

export type DeadLetterEvent = {
  readonly topic: IngestionTopic;
  readonly envelope: EventEnvelope<Record<string, unknown>>;
  readonly missingKeys: readonly string[];
  readonly reason: string;
  readonly failedAt: string;
};

export type PublishResult =
  | { readonly status: "published"; readonly event: PublishedTopicEvent }
  | { readonly status: "dead_letter"; readonly event: DeadLetterEvent };

export async function publishTopicEnvelope(
  topic: IngestionTopic,
  envelope: EventEnvelope<Record<string, unknown>>
): Promise<PublishResult> {
  const store = getPublisherStore();
  const validation = validateTopicPayload(topic, envelope.payload);
  if (!validation.valid) {
    const deadLetter: DeadLetterEvent = {
      topic,
      envelope,
      missingKeys: validation.missingKeys,
      reason: "schema_contract_validation_failed",
      failedAt: new Date().toISOString()
    };
    await store.appendDeadLetter(deadLetter);
    const result: PublishResult = { status: "dead_letter", event: deadLetter };
    recordPublishResult(result);
    return result;
  }

  const published: PublishedTopicEvent = {
    topic,
    envelope,
    publishedAt: new Date().toISOString()
  };
  await store.appendPublished(published);
  const result: PublishResult = { status: "published", event: published };
  recordPublishResult(result);
  return result;
}

export async function listPublishedEvents(): Promise<readonly PublishedTopicEvent[]> {
  return getPublisherStore().listPublished();
}

export async function listDeadLetterEvents(): Promise<readonly DeadLetterEvent[]> {
  return getPublisherStore().listDeadLetters();
}

export async function clearEventBuffers(): Promise<void> {
  await getPublisherStore().clear();
}
