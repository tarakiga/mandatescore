import type { CSSProperties, ReactNode } from "react";
import type { ScoreTone } from "./score-visual";

type CardProps = {
  readonly title?: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
  readonly tone?: ScoreTone;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export function Card({ title, subtitle, children, tone = "neutral", className, style }: CardProps) {
  return (
    <section
      className={`ui-card ui-card--${tone}${className ? ` ${className}` : ""}`}
      style={{
        padding: "var(--space-6)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style
      }}
    >
      {title ? <h2 style={{ margin: 0, fontSize: "var(--text-xl)" }}>{title}</h2> : null}
      {subtitle ? (
        <p style={{ margin: "var(--space-2) 0 var(--space-4)", color: "var(--text-muted)" }}>{subtitle}</p>
      ) : null}
      <div style={{ flex: 1 }}>{children}</div>
    </section>
  );
}
