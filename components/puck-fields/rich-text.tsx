import { RichTextEditor } from "@components/misc/RichTextEditor";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@measured/puck";
import { JSONContent } from "@tiptap/react";

type RichTextProps = JSONContent;

function RichText({ value, onChange }: CustomFieldRenderProps<RichTextProps>) {
  return <RichTextEditor content={value} onUpdate={onChange} />;
}

export const richTextField: CustomField<RichTextProps> = {
  type: "custom",
  label: "Content",
  render: RichText,
};

export const defaultRichTextValue: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Mir sind Voll Däbii!",
        },
      ],
    },
  ],
};
