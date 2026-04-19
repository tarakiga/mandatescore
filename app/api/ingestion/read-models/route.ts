import { NextResponse } from "next/server";
import { getReadModelStore } from "@/lib/ingestion/stores/read-model-store";

export async function GET() {
  const store = getReadModelStore();
  const [homeTrending, homeUpdates, officialProfiles] = await Promise.all([
    store.listHomeTrending(),
    store.listHomeUpdates(),
    store.listOfficialProfiles()
  ]);

  return NextResponse.json({
    homeTrending,
    homeUpdates,
    officialProfiles
  });
}
