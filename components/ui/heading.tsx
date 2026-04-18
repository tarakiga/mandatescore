import type { CSSProperties, ReactNode } from "react";
import { uiTypography } from "./styles";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingSize = "lg" | "xl" | "2xl";

type HeadingProps = {
  readonly as?: HeadingLevel;
  readonly size?: HeadingSize;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
};

export function Heading({ as = 2, size = "xl", children, style }: HeadingProps) {
  const Tag = `h${as}` as const;

  return (
    <Tag
      style={{
        margin: 0,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        ...uiTypography[size],
        ...style
      }}
    >
      {children}
    </Tag>
  );
}
