import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Cluster } from "./cluster";

const meta = {
  title: "Layout/Cluster",
  component: Cluster,
  tags: ["autodocs"],
  args: {
    gap: "2",
    children: (
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary">Tertiary Action</Button>
      </>
    )
  }
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RightAligned: Story = {
  args: {
    justify: "flex-end"
  }
};
