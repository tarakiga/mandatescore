import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DataTable } from "./data-table";

const columns = [
  { key: "promise", label: "Promise" },
  { key: "status", label: "Status" },
  { key: "score", label: "Score" }
] as const;

const rows = [
  {
    id: "1",
    cells: { promise: "Expand affordable housing", status: "In Progress", score: "0.5" }
  },
  {
    id: "2",
    cells: { promise: "Bus lane enforcement", status: "Kept", score: "1.0" }
  }
];

const meta = {
  title: "Organisms/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  args: {
    title: "Promise Status Table",
    columns,
    rows
  }
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    rows: []
  }
};
