"use client";

import { useCallback, useState } from "react";
import { searchOfficials, searchOfficialsSync, SEARCH_CATEGORY_OPTIONS, SEARCH_STATUS_OPTIONS } from "@/lib/api/officials";
import type { OfficialSearchFilters, OfficialSearchResult } from "@/lib/domain/officials";
import { DataTable, Pagination, SearchResultsTemplate, Section, Skeleton, Stack } from "@/components/ui";

const PAGE_SIZE = 2;
const DEFAULT_FILTERS: OfficialSearchFilters = { query: "", status: "all", category: "all" };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OfficialSearchFilters["status"]>("all");
  const [category, setCategory] = useState<OfficialSearchFilters["category"]>("all");
  const [appliedFilters, setAppliedFilters] = useState<OfficialSearchFilters>(DEFAULT_FILTERS);
  const [results, setResults] = useState<readonly OfficialSearchResult[]>(() => searchOfficialsSync(DEFAULT_FILTERS));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const runSearch = useCallback(async (nextFilters: OfficialSearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const searchData = await searchOfficials(nextFilters);
      setResults(searchData);
      setAppliedFilters(nextFilters);
    } catch {
      setError("Unable to load search results right now. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <SearchResultsTemplate
      title="Official Search"
      subtitle="Find officials and monitor promise outcomes."
      query={query}
      status={status}
      category={category}
      statusOptions={SEARCH_STATUS_OPTIONS}
      categoryOptions={SEARCH_CATEGORY_OPTIONS}
      onQueryChange={setQuery}
      onStatusChange={(nextValue) => setStatus(nextValue as OfficialSearchFilters["status"])}
      onCategoryChange={(nextValue) => setCategory(nextValue as OfficialSearchFilters["category"])}
      onApply={() => {
        setPage(1);
        void runSearch({ query, status, category });
      }}
      onReset={() => {
        const resetFilters: OfficialSearchFilters = DEFAULT_FILTERS;
        setQuery("");
        setStatus("all");
        setCategory("all");
        setPage(1);
        void runSearch(resetFilters);
      }}
    >
      <Stack gap="3">
        <p aria-live="polite" style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
          {loading
            ? "Loading results..."
            : `Showing ${paginatedRows.length} of ${results.length} result${results.length === 1 ? "" : "s"}.`}
        </p>
        {error ? (
          <Section surface="default" padding="4">
            <p role="alert" style={{ margin: 0, color: "var(--accent-danger)", fontSize: "var(--text-sm)" }}>
              {error}
            </p>
          </Section>
        ) : null}
        {loading ? (
          <Section surface="default" padding="4">
            <Stack gap="3">
              <Skeleton height="18px" width="42%" />
              <Skeleton height="16px" />
              <Skeleton height="16px" />
              <Skeleton height="16px" />
            </Stack>
          </Section>
        ) : (
          <>
            <DataTable
              title="Search Results"
              description={`List of officials matching current filters: query "${appliedFilters.query || "none"}", status "${appliedFilters.status}", category "${appliedFilters.category}".`}
              columns={[
                { key: "name", label: "Name" },
                { key: "office", label: "Office" },
                { key: "status", label: "Status" },
                { key: "category", label: "Category" },
                { key: "score", label: "Score" }
              ]}
              rows={paginatedRows.map((result) => ({
                id: result.id,
                cells: {
                  name: result.name,
                  office: result.office,
                  status: result.status.replaceAll("_", " "),
                  category: result.category.replaceAll("-", " "),
                  score: `${result.score}`
                }
              }))}
            />
            <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Stack>
    </SearchResultsTemplate>
  );
}
