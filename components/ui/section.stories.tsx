import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Section } from "./section";
import { Text } from "./text";

const meta = {
  title: "Layout/Section",
  component: Section,
  tags: ["autodocs"],
  args: {
    title: "Evidence Summary",
    subtitle: "Reusable section container with tokenized spacing and surface defaults.",
    actions: <Button variant="secondary">Export</Button>,
    children: (
      <Text size="sm" muted>
        Section body content composes with templates and route-level pages.
      </Text>
    )
  }
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoSurface: Story = {
  args: {
    surface: "none",
    padding: "0",
    actions: undefined
  }
};
