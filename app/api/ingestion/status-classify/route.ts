import { NextResponse } from "next/server";
import { createEventEnvelope } from "@/lib/ingestion/events/envelope";
import { publishTopicEnvelope } from "@/lib/ingestion/events/publisher";
import { INGESTION_TOPICS } from "@/lib/ingestion/events/topics";
import { PromiseExtractionService } from "@/lib/ingestion/services/promise-extraction-service";
import { EvidenceLinkerService } from "@/lib/ingestion/services/evidence-linker-service";
import { StatusClassifierService } from "@/lib/ingestion/services/status-classifier-service";
import { ScoreTrendService } from "@/lib/ingestion/services/score-trend-service";
import { getStatusHistoryStore } from "@/lib/ingestion/stores/status-history-store";
import { getPromiseStore } from "@/lib/ingestion/stores/promise-store";
import { enqueueReviewTask } from "@/lib/ingestion/review-store";
import { recordClassifierDecisions } from "@/lib/ingestion/monitoring/metrics";

type StatusClassifyRequestBody = {
  readonly officialId?: string;
  readonly sourceDocumentId?: string;
  readonly sourceText?: string;
};

const extractionService = new PromiseExtractionService();
const evidenceLinkerService = new EvidenceLinkerService();
const statusClassifierService = new StatusClassifierService();
const scoreTrendService = new ScoreTrendService();

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as StatusClassifyRequestBody;
  const officialId = body.officialId?.trim();
  const sourceDocumentId = body.sourceDocumentId?.trim();
  const sourceText = body.sourceText?.trim();

  if (!officialId || !sourceDocumentId || !sourceText) {
    return NextResponse.json(
      { error: "officialId, sourceDocumentId and sourceText are required." },
      { status: 400 }
    );
  }

  const extractedPromises = await extractionService.extractFromText(sourceText);
  const savedPromises = await getPromiseStore().saveMany({
    officialId,
    sourceDocumentId,
    promises: extractedPromises
  });
  const evidence = await evidenceLinkerService.createEvidenceAndLinkCandidates({
    sourceDocumentId,
    sourceText,
    promises: savedPromises
  });
  const statusDecisions = await statusClassifierService.classify({
    promises: savedPromises,
    evidenceItems: evidence.evidenceItems
  });
  recordClassifierDecisions(statusDecisions);

  await getStatusHistoryStore().saveMany({
    statusDecisions,
    decidedBy: "system"
  });

  const reviewTasks = await Promise.all(
    statusDecisions
      .filter((decision) => decision.requiresReview)
      .map((decision) =>
        enqueueReviewTask({
          entityType: "status",
          entityId: decision.promiseId,
          reason: decision.guardrail.passed ? "low_confidence" : "policy_guardrail",
          priority: "high"
        })
      )
  );

  const traceId = crypto.randomUUID();
  const publishResults = [];

  for (const decision of statusDecisions) {
    publishResults.push(
      await publishTopicEnvelope(
        INGESTION_TOPICS.promiseStatusComputed,
        createEventEnvelope({
          traceId,
          payload: {
            promise_id: decision.promiseId,
            status: decision.status,
            confidence: decision.confidence,
            explanation: decision.explanation,
            requires_review: decision.requiresReview
          }
        })
      )
    );
  }

  const score = scoreTrendService.recomputeScore(statusDecisions);
  publishResults.push(
    await publishTopicEnvelope(
      INGESTION_TOPICS.scoreRecomputed,
      createEventEnvelope({
        traceId,
        payload: {
          official_id: officialId,
          mandate_score: score.mandateScore,
          kept_count: score.keptCount,
          in_progress_count: score.inProgressCount,
          broken_count: score.brokenCount
        }
      })
    )
  );

  const trend = scoreTrendService.recomputeTrend(score);
  publishResults.push(
    await publishTopicEnvelope(
      INGESTION_TOPICS.trendRecomputed,
      createEventEnvelope({
        traceId,
        payload: {
          official_id: officialId,
          trend_score: trend.trendScore,
          formula_version: trend.formulaVersion,
          signals: trend.signals
        }
      })
    )
  );

  publishResults.push(
    await publishTopicEnvelope(
      INGESTION_TOPICS.publishRefreshRequested,
      createEventEnvelope({
        traceId,
        payload: {
          official_id: officialId,
          reason: "status_and_score_recomputed"
        }
      })
    )
  );

  return NextResponse.json({
    savedPromises,
    statusDecisions,
    reviewTasks,
    score,
    trend,
    publishResults
  });
}
