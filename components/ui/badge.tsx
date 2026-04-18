import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "default" | "outline" | "success" | "warning" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  readonly variant?: BadgeVariant;
  readonly children: ReactNode;
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge--${variant}${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </span>
  );
}
