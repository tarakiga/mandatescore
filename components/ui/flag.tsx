type FlagProps = {
  readonly countryCode?: string;
  readonly countryName?: string;
};

export function Flag({ countryCode, countryName }: FlagProps) {
  const normalizedCode = (countryCode ?? "").trim().toUpperCase();
  const emoji = toFlagEmoji(normalizedCode) ?? "🌐";
  const label = countryName || normalizedCode || "Unknown country";

  return (
    <span
      aria-label={label}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "1.6rem",
        height: "1.2rem",
        borderRadius: "999px",
        border: "none",
        background: "transparent",
        fontSize: "0.85rem",
        lineHeight: 1
      }}
    >
      {emoji}
    </span>
  );
}

function toFlagEmoji(countryCode: string): string | null {
  if (!/^[A-Z]{2}$/.test(countryCode)) return null;
  const base = 127397;
  return String.fromCodePoint(...countryCode.split("").map((char) => base + char.charCodeAt(0)));
}
