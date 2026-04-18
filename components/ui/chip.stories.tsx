import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip } from "./chip";

const meta = {
  title: "Atoms/Chip",
  component: Chip,
  tags: ["autodocs"]
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: {
    children: "In Review",
    tone: "neutral"
  }
};

export const Success: Story = {
  args: {
    children: "Kept",
    tone: "success"
  }
};

export const Warning: Story = {
  args: {
    children: "In Progress",
    tone: "warning"
  }
};

export const Danger: Story = {
  args: {
    children: "Broken",
    tone: "danger"
  }
};
