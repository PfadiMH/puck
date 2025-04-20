import { CustomFieldRenderProps } from "@lib/custom-field-types";
import type { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "./minimal-tiptap";

export type RichTextData = Content;

export function RichTextEditor({
  id,
  value,
  onChange,
  readOnly,
}: CustomFieldRenderProps<Content>) {
  return (
    <MinimalTiptapEditor
      value={value}
      onChange={(content) => onChange(content)}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Enter your description..."
      autofocus={true}
      editable={!readOnly}
      editorClassName="focus:outline-hidden"
    />
  );
}
