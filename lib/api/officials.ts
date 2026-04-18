import type {
  DataSourceMode,
  ImpactStats,
  OfficialProfile,
  PromiseUpdate,
  OfficialSearchFilters,
  OfficialSearchResult,
  TrendingOfficial,
  OfficialsRepository,
  OfficialsRepositoryWithSyncSeed
} from "@/lib/domain/officials";
import { MockOfficialsRepository } from "@/lib/repositories/mock-officials-repository";
import { RealOfficialsRepository } from "@/lib/repositories/real-officials-repository";

const syncSeedRepository = new MockOfficialsRepository();

let officialsRepository: OfficialsRepository = createOfficialsRepositoryFromEnv();

export function configureOfficialsRepository(nextRepository: OfficialsRepository) {
  officialsRepository = nextRepository;
}

export function getOfficialsRepository(): OfficialsRepository {
  return officialsRepository;
}

export const SEARCH_STATUS_OPTIONS = getOfficialsRepository().searchStatusOptions;
export const SEARCH_CATEGORY_OPTIONS = getOfficialsRepository().searchCategoryOptions;

export async function searchOfficials(filters: OfficialSearchFilters): Promise<readonly OfficialSearchResult[]> {
  return getOfficialsRepository().searchOfficials(filters);
}

export function searchOfficialsSync(filters: OfficialSearchFilters): readonly OfficialSearchResult[] {
  const repository = getOfficialsRepository();
  if (isSyncSeedRepository(repository)) {
    return repository.searchOfficialsSync(filters);
  }
  return syncSeedRepository.searchOfficialsSync(filters);
}

export async function getOfficialProfileById(officialId: string): Promise<OfficialProfile> {
  return getOfficialsRepository().getOfficialProfileById(officialId);
}

export async function getTrendingOfficials(): Promise<readonly TrendingOfficial[]> {
  return getOfficialsRepository().getTrendingOfficials();
}

export async function getRecentPromiseUpdates(): Promise<readonly PromiseUpdate[]> {
  return getOfficialsRepository().getRecentPromiseUpdates();
}

export async function getImpactStats(): Promise<ImpactStats> {
  return getOfficialsRepository().getImpactStats();
}

export async function getDataLastUpdatedLabel(): Promise<string> {
  return getOfficialsRepository().getDataLastUpdatedLabel();
}

export function getDataSourceMode(): DataSourceMode {
  return getOfficialsRepository() instanceof RealOfficialsRepository ? "live" : "fallback";
}

export function getTrendingFormulaSummary(): string {
  return "Trending score = 40% search volume + 25% recency + 20% evidence velocity + 15% score movement.";
}

function isSyncSeedRepository(repository: OfficialsRepository): repository is OfficialsRepositoryWithSyncSeed {
  return typeof (repository as OfficialsRepositoryWithSyncSeed).searchOfficialsSync === "function";
}

function createOfficialsRepositoryFromEnv(): OfficialsRepository {
  const dataSource = process.env.NEXT_PUBLIC_MANDATESCORE_DATA_SOURCE?.toLowerCase();
  if (dataSource === "real") {
    return new RealOfficialsRepository({
      baseUrl: process.env.NEXT_PUBLIC_MANDATESCORE_API_BASE_URL
    });
  }
  return syncSeedRepository;
}
