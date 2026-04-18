import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./card";
import { Stack } from "./stack";
import { Text } from "./text";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  args: {
    gap: "4",
    children: (
      <>
        <Card title="First">
          <Text size="sm" muted>
            Primary content block.
          </Text>
        </Card>
        <Card title="Second">
          <Text size="sm" muted>
            Secondary content block.
          </Text>
        </Card>
      </>
    )
  }
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: {
    direction: "row",
    wrap: "wrap"
  }
};
