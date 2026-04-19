import { Pool } from "pg";

export type HomeTrendingReadModel = {
  readonly officialId: string;
  readonly officialSlug: string;
  readonly officialName: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly mandateScore: number;
  readonly trendScore: number;
  readonly keptCount: number;
  readonly inProgressCount: number;
  readonly brokenCount: number;
  readonly dataLastUpdatedLabel: string;
  readonly projectionVersion: string;
  readonly refreshedAt: string;
};

export type HomeUpdatesReadModel = {
  readonly id: string;
  readonly officialId: string;
  readonly officialName: string;
  readonly promiseTitle: string;
  readonly statusLabel: string;
  readonly updatedAtLabel: string;
  readonly projectionVersion: string;
  readonly refreshedAt: string;
};

export type OfficialProfileReadModel = {
  readonly officialId: string;
  readonly officialSlug: string;
  readonly officialName: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly jurisdiction: string;
  readonly mandateScore: number;
  readonly keptCount: number;
  readonly inProgressCount: number;
  readonly brokenCount: number;
  readonly lastEvidenceSyncLabel: string;
  readonly dataLastUpdatedLabel: string;
  readonly sourceMode: "live" | "fallback";
  readonly projectionVersion: string;
  readonly refreshedAt: string;
};

export interface ReadModelStore {
  replaceHomeTrending(rows: readonly HomeTrendingReadModel[]): Promise<void>;
  replaceHomeUpdates(rows: readonly HomeUpdatesReadModel[]): Promise<void>;
  upsertOfficialProfile(row: OfficialProfileReadModel): Promise<void>;
  listHomeTrending(): Promise<readonly HomeTrendingReadModel[]>;
  listHomeUpdates(): Promise<readonly HomeUpdatesReadModel[]>;
  listOfficialProfiles(): Promise<readonly OfficialProfileReadModel[]>;
}

class InMemoryReadModelStore implements ReadModelStore {
  private homeTrending: HomeTrendingReadModel[] = [];
  private homeUpdates: HomeUpdatesReadModel[] = [];
  private officialProfiles = new Map<string, OfficialProfileReadModel>();

  public async replaceHomeTrending(rows: readonly HomeTrendingReadModel[]): Promise<void> {
    this.homeTrending = [...rows];
  }

  public async replaceHomeUpdates(rows: readonly HomeUpdatesReadModel[]): Promise<void> {
    this.homeUpdates = [...rows];
  }

  public async upsertOfficialProfile(row: OfficialProfileReadModel): Promise<void> {
    this.officialProfiles.set(row.officialId, row);
  }

  public async listHomeTrending(): Promise<readonly HomeTrendingReadModel[]> {
    return this.homeTrending;
  }

  public async listHomeUpdates(): Promise<readonly HomeUpdatesReadModel[]> {
    return this.homeUpdates;
  }

  public async listOfficialProfiles(): Promise<readonly OfficialProfileReadModel[]> {
    return Array.from(this.officialProfiles.values());
  }
}

class PostgresReadModelStore implements ReadModelStore {
  private readonly pool: Pool;

  public constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async replaceHomeTrending(rows: readonly HomeTrendingReadModel[]): Promise<void> {
    await this.pool.query("DELETE FROM home_trending_view");
    for (const row of rows) {
      const officialId = toOfficialUuid(row.officialId);
      if (!officialId) continue;
      await this.pool.query(
        `
        INSERT INTO home_trending_view
          (official_id, official_slug, official_name, office, country_code, mandate_score, trend_score, kept_count, in_progress_count, broken_count, data_last_updated_label, projection_version, refreshed_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        ON CONFLICT (official_id) DO UPDATE SET
          official_slug=EXCLUDED.official_slug,
          official_name=EXCLUDED.official_name,
          office=EXCLUDED.office,
          country_code=EXCLUDED.country_code,
          mandate_score=EXCLUDED.mandate_score,
          trend_score=EXCLUDED.trend_score,
          kept_count=EXCLUDED.kept_count,
          in_progress_count=EXCLUDED.in_progress_count,
          broken_count=EXCLUDED.broken_count,
          data_last_updated_label=EXCLUDED.data_last_updated_label,
          projection_version=EXCLUDED.projection_version,
          refreshed_at=EXCLUDED.refreshed_at
        `,
        [
          officialId, row.officialSlug, row.officialName, row.office, row.countryCode ?? null,
          row.mandateScore, row.trendScore, row.keptCount, row.inProgressCount, row.brokenCount,
          row.dataLastUpdatedLabel, row.projectionVersion, row.refreshedAt
        ]
      );
    }
  }

  public async replaceHomeUpdates(rows: readonly HomeUpdatesReadModel[]): Promise<void> {
    await this.pool.query("DELETE FROM home_updates_view");
    for (const row of rows) {
      const officialId = toOfficialUuid(row.officialId);
      if (!officialId) continue;
      await this.pool.query(
        `
        INSERT INTO home_updates_view
          (id, official_id, official_name, promise_id, promise_title, status_label, updated_at_label, projection_version, refreshed_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        `,
        [
          toUuidOrRandom(row.id),
          officialId,
          row.officialName,
          null,
          row.promiseTitle,
          row.statusLabel,
          row.updatedAtLabel,
          row.projectionVersion,
          row.refreshedAt
        ]
      );
    }
  }

  public async upsertOfficialProfile(row: OfficialProfileReadModel): Promise<void> {
    const officialId = toOfficialUuid(row.officialId);
    if (!officialId) return;
    await this.pool.query(
      `
      INSERT INTO official_profile_view
        (official_id, official_slug, official_name, office, country_code, jurisdiction, mandate_score, kept_count, in_progress_count, broken_count, last_evidence_sync_label, data_last_updated_label, source_mode, projection_version, refreshed_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (official_id) DO UPDATE SET
        official_slug=EXCLUDED.official_slug,
        official_name=EXCLUDED.official_name,
        office=EXCLUDED.office,
        country_code=EXCLUDED.country_code,
        jurisdiction=EXCLUDED.jurisdiction,
        mandate_score=EXCLUDED.mandate_score,
        kept_count=EXCLUDED.kept_count,
        in_progress_count=EXCLUDED.in_progress_count,
        broken_count=EXCLUDED.broken_count,
        last_evidence_sync_label=EXCLUDED.last_evidence_sync_label,
        data_last_updated_label=EXCLUDED.data_last_updated_label,
        source_mode=EXCLUDED.source_mode,
        projection_version=EXCLUDED.projection_version,
        refreshed_at=EXCLUDED.refreshed_at
      `,
      [
        officialId, row.officialSlug, row.officialName, row.office, row.countryCode ?? null, row.jurisdiction,
        row.mandateScore, row.keptCount, row.inProgressCount, row.brokenCount, row.lastEvidenceSyncLabel,
        row.dataLastUpdatedLabel, row.sourceMode, row.projectionVersion, row.refreshedAt
      ]
    );
  }

  public async listHomeTrending(): Promise<readonly HomeTrendingReadModel[]> {
    return [];
  }
  public async listHomeUpdates(): Promise<readonly HomeUpdatesReadModel[]> {
    return [];
  }
  public async listOfficialProfiles(): Promise<readonly OfficialProfileReadModel[]> {
    return [];
  }
}

let singleton: ReadModelStore | null = null;

export function getReadModelStore(): ReadModelStore {
  if (singleton) return singleton;
  const mode = process.env.INGESTION_DATA_STORE?.toLowerCase();
  const connectionString = process.env.DATABASE_URL;
  singleton = mode === "postgres" && connectionString
    ? new PostgresReadModelStore(connectionString)
    : new InMemoryReadModelStore();
  return singleton;
}

function toUuidOrRandom(value: string): string {
  return UUID_REGEX.test(value) ? value : crypto.randomUUID();
}

const SLUG_TO_SEEDED_UUID: Readonly<Record<string, string>> = {
  "zohran-mamdani": "7fcd6c31-8703-4ece-a4a0-4fa1b2d9a800",
  "london-breed": "7fcd6c31-8703-4ece-a4a0-4fa1b2d9a801",
  "eric-adams": "7fcd6c31-8703-4ece-a4a0-4fa1b2d9a802"
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toOfficialUuid(input: string): string | null {
  if (UUID_REGEX.test(input)) return input;
  return SLUG_TO_SEEDED_UUID[input] ?? null;
}
