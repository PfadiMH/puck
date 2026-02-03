import type { Meta, StoryObj } from "@storybook/react";
import { richTextConfig } from "./RichText";

const RichTextComponent = richTextConfig.render;

const meta: Meta<typeof RichTextComponent> = {
  component: RichTextComponent,
  title: "Puck/RichText",
  decorators: [
    (Story) => (
      <div className="sun-theme bg-ground p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RichTextComponent>;

const defaultPuckProps = {
  id: "story-id",
  puck: {
    renderDropZone: () => null,
    isEditing: false,
    dragRef: null,
    metadata: {},
  },
};

export const Default: Story = {
  args: {
    ...defaultPuckProps,
    content:
      "<p>This is a <strong>rich text</strong> component with <em>formatting</em>.</p>",
  },
};

export const WithHeadings: Story = {
  args: {
    ...defaultPuckProps,
    content:
      "<h2>Main Heading</h2><p>Some introductory text here.</p><h3>Sub Heading</h3><p>More detailed content follows.</p>",
  },
};

export const WithLists: Story = {
  args: {
    ...defaultPuckProps,
    content:
      "<h3>Unordered List</h3><ul><li>First item</li><li>Second item</li></ul><h3>Ordered List</h3><ol><li>Step one</li><li>Step two</li></ol>",
  },
};

export const WithLinks: Story = {
  args: {
    ...defaultPuckProps,
    content:
      '<p>Check out <a href="https://example.com">this link</a> for more information.</p>',
  },
};

export const WithBlockquote: Story = {
  args: {
    ...defaultPuckProps,
    content:
      "<p>Here is an important quote:</p><blockquote><p>The best way to predict the future is to create it.</p></blockquote>",
  },
};

export const MudTheme: Story = {
  decorators: [
    (Story) => (
      <div className="mud-theme bg-ground p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    ...defaultPuckProps,
    content:
      "<h2>Mud Theme Example</h2><p>This demonstrates the <strong>rich text</strong> component in the mud theme.</p>",
  },
};
