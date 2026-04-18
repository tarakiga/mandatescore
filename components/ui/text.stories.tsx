import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from "./text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children: "Evidence-backed fulfillment signal."
  }
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    muted: true,
    size: "sm",
    children: "Source confidence: medium."
  }
};
