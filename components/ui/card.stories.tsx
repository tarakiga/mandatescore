import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./card";
import { Text } from "./text";

const meta = {
  title: "Atoms/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    title: "Official Score Card",
    subtitle: "Reusable surface",
    children: <Text muted>Evidence-backed score breakdown.</Text>
  },
  decorators: [
    (Story) => (
      <div style={{ width: "480px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
