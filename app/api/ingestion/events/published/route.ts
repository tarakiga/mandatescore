import { NextResponse } from "next/server";
import { listPublishedEvents } from "@/lib/ingestion/events/publisher";

export async function GET() {
  const published = await listPublishedEvents();
  return NextResponse.json({
    published
  });
}
