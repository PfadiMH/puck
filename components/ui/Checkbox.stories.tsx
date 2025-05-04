import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: "Components/UI/Checkbox",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    label: "Receive newsletter",
    checked: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: "Cannot select this option",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "This option is mandatory",
    checked: true,
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: {
    checked: false,
  },
};

export const CustomStyling: Story = {
  args: {
    label: "Custom styled checkbox",
    checked: true,
    className: "w-5 h-5 border-accent checked:bg-accent",
    labelClassName: "text-accent font-semibold",
    containerClassName: "bg-accent/10 border border-accent rounded-lg p-4",
  },
};
