import type { CSSProperties } from "react";

export const uiTypography: Record<string, CSSProperties> = {
  xs: { fontSize: "var(--text-xs)", lineHeight: 1.5 },
  sm: { fontSize: "var(--text-sm)", lineHeight: 1.5 },
  md: { fontSize: "var(--text-md)", lineHeight: 1.55 },
  lg: { fontSize: "var(--text-lg)", lineHeight: 1.45 },
  xl: { fontSize: "var(--text-xl)", lineHeight: 1.35 },
  "2xl": { fontSize: "var(--text-2xl)", lineHeight: 1.3 }
};
