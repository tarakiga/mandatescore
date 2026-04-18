import type { CSSProperties, ElementType, ReactNode } from "react";

type SpaceToken = "1" | "2" | "3" | "4" | "6" | "8" | "12";

type StackProps = {
  readonly as?: ElementType;
  readonly children: ReactNode;
  readonly gap?: SpaceToken;
  readonly align?: CSSProperties["alignItems"];
  readonly justify?: CSSProperties["justifyContent"];
  readonly direction?: CSSProperties["flexDirection"];
  readonly wrap?: CSSProperties["flexWrap"];
  readonly style?: CSSProperties;
};

export function Stack({
  as: Tag = "div",
  children,
  gap = "4",
  align,
  justify,
  direction = "column",
  wrap,
  style
}: StackProps) {
  return (
    <Tag
      style={{
        display: "flex",
        flexDirection: direction,
        gap: `var(--space-${gap})`,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        ...style
      }}
    >
      {children}
    </Tag>
  );
}
