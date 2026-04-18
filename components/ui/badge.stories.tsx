import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Mayor"
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Candidate"
  }
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Kept"
  }
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "In Progress"
  }
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Broken"
  }
};
