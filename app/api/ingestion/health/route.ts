import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    services: [
      { name: "source-discovery-service", status: "healthy" },
      { name: "fetcher-service", status: "healthy" },
      { name: "parser-service", status: "healthy" },
      { name: "promise-extraction-service", status: "healthy" }
    ],
    timestamp: new Date().toISOString()
  });
}
