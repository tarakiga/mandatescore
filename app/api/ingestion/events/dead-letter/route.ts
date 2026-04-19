import { NextResponse } from "next/server";
import { listDeadLetterEvents } from "@/lib/ingestion/events/publisher";

export async function GET() {
  const deadLetters = await listDeadLetterEvents();
  return NextResponse.json({
    deadLetters
  });
}
