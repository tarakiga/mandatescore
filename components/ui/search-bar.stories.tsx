import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SearchBar } from "./search-bar";

const meta = {
  title: "Molecules/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  args: {
    placeholder: "Search official, office, country...",
    value: "",
    onChange: () => undefined,
    onSearch: () => undefined
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "480px" }}>
        <SearchBar
          {...args}
          value={value}
          onChange={setValue}
          onSearch={() => undefined}
          onClear={() => setValue("")}
        />
      </div>
    );
  }
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
