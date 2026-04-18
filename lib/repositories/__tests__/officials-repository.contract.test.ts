import { describe, expect, test } from "vitest";
import type {
  ImpactStats,
  OfficialProfile,
  OfficialSearchFilters,
  OfficialSearchResult,
  PromiseUpdate,
  TrendingOfficial,
  OfficialsRepository
} from "../../domain/officials";
import { MockOfficialsRepository } from "../mock-officials-repository";
import { RealOfficialsRepository } from "../real-officials-repository";

const SEARCH_RESULTS: readonly OfficialSearchResult[] = [
  {
    id: "zohran-mamdani",
    name: "Zohran Mamdani",
    office: "Mayor",
    countryCode: "US",
    status: "in_progress",
    category: "housing",
    score: 63
  },
  {
    id: "eric-adams",
    name: "Eric Adams",
    office: "Mayor",
    countryCode: "US",
    status: "broken",
    category: "public-safety",
    score: 41
  },
  {
    id: "london-breed",
    name: "London Breed",
    office: "Mayor",
    countryCode: "US",
    status: "kept",
    category: "transport",
    score: 72
  }
];

const PROFILE_FIXTURE: OfficialProfile = {
  id: "zohran-mamdani",
  name: "Zohran Mamdani",
  office: "Mayor",
  countryCode: "US",
  jurisdiction: "New York City, US",
  score: 63,
  keptCount: 18,
  inProgressCount: 10,
  brokenCount: 5,
  lastEvidenceSync: "2026-03-01",
  tabs: [
    { id: "promises", label: "Promises" },
    { id: "evidence", label: "Evidence" },
    { id: "timeline", label: "Timeline" }
  ],
  rowsByTab: {
    promises: [
      { id: "p1", cells: { item: "Build 200k affordable homes", status: "In Progress", updatedAt: "2026-02-10" } }
    ],
    evidence: [{ id: "e1", cells: { item: "City budget amendment #24", status: "Verified", updatedAt: "2026-02-15" } }],
    timeline: [{ id: "t1", cells: { item: "Housing policy introduced", status: "Milestone", updatedAt: "2025-08-04" } }]
  }
};

const TRENDING_FIXTURE: readonly TrendingOfficial[] = [
  {
    id: "zohran-mamdani",
    name: "Zohran Mamdani",
    office: "Mayor",
    countryCode: "US",
    score: 63,
    trendScore: 73,
    keptCount: 18,
    inProgressCount: 10,
    brokenCount: 5
  }
];

const UPDATES_FIXTURE: readonly PromiseUpdate[] = [
  {
    officialName: "Zohran Mamdani",
    promise: "Freeze MTA fares",
    status: "Kept",
    updatedAtLabel: "2 days ago"
  }
];

const STATS_FIXTURE: ImpactStats = {
  officialsTracked: 112,
  promisesMonitored: 1420,
  sourceDocumentsAnalyzed: 5300
};

function createRepositoryFixtures(): Array<{ readonly name: string; readonly repository: OfficialsRepository }> {
  const mockRepository = new MockOfficialsRepository();
  const realRepository = new RealOfficialsRepository({
    baseUrl: "https://example.test",
    fetchImpl: (async (input) => {
      const url = new URL(String(input));
      if (url.pathname === "/officials/search") {
        const filters: OfficialSearchFilters = {
          query: url.searchParams.get("query") ?? "",
          status: (url.searchParams.get("status") ?? "all") as OfficialSearchFilters["status"],
          category: (url.searchParams.get("category") ?? "all") as OfficialSearchFilters["category"]
        };
        const filtered = filterSearchResults(filters);
        return new Response(JSON.stringify(filtered), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (url.pathname.startsWith("/officials/")) {
        return new Response(JSON.stringify(PROFILE_FIXTURE), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (url.pathname === "/home/trending") {
        return new Response(JSON.stringify(TRENDING_FIXTURE), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (url.pathname === "/home/updates") {
        return new Response(JSON.stringify(UPDATES_FIXTURE), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (url.pathname === "/home/stats") {
        return new Response(JSON.stringify(STATS_FIXTURE), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      if (url.pathname === "/home/last-updated") {
        return new Response(JSON.stringify({ label: "Updated 2 days ago" }), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ message: "not found" }), { status: 404 });
    }) as typeof fetch
  });

  return [
    { name: "mock", repository: mockRepository },
    { name: "real", repository: realRepository }
  ];
}

function filterSearchResults(filters: OfficialSearchFilters): readonly OfficialSearchResult[] {
  const queryValue = filters.query.trim().toLowerCase();
  return SEARCH_RESULTS.filter((row) => {
    const queryMatch = !queryValue || row.name.toLowerCase().includes(queryValue);
    const statusMatch = filters.status === "all" || row.status === filters.status;
    const categoryMatch = filters.category === "all" || row.category === filters.category;
    return queryMatch && statusMatch && categoryMatch;
  });
}

describe("OfficialsRepository contract", () => {
  const fixtures = createRepositoryFixtures();

  for (const fixture of fixtures) {
    describe(fixture.name, () => {
      test("exposes stable filter options", () => {
        expect(fixture.repository.searchStatusOptions.length).toBeGreaterThan(0);
        expect(fixture.repository.searchCategoryOptions.length).toBeGreaterThan(0);
        expect(fixture.repository.searchStatusOptions[0]?.value).toBe("all");
        expect(fixture.repository.searchCategoryOptions[0]?.value).toBe("all");
      });

      test("applies query/status/category filters consistently", async () => {
        const filtered = await fixture.repository.searchOfficials({
          query: "zohran",
          status: "in_progress",
          category: "housing"
        });
        expect(filtered).toHaveLength(1);
        expect(filtered[0]?.name).toBe("Zohran Mamdani");
      });

      test("returns a typed profile payload by id", async () => {
        const profile = await fixture.repository.getOfficialProfileById("zohran-mamdani");
        expect(profile.name).toBe("Zohran Mamdani");
        expect(profile.tabs.length).toBeGreaterThan(0);
        expect(profile.rowsByTab.promises.length).toBeGreaterThan(0);
      });

      test("returns home feed data with stable shape", async () => {
        const [trending, updates, stats, lastUpdated] = await Promise.all([
          fixture.repository.getTrendingOfficials(),
          fixture.repository.getRecentPromiseUpdates(),
          fixture.repository.getImpactStats(),
          fixture.repository.getDataLastUpdatedLabel()
        ]);

        expect(trending.length).toBeGreaterThan(0);
        expect(trending[0]?.trendScore).toBeGreaterThanOrEqual(0);
        expect(updates.length).toBeGreaterThan(0);
        expect(stats.officialsTracked).toBeGreaterThan(0);
        expect(lastUpdated.length).toBeGreaterThan(0);
      });
    });
  }
});
