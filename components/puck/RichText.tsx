import { RichTextEditor } from "@components/misc/RichTextEditor";
import {
  defaultRichTextValue,
  richTextField,
} from "@components/puck-fields/rich-text";
import { ComponentConfig, WithPuckProps } from "@measured/puck";
import { JSONContent } from "@tiptap/react";

export type RichTextProps = {
  content: JSONContent;
};

function RichText({ content }: WithPuckProps<RichTextProps>) {
  return <RichTextEditor readonly content={content} />;
}

export const richTextConfig: ComponentConfig<RichTextProps> = {
  render: RichText,
  label: "Rich Text",
  fields: {
    content: richTextField,
  },
  defaultProps: {
    content: defaultRichTextValue,
  },
};
