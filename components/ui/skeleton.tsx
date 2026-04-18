import type { CSSProperties } from "react";

type SkeletonProps = {
  readonly width?: string;
  readonly height?: string;
  readonly style?: CSSProperties;
};

export function Skeleton({ width = "100%", height = "16px", style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: "var(--radius-sm)",
        background:
          "linear-gradient(90deg, var(--bg-surface-elevated) 0%, rgb(34 49 78 / 90%) 50%, var(--bg-surface-elevated) 100%)",
        backgroundSize: "200% 100%",
        animation: "ms-skeleton 1.4s ease-in-out infinite",
        ...style
      }}
    />
  );
}
