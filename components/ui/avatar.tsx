import type { CSSProperties } from "react";
import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  readonly name: string;
  readonly src?: string;
  readonly size?: AvatarSize;
};

const sizeStyles: Record<AvatarSize, CSSProperties> = {
  sm: { width: "28px", height: "28px", fontSize: "var(--text-xs)" },
  md: { width: "40px", height: "40px", fontSize: "var(--text-sm)" },
  lg: { width: "56px", height: "56px", fontSize: "var(--text-md)" }
};

const sizePx: Record<AvatarSize, number> = {
  sm: 28,
  md: 40,
  lg: 56
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const fallback = initials(name);

  return (
    <div
      aria-label={name}
      style={{
        ...sizeStyles[size],
        borderRadius: "999px",
        background: "var(--bg-surface-elevated)",
        border: "1px solid var(--border-subtle)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontWeight: 700,
        overflow: "hidden"
      }}
    >
      {src ? (
        <Image
          alt={name}
          src={src}
          width={sizePx[size]}
          height={sizePx[size]}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        fallback
      )}
    </div>
  );
}
