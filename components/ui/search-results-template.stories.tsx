import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { DataTable } from "./data-table";
import { SearchResultsTemplate } from "./search-results-template";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "kept", label: "Kept" },
  { value: "in_progress", label: "In Progress" },
  { value: "broken", label: "Broken" }
] as const;

const categoryOptions = [
  { value: "", label: "All categories" },
  { value: "housing", label: "Housing" },
  { value: "transit", label: "Transit" }
] as const;

const columns = [
  { key: "official", label: "Official" },
  { key: "office", label: "Office" },
  { key: "score", label: "Score" }
] as const;

const rows = [
  { id: "1", cells: { official: "Zohran Mamdani", office: "Mayor", score: "63" } },
  { id: "2", cells: { official: "Jane Doe", office: "Governor", score: "71" } }
];

const meta = {
  title: "Templates/SearchResultsTemplate",
  component: SearchResultsTemplate,
  tags: ["autodocs"],
  args: {
    title: "Search Results",
    subtitle: "Find officials and compare accountability signals.",
    query: "",
    status: "",
    category: "",
    statusOptions,
    categoryOptions,
    onQueryChange: () => undefined,
    onStatusChange: () => undefined,
    onCategoryChange: () => undefined,
    onApply: () => undefined,
    onReset: () => undefined,
    children: <DataTable title="Results" columns={columns} rows={rows} />
  },
  render: (args) => {
    const [query, setQuery] = useState(args.query);
    const [status, setStatus] = useState(args.status);
    const [category, setCategory] = useState(args.category);

    return (
      <SearchResultsTemplate
        {...args}
        query={query}
        status={status}
        category={category}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
      />
    );
  }
} satisfies Meta<typeof SearchResultsTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
