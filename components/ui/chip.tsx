import type { CSSProperties, ReactNode } from "react";

type ChipTone = "neutral" | "success" | "warning" | "danger";

type ChipProps = {
  readonly tone?: ChipTone;
  readonly children: ReactNode;
};

const toneStyles: Record<ChipTone, CSSProperties> = {
  neutral: { background: "var(--bg-surface-elevated)", color: "var(--text-primary)" },
  success: { background: "rgb(79 209 165 / 15%)", color: "var(--accent-success)" },
  warning: { background: "rgb(246 196 83 / 16%)", color: "var(--accent-warning)" },
  danger: { background: "rgb(242 109 109 / 16%)", color: "var(--accent-danger)" }
};

export function Chip({ tone = "neutral", children }: ChipProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        border: "1px solid var(--border-subtle)",
        padding: "var(--space-1) var(--space-2)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        ...toneStyles[tone]
      }}
    >
      {children}
    </span>
  );
}
