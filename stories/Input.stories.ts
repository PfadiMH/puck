import Input from "@components/ui/Input";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Input> = {
  component: Input,
  title: "Components/Input",
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  args: {
    disabled: false,
    placeholder: "Input",
    size: "medium",
    type: "text",
  },
};
