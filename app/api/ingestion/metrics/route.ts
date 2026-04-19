import { NextResponse } from "next/server";
import { getMonitoringSnapshot, resetMonitoringMetrics } from "@/lib/ingestion/monitoring/metrics";

export async function GET() {
  return NextResponse.json(getMonitoringSnapshot());
}

export async function DELETE() {
  resetMonitoringMetrics();
  return NextResponse.json({ ok: true });
}
