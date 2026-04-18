import type { CSSProperties, ElementType, ReactNode } from "react";

type SpaceToken = "1" | "2" | "3" | "4" | "6" | "8";

type ClusterProps = {
  readonly as?: ElementType;
  readonly children: ReactNode;
  readonly gap?: SpaceToken;
  readonly align?: CSSProperties["alignItems"];
  readonly justify?: CSSProperties["justifyContent"];
  readonly wrap?: CSSProperties["flexWrap"];
  readonly style?: CSSProperties;
};

export function Cluster({
  as: Tag = "div",
  children,
  gap = "2",
  align = "center",
  justify,
  wrap = "wrap",
  style
}: ClusterProps) {
  return (
    <Tag
      style={{
        display: "flex",
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        gap: `var(--space-${gap})`,
        ...style
      }}
    >
      {children}
    </Tag>
  );
}
