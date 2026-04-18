"use client";

import { use, useEffect, useMemo, useState } from "react";
import { getDataSourceMode, getOfficialProfileById } from "@/lib/api/officials";
import type { OfficialProfile, OfficialProfileTabId } from "@/lib/domain/officials";
import { Badge, Card, Cluster, OfficialProfileTemplate, PublicShell, Section, Skeleton, Stack, Text } from "@/components/ui";

type OfficialProfilePageProps = {
  readonly params: Promise<{
    readonly officialId: string;
  }>;
};

export default function OfficialProfilePage({ params }: OfficialProfilePageProps) {
  const { officialId } = use(params);
  const [activeTabId, setActiveTabId] = useState<OfficialProfileTabId>("promises");
  const [profile, setProfile] = useState<OfficialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataSourceMode = getDataSourceMode();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const officialProfile = await getOfficialProfileById(officialId);
        if (!mounted) return;
        setProfile(officialProfile);
        setActiveTabId(officialProfile.tabs[0]?.id ?? "promises");
      } catch {
        if (!mounted) return;
        setError("Unable to load official profile right now. Please try again.");
        setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [officialId]);

  const tableRows = useMemo(() => {
    if (!profile) return [];
    return profile.rowsByTab[activeTabId] ?? [];
  }, [profile, activeTabId]);

  if (loading) {
    return (
      <PublicShell title="Official Profile" subtitle="Loading profile data...">
        <Section surface="default" padding="4">
          <Stack gap="3">
            <Skeleton height="22px" width="38%" />
            <Skeleton height="16px" />
            <Skeleton height="16px" />
            <Skeleton height="16px" />
          </Stack>
        </Section>
      </PublicShell>
    );
  }

  if (error || !profile) {
    return (
      <PublicShell title="Official Profile" subtitle="Evidence-backed performance overview">
        <Section surface="default" padding="4">
          <p role="alert" style={{ margin: 0, color: "var(--accent-danger)", fontSize: "var(--text-sm)" }}>
            {error ?? "Unable to load official profile."}
          </p>
        </Section>
      </PublicShell>
    );
  }

  return (
    <OfficialProfileTemplate
      profile={{
        name: profile.name,
        office: profile.office,
        countryCode: profile.countryCode,
        jurisdiction: profile.jurisdiction,
        score: profile.score,
        keptCount: profile.keptCount,
        inProgressCount: profile.inProgressCount,
        brokenCount: profile.brokenCount
      }}
      tabs={profile.tabs}
      activeTabId={activeTabId}
      onTabChange={(tabId) => setActiveTabId(tabId as OfficialProfileTabId)}
      tableTitle="Performance Records"
      tableColumns={[
        { key: "item", label: "Record" },
        { key: "status", label: "Status" },
        { key: "updatedAt", label: "Updated" }
      ]}
      tableRows={tableRows}
      aside={
        <Card title="Context" subtitle="Current mandate snapshot">
          <Stack gap="2">
            <Cluster gap="2">
              <Text size="sm" muted>Source</Text>
              <Badge
                variant={dataSourceMode === "live" ? "success" : "warning"}
                title={
                  dataSourceMode === "live"
                    ? "Live data from the configured backend."
                    : "Fallback data is shown because live backend data is unavailable right now."
                }
                aria-label={
                  dataSourceMode === "live"
                    ? "Live data from the configured backend"
                    : "Fallback data shown because live backend data is unavailable"
                }
              >
                {dataSourceMode === "live" ? "Live data" : "Fallback data"}
              </Badge>
            </Cluster>
            <Text size="sm" muted>
              This panel is reserved for related links, trend alerts, and benchmark context.
            </Text>
            <Text size="sm">Last evidence sync: {profile.lastEvidenceSync}</Text>
          </Stack>
        </Card>
      }
    />
  );
}
