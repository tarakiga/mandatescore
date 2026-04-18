import type { ReactNode } from "react";
import { Text } from "./text";

type LabeledFieldProps = {
  readonly id: string;
  readonly label: string;
  readonly required?: boolean;
  readonly hint?: string;
  readonly error?: string;
  readonly children: ReactNode;
};

export function LabeledField({
  id,
  label,
  required = false,
  hint,
  error,
  children
}: LabeledFieldProps) {
  return (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <label htmlFor={id} style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
        {label}
        {required ? <span style={{ color: "var(--accent-danger)" }}> *</span> : null}
      </label>
      {children}
      {error ? (
        <Text size="xs" style={{ color: "var(--accent-danger)" }}>
          {error}
        </Text>
      ) : hint ? (
        <Text size="xs" muted>
          {hint}
        </Text>
      ) : null}
    </div>
  );
}
