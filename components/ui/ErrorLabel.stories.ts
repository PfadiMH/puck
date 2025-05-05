import type { Meta, StoryObj } from "@storybook/react";
import ErrorLabel from "./ErrorLabel";

const meta: Meta<typeof ErrorLabel> = {
  component: ErrorLabel,
  title: "Components/ErrorLabel",
};

export default meta;

type Story = StoryObj<typeof ErrorLabel>;

export const Primary: Story = {
  args: {
    message: "This is an error message.",
  },
};
