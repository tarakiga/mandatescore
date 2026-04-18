import type { CSSProperties } from "react";

type PaginationProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (nextPage: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <nav aria-label="Pagination" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <button
        type="button"
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage <= 1}
        aria-label="Go to previous page"
        style={buttonStyle}
      >
        Prev
      </button>
      {pages.map((page) => {
        const active = page === safePage;
        return (
          <button
            key={page}
            type="button"
            aria-current={active ? "page" : undefined}
            aria-label={`Go to page ${page}`}
            onClick={() => onPageChange(page)}
            style={{
              ...buttonStyle,
              background: active ? "color-mix(in srgb, var(--accent-brand) 16%, transparent)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)"
            }}
          >
            {page}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage >= totalPages}
        aria-label="Go to next page"
        style={buttonStyle}
      >
        Next
      </button>
    </nav>
  );
}

const buttonStyle: CSSProperties = {
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)",
  padding: "var(--space-1) var(--space-2)",
  background: "transparent",
  color: "var(--text-primary)",
  cursor: "pointer",
  fontSize: "var(--text-xs)",
  minWidth: "34px",
  minHeight: "34px"
};
