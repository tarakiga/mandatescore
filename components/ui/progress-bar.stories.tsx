import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  args: {
    label: "Promise Fulfillment Score",
    value: 63
  },
  decorators: [
    (Story) => (
      <div style={{ width: "360px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: {
    value: 100
  }
};
