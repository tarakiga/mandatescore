import { getDataLastUpdatedLabel, getDataSourceMode, getOfficialProfileById, getRecentPromiseUpdates, getTrendingOfficials } from "@/lib/api/officials";
import { listPublishedEvents, publishTopicEnvelope } from "../events/publisher";
import { createEventEnvelope } from "../events/envelope";
import { INGESTION_TOPICS } from "../events/topics";
import { getReadModelStore } from "../stores/read-model-store";

const processedRefreshEventIds = new Set<string>();

export class ReadModelPublisherService {
  public async runPendingRefreshes(): Promise<{
    readonly processedEvents: number;
    readonly refreshedOfficialIds: readonly string[];
  }> {
    const published = await listPublishedEvents();
    const refreshEvents = published.filter((event) => event.topic === INGESTION_TOPICS.publishRefreshRequested);
    const targetOfficialIds: string[] = [];

    for (const refreshEvent of refreshEvents) {
      if (processedRefreshEventIds.has(refreshEvent.envelope.event_id)) continue;
      processedRefreshEventIds.add(refreshEvent.envelope.event_id);
      const officialId = String(refreshEvent.envelope.payload.official_id ?? "").trim();
      if (!officialId) continue;
      await this.refreshOfficial(officialId);
      targetOfficialIds.push(officialId);
      await publishTopicEnvelope(
        INGESTION_TOPICS.publishCompleted,
        createEventEnvelope({
          traceId: refreshEvent.envelope.trace_id,
          payload: {
            official_id: officialId,
            published_at: new Date().toISOString(),
            read_model_version: "read-model-v1"
          }
        })
      );
    }

    return {
      processedEvents: targetOfficialIds.length,
      refreshedOfficialIds: targetOfficialIds
    };
  }

  public async refreshOfficial(officialId: string): Promise<void> {
    const store = getReadModelStore();
    const [trending, updates, profile, dataLastUpdatedLabel] = await Promise.all([
      getTrendingOfficials(),
      getRecentPromiseUpdates(),
      getOfficialProfileById(officialId),
      getDataLastUpdatedLabel()
    ]);
    const refreshedAt = new Date().toISOString();
    const projectionVersion = "read-model-v1";

    await store.replaceHomeTrending(
      trending.map((item) => ({
        officialId: item.id,
        officialSlug: item.id,
        officialName: item.name,
        office: item.office,
        countryCode: item.countryCode,
        mandateScore: item.score,
        trendScore: item.trendScore,
        keptCount: item.keptCount,
        inProgressCount: item.inProgressCount,
        brokenCount: item.brokenCount,
        dataLastUpdatedLabel,
        projectionVersion,
        refreshedAt
      }))
    );

    const officialMap = new Map(trending.map((item) => [item.name, item.id]));
    await store.replaceHomeUpdates(
      updates
        .map((item) => {
          const mappedOfficialId = officialMap.get(item.officialName);
          if (!mappedOfficialId) return null;
          return {
            id: crypto.randomUUID(),
            officialId: mappedOfficialId,
            officialName: item.officialName,
            promiseTitle: item.promise,
            statusLabel: item.status,
            updatedAtLabel: item.updatedAtLabel,
            projectionVersion,
            refreshedAt
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    );

    await store.upsertOfficialProfile({
      officialId: profile.id,
      officialSlug: profile.id,
      officialName: profile.name,
      office: profile.office,
      countryCode: profile.countryCode,
      jurisdiction: profile.jurisdiction,
      mandateScore: profile.score,
      keptCount: profile.keptCount,
      inProgressCount: profile.inProgressCount,
      brokenCount: profile.brokenCount,
      lastEvidenceSyncLabel: profile.lastEvidenceSync,
      dataLastUpdatedLabel,
      sourceMode: getDataSourceMode(),
      projectionVersion,
      refreshedAt
    });
  }
}

export function resetReadModelPublisherProgress(): void {
  processedRefreshEventIds.clear();
}
