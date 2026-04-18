export type SearchStatus = "all" | "kept" | "in_progress" | "broken";
export type SearchCategory = "all" | "housing" | "transport" | "public-safety";

export type FilterOption = {
  readonly value: string;
  readonly label: string;
};

export type OfficialSearchFilters = {
  readonly query: string;
  readonly status: SearchStatus;
  readonly category: SearchCategory;
};

export type OfficialSearchResult = {
  readonly id: string;
  readonly name: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly status: Exclude<SearchStatus, "all">;
  readonly category: Exclude<SearchCategory, "all">;
  readonly score: number;
};

export type TrendingOfficial = {
  readonly id: string;
  readonly name: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly score: number;
  readonly trendScore: number;
  readonly keptCount: number;
  readonly inProgressCount: number;
  readonly brokenCount: number;
};

export type PromiseUpdateStatus = "Kept" | "In Progress" | "Broken";

export type PromiseUpdate = {
  readonly officialName: string;
  readonly promise: string;
  readonly status: PromiseUpdateStatus;
  readonly updatedAtLabel: string;
};

export type ImpactStats = {
  readonly officialsTracked: number;
  readonly promisesMonitored: number;
  readonly sourceDocumentsAnalyzed: number;
};

export type DataSourceMode = "live" | "fallback";

export type OfficialProfileTabId = "promises" | "evidence" | "timeline";

export type OfficialProfileTab = {
  readonly id: OfficialProfileTabId;
  readonly label: string;
};

export type ProfileRecordRow = {
  readonly id: string;
  readonly cells: {
    readonly item: string;
    readonly status: string;
    readonly updatedAt: string;
  };
};

export type OfficialProfile = {
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
  readonly tabs: readonly OfficialProfileTab[];
  readonly rowsByTab: Readonly<Record<OfficialProfileTabId, readonly ProfileRecordRow[]>>;
};

export interface OfficialsRepository {
  readonly searchStatusOptions: readonly FilterOption[];
  readonly searchCategoryOptions: readonly FilterOption[];
  searchOfficials(filters: OfficialSearchFilters): Promise<readonly OfficialSearchResult[]>;
  getOfficialProfileById(officialId: string): Promise<OfficialProfile>;
  getTrendingOfficials(): Promise<readonly TrendingOfficial[]>;
  getRecentPromiseUpdates(): Promise<readonly PromiseUpdate[]>;
  getImpactStats(): Promise<ImpactStats>;
  getDataLastUpdatedLabel(): Promise<string>;
}

export interface OfficialsRepositoryWithSyncSeed extends OfficialsRepository {
  searchOfficialsSync(filters: OfficialSearchFilters): readonly OfficialSearchResult[];
}
