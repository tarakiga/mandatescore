import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Select } from "./select";

const options = [
  { value: "kept", label: "Kept" },
  { value: "in_progress", label: "In Progress" },
  { value: "broken", label: "Broken" }
] as const;

const meta = {
  title: "Molecules/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    id: "status-select",
    placeholder: "Select status",
    options,
    onChange: () => undefined
  },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(args.value);
    return (
      <div style={{ width: "320px" }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "kept"
  }
};
