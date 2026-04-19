import { NextResponse } from "next/server";
import { resolveReviewTask } from "@/lib/ingestion/review-store";
import { createEventEnvelope } from "@/lib/ingestion/events/envelope";
import { publishTopicEnvelope } from "@/lib/ingestion/events/publisher";
import { INGESTION_TOPICS } from "@/lib/ingestion/events/topics";

type DecisionRequestBody = {
  readonly notes?: string;
};

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as DecisionRequestBody;

  const updated = await resolveReviewTask(taskId, body.notes);
  if (!updated) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  await publishTopicEnvelope(
    INGESTION_TOPICS.reviewDecision,
    createEventEnvelope({
      traceId: crypto.randomUUID(),
      payload: {
        entity_type: updated.entityType,
        entity_id: updated.entityId,
        decision: "approve",
        reviewer_id: "reviewer:api",
        notes: body.notes ?? "Resolved via review API"
      }
    })
  );

  return NextResponse.json({ task: updated });
}
