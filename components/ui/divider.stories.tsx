import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Divider } from "./divider";

const meta = {
  title: "Atoms/Divider",
  component: Divider,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "360px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
