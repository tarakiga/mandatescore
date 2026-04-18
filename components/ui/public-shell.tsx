import type { ReactNode } from "react";
import Link from "next/link";
import { Cluster } from "./cluster";
import { Section } from "./section";
import { Stack } from "./stack";
import { Text } from "./text";

type PublicShellProps = {
  readonly title?: string;
  readonly subtitle?: string;
  readonly actions?: ReactNode;
  readonly hero?: ReactNode;
  readonly children: ReactNode;
};

export function PublicShell({ title, subtitle, actions, hero, children }: PublicShellProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          padding: "var(--space-4) 0"
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: "1100px", padding: "0 var(--space-4)" }}>
          <Cluster justify="space-between" align="center">
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "var(--text-primary)",
                fontWeight: "600",
                fontSize: "var(--text-lg)"
              }}
            >
              Mandate Score
            </Link>
            <Cluster gap="4">
              <Link
                href="/search"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                Browse Officials
              </Link>
              <Link
                href="#"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                Methodology
              </Link>
              <Link
                href="#"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                About
              </Link>
            </Cluster>
          </Cluster>
        </div>
      </header>

      <main style={{ flex: 1, margin: "0 auto", width: "100%", maxWidth: "1100px", padding: "var(--space-8) var(--space-4)" }}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Stack gap="6">
          {hero ? (
            hero
          ) : title ? (
            <header>
              <Section
                surface="default"
                padding="6"
                radius="xl"
                title={title}
                titleLevel={1}
                titleSize="2xl"
                subtitle={subtitle}
                actions={actions}
                style={{ borderRadius: "var(--radius-xl)" }}
              />
            </header>
          ) : null}
          <section id="main-content">{children}</section>
        </Stack>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          padding: "var(--space-8) 0 var(--space-12)",
          marginTop: "auto"
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: "1100px", padding: "0 var(--space-4)" }}>
          <Stack gap="4">
            <Text size="sm" muted>
              Mandate Score is an independent project tracking how elected officials deliver on their mandates.
            </Text>
            <Cluster gap="4">
              <Link
                href="#"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                About
              </Link>
              <Link
                href="#"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                Methodology
              </Link>
              <Link
                href="#"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                Data sources
              </Link>
              <Link
                href="#"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                Privacy
              </Link>
              <Link
                href="#"
                style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
              >
                Contact
              </Link>
            </Cluster>
          </Stack>
        </div>
      </footer>
    </div>
  );
}
