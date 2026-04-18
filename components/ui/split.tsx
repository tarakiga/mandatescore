import type { CSSProperties, ElementType, ReactNode } from "react";

type SpaceToken = "1" | "2" | "3" | "4" | "6" | "8" | "12";
type SplitPreset = "sidebar-left" | "sidebar-right" | "cards";

type SplitProps = {
  readonly as?: ElementType;
  readonly children: ReactNode;
  readonly preset?: SplitPreset;
  readonly gap?: SpaceToken;
  readonly minSidebar?: string;
  readonly maxSidebar?: string;
  readonly minCardWidth?: string;
  readonly style?: CSSProperties;
};

export function Split({
  as: Tag = "div",
  children,
  preset = "cards",
  gap = "4",
  minSidebar = "260px",
  maxSidebar = "320px",
  minCardWidth = "280px",
  style
}: SplitProps) {
  const gridTemplateColumns =
    preset === "sidebar-left"
      ? `minmax(${minSidebar}, ${maxSidebar}) minmax(0, 1fr)`
      : preset === "sidebar-right"
        ? `minmax(0, 1fr) minmax(${minSidebar}, ${maxSidebar})`
        : `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`;

  return (
    <Tag
      style={{
        display: "grid",
        gap: `var(--space-${gap})`,
        gridTemplateColumns,
        alignItems: "start",
        ...style
      }}
    >
      {children}
    </Tag>
  );
}
