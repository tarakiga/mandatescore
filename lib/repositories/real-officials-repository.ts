import type {
  FilterOption,
  ImpactStats,
  OfficialProfile,
  OfficialProfileTabId,
  PromiseUpdate,
  OfficialSearchFilters,
  OfficialSearchResult,
  TrendingOfficial,
  OfficialsRepository,
  ProfileRecordRow
} from "@/lib/domain/officials";

type RealOfficialsRepositoryConfig = {
  readonly baseUrl?: string;
  readonly fetchImpl?: typeof fetch;
};

type OfficialSearchResultDto = {
  readonly id: string;
  readonly name: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly status: OfficialSearchResult["status"];
  readonly category: OfficialSearchResult["category"];
  readonly score: number;
};

type OfficialProfileDto = {
  readonly id: string;
  readonly name: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly jurisdiction: string;
  readonly score: number;
  readonly keptCount: number;
  readonly inProgressCount: number;
  readonly brokenCount: number;
  readonly lastEvidenceSync: string;
  readonly tabs: readonly { readonly id: OfficialProfileTabId; readonly label: string }[];
  readonly rowsByTab: Record<OfficialProfileTabId, readonly ProfileRecordRow[]>;
};

type TrendingOfficialDto = {
  readonly id: string;
  readonly name: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly score: number;
  readonly trendScore?: number;
  readonly keptCount: number;
  readonly inProgressCount: number;
  readonly brokenCount: number;
};

type PromiseUpdateDto = {
  readonly officialName: string;
  readonly promise: string;
  readonly status: PromiseUpdate["status"];
  readonly updatedAtLabel: string;
};

type ImpactStatsDto = {
  readonly officialsTracked: number;
  readonly promisesMonitored: number;
  readonly sourceDocumentsAnalyzed: number;
};

type DataLastUpdatedDto = {
  readonly label: string;
};

export class RealOfficialsRepository implements OfficialsRepository {
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

  private readonly baseUrl: string | null;
  private readonly fetchImpl: typeof fetch;

  public constructor(config: RealOfficialsRepositoryConfig = {}) {
    const rawBaseUrl = config.baseUrl?.trim();
    this.baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : null;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  public async searchOfficials(filters: OfficialSearchFilters): Promise<readonly OfficialSearchResult[]> {
    const query = new URLSearchParams({
      query: filters.query,
      status: filters.status,
      category: filters.category
    });
    const payload = await this.fetchJson<readonly OfficialSearchResultDto[]>(`/officials/search?${query.toString()}`);
    return payload.map((item) => ({
      id: item.id,
      name: item.name,
      office: item.office,
      countryCode: item.countryCode,
      status: item.status,
      category: item.category,
      score: item.score
    }));
  }

  public async getOfficialProfileById(officialId: string): Promise<OfficialProfile> {
    const payload = await this.fetchJson<OfficialProfileDto>(`/officials/${encodeURIComponent(officialId)}`);
    return {
      id: payload.id,
      name: payload.name,
      office: payload.office,
      countryCode: payload.countryCode,
      jurisdiction: payload.jurisdiction,
      score: payload.score,
      keptCount: payload.keptCount,
      inProgressCount: payload.inProgressCount,
      brokenCount: payload.brokenCount,
      lastEvidenceSync: payload.lastEvidenceSync,
      tabs: payload.tabs,
      rowsByTab: payload.rowsByTab
    };
  }

  public async getTrendingOfficials(): Promise<readonly TrendingOfficial[]> {
    const payload = await this.fetchJson<readonly TrendingOfficialDto[]>("/home/trending");
    return payload.map((item) => ({
      id: item.id,
      name: item.name,
      office: item.office,
      countryCode: item.countryCode,
      score: item.score,
      trendScore: item.trendScore ?? item.score,
      keptCount: item.keptCount,
      inProgressCount: item.inProgressCount,
      brokenCount: item.brokenCount
    }));
  }

  public async getRecentPromiseUpdates(): Promise<readonly PromiseUpdate[]> {
    const payload = await this.fetchJson<readonly PromiseUpdateDto[]>("/home/updates");
    return payload.map((item) => ({
      officialName: item.officialName,
      promise: item.promise,
      status: item.status,
      updatedAtLabel: item.updatedAtLabel
    }));
  }

  public async getImpactStats(): Promise<ImpactStats> {
    const payload = await this.fetchJson<ImpactStatsDto>("/home/stats");
    return {
      officialsTracked: payload.officialsTracked,
      promisesMonitored: payload.promisesMonitored,
      sourceDocumentsAnalyzed: payload.sourceDocumentsAnalyzed
    };
  }

  public async getDataLastUpdatedLabel(): Promise<string> {
    const payload = await this.fetchJson<DataLastUpdatedDto>("/home/last-updated");
    return payload.label;
  }

  private async fetchJson<T>(path: string): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("RealOfficialsRepository requires NEXT_PUBLIC_MANDATESCORE_API_BASE_URL.");
    }

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Repository request failed (${response.status}) for ${path}`);
    }

    return (await response.json()) as T;
  }
}
