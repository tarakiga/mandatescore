import { NextResponse } from "next/server";
import { runParsePipeline } from "@/lib/ingestion/pipeline";

type ParseRequestBody = {
  readonly sourceDocumentId?: string;
  readonly sourceUrl?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ParseRequestBody;
  const sourceDocumentId = body.sourceDocumentId?.trim();
  const sourceUrl = body.sourceUrl?.trim();

  if (!sourceDocumentId || !sourceUrl) {
    return NextResponse.json(
      { error: "sourceDocumentId and sourceUrl are required." },
      { status: 400 }
    );
  }

  const traceId = crypto.randomUUID();
  const result = await runParsePipeline({ traceId, sourceDocumentId, sourceUrl });
  const hasDeadLetter = result.publishResults.some((publishResult) => publishResult.status === "dead_letter");

  if (hasDeadLetter) {
    return NextResponse.json(
      {
        error: "One or more ingestion events failed schema validation and were sent to dead-letter.",
        ...result
      },
      { status: 422 }
    );
  }

  return NextResponse.json(result, { status: 202 });
}
