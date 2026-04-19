import { NextResponse } from "next/server";
import { createEventEnvelope } from "@/lib/ingestion/events/envelope";
import { publishTopicEnvelope } from "@/lib/ingestion/events/publisher";
import { INGESTION_TOPICS } from "@/lib/ingestion/events/topics";
import { ReadModelPublisherService } from "@/lib/ingestion/services/read-model-publisher-service";

type PublishRefreshBody = {
  readonly officialId?: string;
};

const service = new ReadModelPublisherService();

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PublishRefreshBody;
  const officialId = body.officialId?.trim();

  if (officialId) {
    await publishTopicEnvelope(
      INGESTION_TOPICS.publishRefreshRequested,
      createEventEnvelope({
        traceId: crypto.randomUUID(),
        payload: {
          official_id: officialId,
          reason: "manual_refresh_trigger"
        }
      })
    );
  }

  const result = await service.runPendingRefreshes();
  return NextResponse.json(result);
}
