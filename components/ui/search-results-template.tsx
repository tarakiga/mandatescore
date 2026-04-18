import type { ReactNode } from "react";
import { FilterPanel } from "./filter-panel";
import { PublicShell } from "./public-shell";
import { Split } from "./split";

type FilterOption = {
  readonly value: string;
  readonly label: string;
};

type SearchResultsTemplateProps = {
  readonly title: string;
  readonly subtitle?: string;
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
  readonly children: ReactNode;
};

export function SearchResultsTemplate({
  title,
  subtitle,
  query,
  status,
  category,
  statusOptions,
  categoryOptions,
  onQueryChange,
  onStatusChange,
  onCategoryChange,
  onApply,
  onReset,
  children
}: SearchResultsTemplateProps) {
  return (
    <PublicShell title={title} subtitle={subtitle}>
      <Split preset="sidebar-left" gap="6">
        <aside aria-label="Search filters">
          <FilterPanel
            query={query}
            status={status}
            category={category}
            statusOptions={statusOptions}
            categoryOptions={categoryOptions}
            onQueryChange={onQueryChange}
            onStatusChange={onStatusChange}
            onCategoryChange={onCategoryChange}
            onApply={onApply}
            onReset={onReset}
          />
        </aside>
        <section aria-live="polite" aria-atomic="true">
          {children}
        </section>
      </Split>
    </PublicShell>
  );
}
