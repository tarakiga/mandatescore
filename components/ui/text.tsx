import type { CSSProperties, ReactNode } from "react";
import { uiTypography } from "./styles";

type TextSize = "xs" | "sm" | "md" | "lg";

type TextProps = {
  readonly size?: TextSize;
  readonly muted?: boolean;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
};

export function Text({ size = "md", muted = false, children, style }: TextProps) {
  return (
    <p
      style={{
        margin: 0,
        color: muted ? "var(--text-muted)" : "var(--text-primary)",
        ...uiTypography[size],
        ...style
      }}
    >
      {children}
    </p>
  );
}
