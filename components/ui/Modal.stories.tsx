import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./Modal";

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: "Components/Modal",
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
  args: {
    title: "Modal Title",
    isOpen: true,
    children: (
      <>
        <p>This is a modal</p>
      </>
    ),
  },
};
