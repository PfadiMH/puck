import type { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import Button from "./Button";
import Toaster, { toast } from "./Toast";

type ToastPropsAndArgs = ComponentProps<typeof Toaster> & {
  title: string;
  description: string;
  actionText?: string;
};

const meta: Meta<ToastPropsAndArgs> = {
  component: Toaster,
  title: "Components/Toast",
  render: ({ title, description, actionText, ...args }) => {
    const showToast = () => {
      toast(title, {
        description,
        action: {
          label: actionText,
          onClick: () => {},
        },
        duration: 10000000000,
      });
    };
    return (
      <>
        <Button onClick={showToast}>Show Toast</Button>
        <Toaster />
      </>
    );
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    actionText: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<ToastPropsAndArgs>;

export const Primary: Story = {
  args: {
    title: "Toast Title",
    description: "Toast description goes here.",
    actionText: "Undo",
  },
};
