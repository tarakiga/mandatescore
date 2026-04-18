import type {
  FilterOption,
  ImpactStats,
  OfficialProfile,
  PromiseUpdate,
  OfficialSearchFilters,
  OfficialSearchResult,
  TrendingOfficial,
  OfficialsRepositoryWithSyncSeed
} from "@/lib/domain/officials";

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

const OFFICIAL_PROFILES: Readonly<Record<string, OfficialProfile>> = {
  "zohran-mamdani": {
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
        { id: "p1", cells: { item: "Build 200k affordable homes", status: "In Progress", updatedAt: "2026-02-10" } },
        { id: "p2", cells: { item: "Expand bus-only corridors", status: "Kept", updatedAt: "2026-01-02" } },
        { id: "p3", cells: { item: "Reduce permit delays by 40%", status: "Broken", updatedAt: "2025-12-12" } }
      ],
      evidence: [
        { id: "e1", cells: { item: "City budget amendment #24", status: "Verified", updatedAt: "2026-02-15" } },
        { id: "e2", cells: { item: "Transportation report Q4", status: "Verified", updatedAt: "2026-01-20" } }
      ],
      timeline: [
        { id: "t1", cells: { item: "Housing policy introduced", status: "Milestone", updatedAt: "2025-08-04" } },
        { id: "t2", cells: { item: "Oversight hearing", status: "Milestone", updatedAt: "2025-11-18" } }
      ]
    }
  }
};

const FALLBACK_PROFILE = OFFICIAL_PROFILES["zohran-mamdani"];

const RECENT_PROMISE_UPDATES: readonly PromiseUpdate[] = [
  {
    officialName: "Zohran Mamdani",
    promise: "Freeze MTA fares",
    status: "Kept",
    updatedAtLabel: "2 days ago"
  },
  {
    officialName: "London Breed",
    promise: "Build 50,000 new housing units",
    status: "In Progress",
    updatedAtLabel: "5 days ago"
  },
  {
    officialName: "Eric Adams",
    promise: "Reduce agency budgets by 3%",
    status: "Broken",
    updatedAtLabel: "1 week ago"
  }
];

const IMPACT_STATS: ImpactStats = {
  officialsTracked: 112,
  promisesMonitored: 1420,
  sourceDocumentsAnalyzed: 5300
};

const TREND_SIGNALS: Readonly<
  Record<
    string,
    {
      readonly searchVolumeIndex: number; // 0-100
      readonly hoursSinceUpdate: number; // lower is fresher
      readonly evidenceVelocityPerWeek: number; // docs/week
      readonly scoreMovement: number; // score delta in last period
    }
  >
> = {
  "zohran-mamdani": {
    searchVolumeIndex: 88,
    hoursSinceUpdate: 18,
    evidenceVelocityPerWeek: 4.2,
    scoreMovement: 5
  },
  "london-breed": {
    searchVolumeIndex: 74,
    hoursSinceUpdate: 32,
    evidenceVelocityPerWeek: 3.1,
    scoreMovement: 2
  },
  "eric-adams": {
    searchVolumeIndex: 61,
    hoursSinceUpdate: 52,
    evidenceVelocityPerWeek: 2.4,
    scoreMovement: -1
  }
};

export class MockOfficialsRepository implements OfficialsRepositoryWithSyncSeed {
  public readonly searchStatusOptions: readonly FilterOption[] = [
    { value: "all", label: "All" },
    { value: "kept", label: "Kept" },
    { value: "in_progress", label: "In Progress" },
    { value: "broken", label: "Broken" }
  ];

  public readonly searchCategoryOptions: readonly FilterOption[] = [
    { value: "all", label: "All" },
    { value: "housing", label: "Housing" },
    { value: "transport", label: "Transport" },
    { value: "public-safety", label: "Public Safety" }
  ];

  public async searchOfficials(filters: OfficialSearchFilters): Promise<readonly OfficialSearchResult[]> {
    return this.searchOfficialsSync(filters);
  }

  public searchOfficialsSync(filters: OfficialSearchFilters): readonly OfficialSearchResult[] {
    const queryValue = filters.query.trim().toLowerCase();
    return SEARCH_RESULTS.filter((row) => {
      const queryMatch = !queryValue || row.name.toLowerCase().includes(queryValue);
      const statusMatch = filters.status === "all" || row.status === filters.status;
      const categoryMatch = filters.category === "all" || row.category === filters.category;
      return queryMatch && statusMatch && categoryMatch;
    });
  }

  public async getOfficialProfileById(officialId: string): Promise<OfficialProfile> {
    const normalizedId = decodeURIComponent(officialId).toLowerCase();
    return OFFICIAL_PROFILES[normalizedId] ?? {
      ...FALLBACK_PROFILE,
      id: normalizedId,
      name: toDisplayName(normalizedId)
    };
  }

  public async getTrendingOfficials(): Promise<readonly TrendingOfficial[]> {
    return SEARCH_RESULTS.map((official) => {
      const profile = OFFICIAL_PROFILES[official.id];
      const trendSignals = TREND_SIGNALS[official.id];
      const trendScore = calculateTrendScore({
        searchVolumeIndex: trendSignals?.searchVolumeIndex ?? 50,
        hoursSinceUpdate: trendSignals?.hoursSinceUpdate ?? 72,
        evidenceVelocityPerWeek: trendSignals?.evidenceVelocityPerWeek ?? 2,
        scoreMovement: trendSignals?.scoreMovement ?? 0
      });

      return {
        id: official.id,
        name: official.name,
        office: official.office,
        countryCode: official.countryCode,
        score: official.score,
        trendScore,
        keptCount: profile?.keptCount ?? 0,
        inProgressCount: profile?.inProgressCount ?? 0,
        brokenCount: profile?.brokenCount ?? 0
      };
    }).sort((a, b) => b.trendScore - a.trendScore || b.score - a.score);
  }

  public async getRecentPromiseUpdates(): Promise<readonly PromiseUpdate[]> {
    return RECENT_PROMISE_UPDATES;
  }

  public async getImpactStats(): Promise<ImpactStats> {
    return IMPACT_STATS;
  }

  public async getDataLastUpdatedLabel(): Promise<string> {
    return "Updated 2 days ago";
  }
}

function toDisplayName(rawId: string): string {
  return rawId
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function calculateTrendScore(signals: {
  readonly searchVolumeIndex: number;
  readonly hoursSinceUpdate: number;
  readonly evidenceVelocityPerWeek: number;
  readonly scoreMovement: number;
}): number {
  // Transparent weighted formula:
  // 40% search volume + 25% recency + 20% evidence velocity + 15% score movement
  const searchScore = clamp(signals.searchVolumeIndex, 0, 100);
  const recencyScore = clamp(100 - (signals.hoursSinceUpdate / 168) * 100, 0, 100);
  const velocityScore = clamp(signals.evidenceVelocityPerWeek * 20, 0, 100);
  const movementScore = clamp((signals.scoreMovement + 10) * 5, 0, 100);
  const weighted =
    0.4 * searchScore +
    0.25 * recencyScore +
    0.2 * velocityScore +
    0.15 * movementScore;
  return Math.round(weighted);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
