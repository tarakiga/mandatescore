import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Tabs } from "./tabs";

const tabs = [
  { id: "promises", label: "Promises" },
  { id: "evidence", label: "Evidence" },
  { id: "scores", label: "Scores" }
] as const;

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    tabs,
    activeTabId: "promises",
    onTabChange: () => undefined
  },
  render: (args) => {
    const [activeTabId, setActiveTabId] = useState("promises");
    return <Tabs {...args} activeTabId={activeTabId} onTabChange={setActiveTabId} />;
  }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
