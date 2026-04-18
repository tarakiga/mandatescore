import type { CSSProperties, ReactNode } from "react";
import { Heading } from "./heading";
import { Stack } from "./stack";
import { Text } from "./text";

type SpaceToken = "0" | "2" | "3" | "4" | "6";
type RadiusToken = "md" | "lg" | "xl";

type SectionProps = {
  readonly title?: string;
  readonly titleLevel?: 1 | 2 | 3 | 4;
  readonly titleSize?: "lg" | "xl" | "2xl";
  readonly subtitle?: string;
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly surface?: "none" | "default";
  readonly padding?: SpaceToken;
  readonly radius?: RadiusToken;
  readonly style?: CSSProperties;
  readonly id?: string;
  readonly ariaLabel?: string;
};

export function Section({
  title,
  titleLevel = 2,
  titleSize = "xl",
  subtitle,
  actions,
  children,
  surface = "default",
  padding = "4",
  radius = "lg",
  style,
  id,
  ariaLabel
}: SectionProps) {
  const hasHeader = title || subtitle || actions;

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      style={{
        background: surface === "default" ? "var(--bg-surface)" : "transparent",
        border: surface === "default" ? "1px solid var(--border-subtle)" : "none",
        borderRadius: surface === "default" ? `var(--radius-${radius})` : undefined,
        boxShadow: surface === "default" ? "var(--shadow-sm)" : "none",
        padding: padding === "0" ? 0 : `var(--space-${padding})`,
        ...style
      }}
    >
      {hasHeader ? (
        <Stack direction="row" justify="space-between" align="flex-start" gap="4" style={{ marginBottom: "var(--space-4)" }}>
          <Stack gap="2" style={{ maxWidth: "720px" }}>
            {title ? (
              <Heading as={titleLevel} size={titleSize}>
                {title}
              </Heading>
            ) : null}
            {subtitle ? (
              <Text size="sm" muted>
                {subtitle}
              </Text>
            ) : null}
          </Stack>
          {actions ? <div>{actions}</div> : null}
        </Stack>
      ) : null}
      {children ?? null}
    </section>
  );
}
