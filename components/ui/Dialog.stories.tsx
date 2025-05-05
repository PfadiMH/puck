import type { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import Button from "./Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

type DialogPropsAndArgs = ComponentProps<typeof Dialog> & {
  title: string;
  description: string;
};

const meta: Meta<DialogPropsAndArgs> = {
  component: Dialog,
  title: "Components/Dialog",
  render: ({ title, ...args }) => (
    <DialogRoot defaultOpen={true}>
      <DialogTrigger>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <Dialog {...args}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{args.description}</DialogDescription>
        <DialogActions>
          <DialogClose>
            <Button color="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button color="primary">Confirm</Button>
          </DialogClose>
        </DialogActions>
      </Dialog>
    </DialogRoot>
  ),
};

export default meta;

type Story = StoryObj<DialogPropsAndArgs>;

export const Primary: Story = {
  args: {
    title: "Dialog Title",
    description: "Dialog description goes here.",
  },
};
