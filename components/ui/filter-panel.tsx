import { Button } from "./button";
import { Heading } from "./heading";
import { Input } from "./input";
import { LabeledField } from "./labeled-field";
import { Section } from "./section";
import { Select } from "./select";
import { Stack } from "./stack";

type FilterOption = {
  readonly value: string;
  readonly label: string;
};

type FilterPanelProps = {
  readonly query: string;
  readonly status: string;
  readonly category: string;
  readonly statusOptions: readonly FilterOption[];
  readonly categoryOptions: readonly FilterOption[];
  readonly onQueryChange: (nextValue: string) => void;
  readonly onStatusChange: (nextValue: string) => void;
  readonly onCategoryChange: (nextValue: string) => void;
  readonly onApply: () => void;
  readonly onReset: () => void;
};

export function FilterPanel({
  query,
  status,
  category,
  statusOptions,
  categoryOptions,
  onQueryChange,
  onStatusChange,
  onCategoryChange,
  onApply,
  onReset
}: FilterPanelProps) {
  return (
    <form
      aria-labelledby="filter-panel-heading"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
      style={{ margin: 0 }}
    >
      <Section surface="default" padding="4" radius="lg">
        <Stack gap="4">
          <div id="filter-panel-heading">
            <Heading as={2} size="lg" style={{ fontSize: "var(--text-md)" }}>
              Refine Results
            </Heading>
          </div>

          <LabeledField id="filter-query" label="Search">
            <Input
              id="filter-query"
              value={query}
              placeholder="Search official or promise"
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </LabeledField>

          <LabeledField id="filter-status" label="Status">
            <Select id="filter-status" value={status} options={statusOptions} onChange={onStatusChange} />
          </LabeledField>

          <LabeledField id="filter-category" label="Category">
            <Select id="filter-category" value={category} options={categoryOptions} onChange={onCategoryChange} />
          </LabeledField>

          <Stack direction="row" gap="2" align="center">
            <Button type="submit">Apply</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onReset}
              aria-label="Reset all search filters to default values"
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Section>
    </form>
  );
}
