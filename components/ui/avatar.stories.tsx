import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./avatar";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    name: "Tar Akiga"
  }
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "sm"
  }
};

export const Medium: Story = {
  args: {
    size: "md"
  }
};

export const Large: Story = {
  args: {
    size: "lg"
  }
};
