import { NextResponse } from "next/server";
import { searchOfficials } from "@/lib/api/officials";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchOfficials({
      query,
      status: "all",
      category: "all"
    });

    return NextResponse.json(
      results.slice(0, 6).map((result) => ({
        id: result.id,
        name: result.name,
        office: result.office,
        countryCode: result.countryCode,
        score: result.score,
        status: result.status.replaceAll("_", " ")
      }))
    );
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
