export const INGESTION_TOPICS = {
  sourceDiscovered: "source.discovered.v1",
  documentFetched: "document.fetched.v1",
  documentParsed: "document.parsed.v1",
  promiseExtracted: "promise.extracted.v1",
  evidenceCreated: "evidence.created.v1",
  promiseEvidenceLinked: "promise.evidence_linked.v1",
  promiseStatusComputed: "promise.status_computed.v1",
  reviewDecision: "review.decision.v1",
  scoreRecomputed: "score.recomputed.v1",
  trendRecomputed: "trend.recomputed.v1",
  publishRefreshRequested: "publish.refresh_requested.v1",
  publishCompleted: "publish.completed.v1"
} as const;

export type IngestionTopic = (typeof INGESTION_TOPICS)[keyof typeof INGESTION_TOPICS];

export function isIngestionTopic(value: string): value is IngestionTopic {
  return Object.values(INGESTION_TOPICS).includes(value as IngestionTopic);
}
