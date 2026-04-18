import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { LabeledField } from "./labeled-field";

const meta = {
  title: "Molecules/LabeledField",
  component: LabeledField,
  tags: ["autodocs"],
  args: {
    id: "name",
    label: "Official Name",
    hint: "Use full legal name.",
    children: null
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <LabeledField {...args}>
        <Input id={args.id} placeholder="Enter name" />
      </LabeledField>
    </div>
  )
} satisfies Meta<typeof LabeledField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: "Name is required."
  }
};
