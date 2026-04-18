import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FilterPanel } from "./filter-panel";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "kept", label: "Kept" },
  { value: "in_progress", label: "In Progress" },
  { value: "broken", label: "Broken" }
] as const;

const categoryOptions = [
  { value: "", label: "All categories" },
  { value: "housing", label: "Housing" },
  { value: "transit", label: "Transit" },
  { value: "education", label: "Education" }
] as const;

const meta = {
  title: "Organisms/FilterPanel",
  component: FilterPanel,
  tags: ["autodocs"],
  args: {
    query: "",
    status: "",
    category: "",
    statusOptions,
    categoryOptions,
    onQueryChange: () => undefined,
    onStatusChange: () => undefined,
    onCategoryChange: () => undefined,
    onApply: () => undefined,
    onReset: () => undefined
  },
  render: (args) => {
    const [query, setQuery] = useState(args.query);
    const [status, setStatus] = useState(args.status);
    const [category, setCategory] = useState(args.category);

    return (
      <div style={{ width: "420px" }}>
        <FilterPanel
          {...args}
          query={query}
          status={status}
          category={category}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
        />
      </div>
    );
  }
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
