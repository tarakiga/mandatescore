import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./card";
import { Split } from "./split";
import { Text } from "./text";

const meta = {
  title: "Layout/Split",
  component: Split,
  tags: ["autodocs"],
  args: {
    preset: "cards",
    gap: "4",
    children: (
      <>
        <Card title="Card A">
          <Text size="sm" muted>
            Layout card block.
          </Text>
        </Card>
        <Card title="Card B">
          <Text size="sm" muted>
            Layout card block.
          </Text>
        </Card>
        <Card title="Card C">
          <Text size="sm" muted>
            Layout card block.
          </Text>
        </Card>
      </>
    )
  }
} satisfies Meta<typeof Split>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {};

export const SidebarLeft: Story = {
  args: {
    preset: "sidebar-left",
    children: (
      <>
        <Card title="Filters">
          <Text size="sm" muted>
            Narrow results.
          </Text>
        </Card>
        <Card title="Results">
          <Text size="sm" muted>
            Main content area.
          </Text>
        </Card>
      </>
    )
  }
};
