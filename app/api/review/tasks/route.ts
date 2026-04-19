import { NextResponse } from "next/server";
import { listReviewTasks } from "@/lib/ingestion/review-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const validState = state === "open" || state === "in_review" || state === "resolved" ? state : undefined;
  const tasks = await listReviewTasks(validState);
  return NextResponse.json({ tasks });
}
