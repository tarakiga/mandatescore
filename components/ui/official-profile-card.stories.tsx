import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OfficialProfileCard } from "./official-profile-card";

const meta = {
  title: "Organisms/OfficialProfileCard",
  component: OfficialProfileCard,
  tags: ["autodocs"],
  args: {
    name: "Zohran Mamdani",
    office: "Mayor",
    jurisdiction: "New York City, US",
    score: 63,
    keptCount: 18,
    inProgressCount: 10,
    brokenCount: 5
  },
  decorators: [
    (Story) => (
      <div style={{ width: "560px" }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof OfficialProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
