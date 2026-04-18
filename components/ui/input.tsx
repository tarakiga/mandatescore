import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ style, ...props }: InputProps) {
  return (
    <input
      style={{
        width: "100%",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-surface-elevated)",
        color: "var(--text-primary)",
        padding: "var(--space-2) var(--space-3)",
        fontSize: "var(--text-sm)",
        transition: "border-color var(--duration-fast) var(--ease-standard)",
        ...style
      }}
      {...props}
    />
  );
}
