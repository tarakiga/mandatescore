import { NextResponse } from "next/server";
import { enqueueReviewTask } from "@/lib/ingestion/review-store";
import { runPromiseExtraction } from "@/lib/ingestion/pipeline";
import { getPromiseStore } from "@/lib/ingestion/stores/promise-store";

type ExtractRequestBody = {
  readonly sourceText?: string;
  readonly officialId?: string;
  readonly sourceDocumentId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ExtractRequestBody;
  const sourceText = body.sourceText?.trim();
  const officialId = body.officialId?.trim();
  const sourceDocumentId = body.sourceDocumentId?.trim();

  if (!sourceText) {
    return NextResponse.json({ error: "sourceText is required." }, { status: 400 });
  }
  if (!officialId) {
    return NextResponse.json({ error: "officialId is required." }, { status: 400 });
  }

  const candidates = await runPromiseExtraction(sourceText);
  const savedPromises = await getPromiseStore().saveMany({
    officialId,
    sourceDocumentId,
    promises: candidates
  });

  const reviewTasks = await Promise.all(
    candidates
      .filter((candidate) => candidate.extractionConfidence < 0.75)
      .map((candidate) =>
        enqueueReviewTask({
        entityType: "promise",
        entityId: candidate.promiseKey,
        reason: "low_confidence",
        priority: "high"
      })
      )
  );

  return NextResponse.json({
    candidates,
    savedPromises,
    reviewTasks
  });
}
