import { Heading } from "./heading";
import { Text } from "./text";

type DataTableColumn = {
  readonly key: string;
  readonly label: string;
};

type DataTableRow = {
  readonly id: string;
  readonly cells: Record<string, string>;
};

type DataTableProps = {
  readonly title: string;
  readonly columns: readonly DataTableColumn[];
  readonly rows: readonly DataTableRow[];
  readonly emptyLabel?: string;
  readonly description?: string;
};

export function DataTable({
  title,
  columns,
  rows,
  emptyLabel = "No records available.",
  description
}: DataTableProps) {
  const tableDescriptionId = `${title.toLowerCase().replace(/\s+/g, "-")}-description`;

  return (
    <section
      aria-labelledby={tableDescriptionId}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <div style={{ padding: "var(--space-4)", display: "grid", gap: "var(--space-2)" }}>
        <Heading as={3} size="lg">
          {title}
        </Heading>
        {description ? (
          <p id={tableDescriptionId} style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
            {description}
          </p>
        ) : (
          <p id={tableDescriptionId} style={visuallyHiddenStyle}>
            {title}
          </p>
        )}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{
                  textAlign: "left",
                  borderTop: "1px solid var(--border-subtle)",
                  borderBottom: "1px solid var(--border-subtle)",
                  padding: "var(--space-2) var(--space-4)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-muted)"
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td
                    key={`${row.id}:${column.key}`}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      padding: "var(--space-3) var(--space-4)",
                      fontSize: "var(--text-sm)"
                    }}
                  >
                    {row.cells[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: "var(--space-4)" }}>
                <Text size="sm" muted>
                  {emptyLabel}
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

const visuallyHiddenStyle = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute" as const,
  whiteSpace: "nowrap" as const,
  width: "1px"
};
