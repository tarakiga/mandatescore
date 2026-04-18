import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Pagination } from "./pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    totalPages: 5,
    currentPage: 1,
    onPageChange: () => undefined
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  }
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
