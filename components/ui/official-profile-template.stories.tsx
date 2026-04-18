import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Text } from "./text";
import { OfficialProfileTemplate } from "./official-profile-template";

const tabs = [
  { id: "promises", label: "Promises" },
  { id: "evidence", label: "Evidence" },
  { id: "scores", label: "Scores" }
] as const;

const columns = [
  { key: "promise", label: "Promise" },
  { key: "status", label: "Status" },
  { key: "score", label: "Score" }
] as const;

const rows = [
  {
    id: "1",
    cells: { promise: "Expand affordable housing", status: "In Progress", score: "0.5" }
  },
  {
    id: "2",
    cells: { promise: "Bus lane enforcement", status: "Kept", score: "1.0" }
  }
];

const meta = {
  title: "Templates/OfficialProfileTemplate",
  component: OfficialProfileTemplate,
  tags: ["autodocs"],
  args: {
    profile: {
      name: "Zohran Mamdani",
      office: "Mayor",
      jurisdiction: "New York City, US",
      score: 63,
      keptCount: 18,
      inProgressCount: 10,
      brokenCount: 5
    },
    tabs,
    activeTabId: "promises",
    onTabChange: () => undefined,
    tableTitle: "Promise Status Table",
    tableColumns: columns,
    tableRows: rows,
    aside: <Text muted>Timeline and source summary slot.</Text>
  },
  render: (args) => {
    const [activeTabId, setActiveTabId] = useState(args.activeTabId);
    return <OfficialProfileTemplate {...args} activeTabId={activeTabId} onTabChange={setActiveTabId} />;
  }
} satisfies Meta<typeof OfficialProfileTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
