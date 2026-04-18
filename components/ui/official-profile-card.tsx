import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Card } from "./card";
import { Chip } from "./chip";
import { Flag } from "./flag";
import { Heading } from "./heading";
import { ProgressBar } from "./progress-bar";
import { getScoreTone } from "./score-visual";
import { Text } from "./text";

type OfficialProfileCardProps = {
  readonly name: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly jurisdiction: string;
  readonly score: number;
  readonly keptCount: number;
  readonly inProgressCount: number;
  readonly brokenCount: number;
  readonly avatarUrl?: string;
};

export function OfficialProfileCard({
  name,
  office,
  countryCode,
  jurisdiction,
  score,
  keptCount,
  inProgressCount,
  brokenCount,
  avatarUrl
}: OfficialProfileCardProps) {
  const scoreTone = getScoreTone(score);

  return (
    <Card tone={scoreTone}>
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Avatar name={name} src={avatarUrl} size="lg" />
        <div style={{ display: "grid", gap: "var(--space-1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Heading as={3} size="lg">
              {name}
            </Heading>
            <Flag countryCode={countryCode} />
          </div>
          <Text size="sm" muted>
            {jurisdiction}
          </Text>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge>{office}</Badge>
        </div>
      </div>

      <ProgressBar value={score} label="Fulfillment Score" />

      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        <Chip tone="success">Kept: {keptCount}</Chip>
        <Chip tone="warning">In Progress: {inProgressCount}</Chip>
        <Chip tone="danger">Broken: {brokenCount}</Chip>
      </div>
      </div>
    </Card>
  );
}
