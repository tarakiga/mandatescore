type ProgressBarProps = {
  readonly value: number;
  readonly label: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, 100));

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "var(--space-2)",
          fontSize: "var(--text-sm)"
        }}
      >
        <span>{label}</span>
        <span style={{ color: "var(--text-muted)" }}>{clamped}%</span>
      </div>
      <div
        aria-hidden="true"
        style={{
          background: "var(--bg-surface-elevated)",
          borderRadius: "999px",
          height: "10px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            background: "var(--accent-brand)",
            width: `${clamped}%`,
            height: "100%",
            transition: "width var(--duration-normal) var(--ease-standard)"
          }}
        />
      </div>
    </div>
  );
}
