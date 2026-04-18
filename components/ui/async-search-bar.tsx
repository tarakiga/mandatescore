"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Cluster } from "./cluster";
import { Flag } from "./flag";
import { Input } from "./input";
import { ProgressBar } from "./progress-bar";
import { getScoreTone } from "./score-visual";
import { Stack } from "./stack";
import { Text } from "./text";

type AsyncSearchResult = {
  readonly id: string;
  readonly name: string;
  readonly office: string;
  readonly countryCode?: string;
  readonly score: number;
  readonly status: string;
};

type SearchResultListItemProps = {
  readonly result: AsyncSearchResult;
  readonly index: number;
  readonly isActive: boolean;
};

type AsyncSearchBarProps = {
  readonly placeholder?: string;
};

export function AsyncSearchBar({ placeholder = "Search an official, office, or city..." }: AsyncSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<readonly AsyncSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      abortRef.current?.abort();
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const response = await fetch(`/api/officials/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Search request failed");
        const payload = (await response.json()) as AsyncSearchResult[];
        setResults(payload);
        setActiveIndex(payload.length > 0 ? 0 : -1);
      } catch {
        setResults([]);
        setActiveIndex(-1);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const hasNoResults = useMemo(
    () => query.trim().length >= 2 && !loading && results.length === 0,
    [query, loading, results.length]
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  }

  function onQueryChange(nextValue: string) {
    setQuery(nextValue);
    if (nextValue.trim().length < 2) {
      abortRef.current?.abort();
      setResults([]);
      setLoading(false);
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (event.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const selected = results[activeIndex];
      if (selected) {
        setOpen(false);
        router.push(`/officials/${selected.id}`);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "560px" }}>
      <form onSubmit={onSubmit} style={{ display: "flex", width: "100%", gap: "var(--space-2)" }}>
        <Input
          value={query}
          placeholder={placeholder}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onInputKeyDown}
          onFocus={() => {
            if (results.length > 0 || hasNoResults || loading) setOpen(true);
          }}
          aria-label="Search officials"
          role="combobox"
          aria-expanded={open}
          aria-controls="async-search-results-list"
          aria-activedescendant={activeIndex >= 0 ? `async-search-result-${activeIndex}` : undefined}
        />
        <Button type="submit">Search</Button>
      </form>

      {open ? (
        <section
          aria-label="Async search results"
          id="async-search-results-list"
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + var(--space-2))",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            padding: "var(--space-3)"
          }}
        >
          {loading ? (
            <Text size="sm" muted>
              Searching...
            </Text>
          ) : hasNoResults ? (
            <Text size="sm" muted>
              No matches found. Try a different name, office, or city.
            </Text>
          ) : (
            <Stack gap="2">
              {results.map((result, index) => (
                <SearchResultListItem
                  key={result.id}
                  result={result}
                  index={index}
                  isActive={index === activeIndex}
                />
              ))}
            </Stack>
          )}
        </section>
      ) : null}
    </div>
  );
}

function SearchResultListItem({ result, index, isActive }: SearchResultListItemProps) {
  return (
    <Link
      id={`async-search-result-${index}`}
      role="option"
      aria-selected={isActive}
      href={`/officials/${result.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        border: isActive ? "1px solid var(--accent-brand)" : "1px solid var(--border-subtle)",
        background:
          getScoreTone(result.score) === "success"
            ? "color-mix(in srgb, var(--accent-success) 8%, var(--bg-surface))"
            : getScoreTone(result.score) === "warning"
              ? "color-mix(in srgb, var(--accent-warning) 8%, var(--bg-surface))"
              : "color-mix(in srgb, var(--accent-danger) 8%, var(--bg-surface))",
        boxShadow: isActive ? "0 0 0 2px color-mix(in srgb, var(--accent-brand) 30%, transparent)" : "none"
      }}
    >
      <Stack gap="2">
        <Cluster justify="space-between" align="center">
          <Cluster gap="2" align="center">
            <Text style={{ fontWeight: "600" }}>{result.name}</Text>
            <Flag countryCode={result.countryCode} />
          </Cluster>
          <Badge
            variant={
              result.status.toLowerCase() === "kept"
                ? "success"
                : result.status.toLowerCase() === "in progress"
                  ? "warning"
                  : "danger"
            }
          >
            {result.status}
          </Badge>
        </Cluster>
        <Text size="sm" muted>
          {result.office}
        </Text>
        <ProgressBar value={result.score} label={`Score: ${result.score}`} />
      </Stack>
    </Link>
  );
}
