import type { ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-button ui-button--${variant}${className ? ` ${className}` : ""}`}
      style={style as CSSProperties}
      {...props}
    >
      {children}
    </button>
  );
}
