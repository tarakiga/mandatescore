import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { PublicShell } from "./public-shell";
import { Text } from "./text";

const meta = {
  title: "Templates/PublicShell",
  component: PublicShell,
  tags: ["autodocs"],
  args: {
    title: "MandateScore",
    subtitle: "Public accountability platform",
    children: <Text muted>Template content area.</Text>,
    actions: <Button>Primary Action</Button>
  }
} satisfies Meta<typeof PublicShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
