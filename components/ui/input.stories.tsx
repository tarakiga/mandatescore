import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Search official, office, country..."
  }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Disabled input"
  }
};
