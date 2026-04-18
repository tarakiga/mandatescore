import Link from "next/link";
import {
  getDataLastUpdatedLabel,
  getDataSourceMode,
  getImpactStats,
  getRecentPromiseUpdates,
  getTrendingFormulaSummary,
  getTrendingOfficials
} from "@/lib/api/officials";
import { AsyncSearchBar, Badge, Card, Cluster, Flag, getScoreTone, Heading, ProgressBar, PublicShell, Section, Split, Stack, Text } from "@/components/ui";

const FALLBACK_TRENDING = [
  { id: "zohran-mamdani", name: "Zohran Mamdani", office: "Mayor", countryCode: "US", score: 63, trendScore: 73, keptCount: 18, inProgressCount: 10, brokenCount: 5 },
  { id: "london-breed", name: "London Breed", office: "Mayor", countryCode: "US", score: 72, trendScore: 64, keptCount: 25, inProgressCount: 10, brokenCount: 4 },
  { id: "eric-adams", name: "Eric Adams", office: "Mayor", countryCode: "US", score: 41, trendScore: 52, keptCount: 12, inProgressCount: 5, brokenCount: 18 }
] as const;

const FALLBACK_UPDATES = [
  { officialName: "Zohran Mamdani", promise: "Freeze MTA fares", status: "Kept", updatedAtLabel: "2 days ago" },
  { officialName: "London Breed", promise: "Build 50,000 new housing units", status: "In Progress", updatedAtLabel: "5 days ago" },
  { officialName: "Eric Adams", promise: "Reduce agency budgets by 3%", status: "Broken", updatedAtLabel: "1 week ago" }
] as const;

const FALLBACK_STATS = {
  officialsTracked: 112,
  promisesMonitored: 1420,
  sourceDocumentsAnalyzed: 5300
} as const;

export default async function Home() {
  const [trendingResult, updatesResult, statsResult, lastUpdatedResult] = await Promise.all([
    getTrendingOfficials()
      .then((data) => ({ ok: true as const, data }))
      .catch(() => ({ ok: false as const, data: FALLBACK_TRENDING })),
    getRecentPromiseUpdates()
      .then((data) => ({ ok: true as const, data }))
      .catch(() => ({ ok: false as const, data: FALLBACK_UPDATES })),
    getImpactStats()
      .then((data) => ({ ok: true as const, data }))
      .catch(() => ({ ok: false as const, data: FALLBACK_STATS })),
    getDataLastUpdatedLabel()
      .then((data) => ({ ok: true as const, data }))
      .catch(() => ({ ok: false as const, data: "Updated recently" }))
  ]);

  const trendingOfficials = trendingResult.data;
  const recentUpdates = updatesResult.data;
  const impactStats = statsResult.data;
  const dataLastUpdatedLabel = lastUpdatedResult.data;
  const usedFallback = !trendingResult.ok || !updatesResult.ok || !statsResult.ok || !lastUpdatedResult.ok;
  const dataSourceMode = usedFallback ? "fallback" : getDataSourceMode();
  const trendingFormulaSummary = getTrendingFormulaSummary();

  const heroNode = (
    <Section surface="none" padding="0">
      <Split preset="sidebar-right" gap="8">
        <Stack gap="6" style={{ justifyContent: "center" }}>
          <Stack gap="3">
            <Heading as={1} size="2xl">
              See who is keeping their promises.
            </Heading>
            <Text size="lg" muted>
              Mandate Score is a worldwide scorecard that tracks how elected officials in any country are keeping their campaign promises, turning complex politics into clear, evidence-based ratings.
            </Text>
          </Stack>

          <AsyncSearchBar />

          <div>
            <Link href="/search" className="ui-button ui-button--secondary" style={{ textDecoration: "none" }}>
              Browse all officials
            </Link>
          </div>
        </Stack>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card title="Sample Profile" subtitle="Data Snapshot" tone={getScoreTone(68)}>
            <Stack gap="4">
              <Cluster gap="3">
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--border-subtle)" }} />
                <div>
                  <Text style={{ fontWeight: "500" }}>Jane Doe</Text>
                  <Text size="sm" muted>Mayor of Example City</Text>
                </div>
              </Cluster>
              
              <Stack gap="2">
                <ProgressBar value={68} label="Overall Mandate Score" />
              </Stack>
              
              <Cluster gap="2">
                <Badge variant="success">12 Kept</Badge>
                <Badge variant="warning">5 In Progress</Badge>
                <Badge variant="danger">3 Broken</Badge>
              </Cluster>
            </Stack>
          </Card>
        </div>
      </Split>
    </Section>
  );

  return (
    <PublicShell hero={heroNode}>
      <Stack gap="12" style={{ marginTop: "var(--space-8)" }}>
        <Section surface="none" padding="0" title="Trending officials" titleLevel={2} titleSize="xl">
          <Cluster gap="2" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-5)" }}>
            <Text size="sm" muted>{dataLastUpdatedLabel}</Text>
            <Badge
              variant="outline"
              title={trendingFormulaSummary}
              aria-label={trendingFormulaSummary}
            >
              How trending works
            </Badge>
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
          <Split preset="cards" gap="4">
            {trendingOfficials.map(official => (
              <Card key={official.id} tone={getScoreTone(official.score)}>
                <Stack gap="4">
                  <Cluster gap="3">
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--border-subtle)" }} />
                    <div>
                      <Cluster gap="2" align="center">
                        <Text style={{ fontWeight: "500" }}>{official.name}</Text>
                        <Flag countryCode={official.countryCode} />
                      </Cluster>
                      <Text size="sm" muted>{official.office}</Text>
                    </div>
                  </Cluster>
                  <ProgressBar value={official.score} label="Score" />
                  <Cluster gap="2">
                    <Text size="sm" muted>{official.keptCount} kept</Text>
                    <Text size="sm" muted>&bull;</Text>
                    <Text size="sm" muted>{official.inProgressCount} in progress</Text>
                  </Cluster>
                  <Text size="sm" muted>Trend score: {official.trendScore}</Text>
                  <Link href={`/officials/${official.id}`} className="ui-button ui-button--secondary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                    View Profile
                  </Link>
                </Stack>
              </Card>
            ))}
          </Split>
        </Section>

        <Section surface="default" padding="6" radius="lg" title="Recent promise updates" titleLevel={2} titleSize="xl">
          <Cluster gap="2" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-5)" }}>
            <Text size="sm" muted>{dataLastUpdatedLabel}</Text>
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
          <Stack gap="4">
            {recentUpdates.map((update, i) => (
              <div key={i} style={{ paddingBottom: "var(--space-4)", borderBottom: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
                <Cluster justify="space-between" align="flex-start">
                  <Stack gap="1">
                    <Text style={{ fontWeight: "500" }}>{update.promise}</Text>
                    <Text size="sm" muted>{update.officialName} &bull; Updated {update.updatedAtLabel}</Text>
                  </Stack>
                  <Badge
                    variant={
                      update.status === "Kept"
                        ? "success"
                        : update.status === "In Progress"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {update.status}
                  </Badge>
                </Cluster>
              </div>
            ))}
          </Stack>
        </Section>

        <Section surface="none" padding="0">
          <Cluster gap="2" style={{ marginBottom: "var(--space-5)" }}>
            <Text size="sm" muted>{dataLastUpdatedLabel}</Text>
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
          <Split preset="cards" gap="4">
            <Card>
              <Stack gap="2" style={{ textAlign: "center", padding: "var(--space-4)" }}>
                <Heading as={3} size="2xl">{impactStats.officialsTracked.toLocaleString()}</Heading>
                <Text size="sm" muted>Officials tracked</Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap="2" style={{ textAlign: "center", padding: "var(--space-4)" }}>
                <Heading as={3} size="2xl">{impactStats.promisesMonitored.toLocaleString()}</Heading>
                <Text size="sm" muted>Promises monitored</Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap="2" style={{ textAlign: "center", padding: "var(--space-4)" }}>
                <Heading as={3} size="2xl">{impactStats.sourceDocumentsAnalyzed.toLocaleString()}+</Heading>
                <Text size="sm" muted>Source documents analyzed</Text>
              </Stack>
            </Card>
          </Split>
          <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
            <Text muted>Built with reference to global promise-tracking research. <Link href="#" style={{ color: "var(--text-primary)", fontWeight: "500" }}>See our methodology &rarr;</Link></Text>
          </div>
        </Section>

        <Section surface="none" padding="0" title="How Mandate Score works" titleLevel={2} titleSize="xl" style={{ textAlign: "center" }}>
          <Split preset="cards" gap="4" style={{ textAlign: "left", marginTop: "var(--space-6)" }}>
            <Card title="1. Collect promises">
              <Text size="sm" muted>We extract and curate campaign promises from manifestos, official statements, and fact-checking sources.</Text>
            </Card>
            <Card title="2. Track progress">
              <Text size="sm" muted>We connect promises to laws, budgets, and real-world actions, updating statuses as new evidence appears.</Text>
            </Card>
            <Card title="3. Score and explain">
              <Text size="sm" muted>We compute a Mandate Score for each official and show you the sources behind every status.</Text>
            </Card>
          </Split>
          <Card
            title="Glossary"
            subtitle="Quick definitions for first-time users"
            style={{ marginTop: "var(--space-6)", textAlign: "left" }}
          >
            <Stack gap="3">
              <Cluster gap="2" align="flex-start">
                <Badge variant="success">Kept</Badge>
                <Text size="sm" muted>The promise has been fulfilled with clear supporting evidence.</Text>
              </Cluster>
              <Cluster gap="2" align="flex-start">
                <Badge variant="warning">In Progress</Badge>
                <Text size="sm" muted>Action has started, but the promise is not fully completed yet.</Text>
              </Cluster>
              <Cluster gap="2" align="flex-start">
                <Badge variant="danger">Broken</Badge>
                <Text size="sm" muted>The official has reversed course or did not deliver on the core commitment.</Text>
              </Cluster>
            </Stack>
          </Card>
        </Section>

        <Section surface="none" padding="0">
          <Split preset="cards" gap="4">
            <Card title="For Citizens">
              <Stack gap="3">
                <Text size="sm" muted>Learn how to read a Mandate Scorecard and hold your local leaders accountable.</Text>
                <Link href="#" style={{ color: "var(--text-primary)", fontWeight: "500" }}>How to read a scorecard &rarr;</Link>
              </Stack>
            </Card>
            <Card title="For Journalists & NGOs">
              <Stack gap="3">
                <Text size="sm" muted>Embed scorecards in your articles or request coverage for specific races.</Text>
                <Link href="#" style={{ color: "var(--text-primary)", fontWeight: "500" }}>View resources &rarr;</Link>
              </Stack>
            </Card>
            <Card title="For Developers">
              <Stack gap="3">
                <Text size="sm" muted>Access raw promise data and scoring via our upcoming public API.</Text>
                <Link href="#" style={{ color: "var(--text-primary)", fontWeight: "500" }}>API Documentation &rarr;</Link>
              </Stack>
            </Card>
          </Split>
        </Section>
      </Stack>
    </PublicShell>
  );
}
