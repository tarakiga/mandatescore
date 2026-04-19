import { NextResponse } from "next/server";
import { createEventEnvelope } from "@/lib/ingestion/events/envelope";
import { publishTopicEnvelope } from "@/lib/ingestion/events/publisher";
import { INGESTION_TOPICS } from "@/lib/ingestion/events/topics";
import { PromiseExtractionService } from "@/lib/ingestion/services/promise-extraction-service";
import { EvidenceLinkerService } from "@/lib/ingestion/services/evidence-linker-service";
import { getPromiseStore } from "@/lib/ingestion/stores/promise-store";

type EvidenceLinkRequestBody = {
  readonly officialId?: string;
  readonly sourceDocumentId?: string;
  readonly sourceText?: string;
};

const extractionService = new PromiseExtractionService();
const evidenceLinkerService = new EvidenceLinkerService();

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as EvidenceLinkRequestBody;
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
  const result = await evidenceLinkerService.createEvidenceAndLinkCandidates({
    sourceDocumentId,
    sourceText,
    promises: savedPromises
  });

  const traceId = crypto.randomUUID();
  const publishResults = [];
  for (const evidence of result.evidenceItems) {
    publishResults.push(
      await publishTopicEnvelope(
        INGESTION_TOPICS.evidenceCreated,
        createEventEnvelope({
          traceId,
          payload: {
            evidence_item_id: evidence.evidenceId,
            source_document_id: evidence.sourceDocumentId,
            evidence_type: evidence.evidenceType
          }
        })
      )
    );
  }

  for (const link of result.links) {
    publishResults.push(
      await publishTopicEnvelope(
        INGESTION_TOPICS.promiseEvidenceLinked,
        createEventEnvelope({
          traceId,
          payload: {
            promise_id: link.promiseId,
            evidence_item_id: link.evidenceId,
            confidence: link.confidence,
            requires_review: link.requiresReview
          }
        })
      )
    );
  }

  return NextResponse.json({
    savedPromises,
    ...result,
    publishResults
  });
}
