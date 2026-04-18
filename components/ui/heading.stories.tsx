import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading } from "./heading";

const meta = {
  title: "Atoms/Heading",
  component: Heading,
  tags: ["autodocs"],
  args: {
    children: "Promise Fulfillment"
  }
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H2: Story = {
  args: {
    as: 2,
    size: "xl"
  }
};

export const H3: Story = {
  args: {
    as: 3,
    size: "lg",
    children: "Official Status Breakdown"
  }
};
