"use client";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";

type RichTextEditorProps = {
  content: JSONContent;
  onUpdate?: (content: JSONContent) => void;
  readonly?: boolean;
};

/**
 * A rich text editor component that uses the Tiptap editor.
 * To render the saved content, set `readonly` to `true`.
 */
export function RichTextEditor({
  content,
  readonly,
  onUpdate,
}: RichTextEditorProps) {
  const editable = !readonly;
  const editor = useEditor(
    {
      content,
      editable,
      extensions: [StarterKit],
      onUpdate: onUpdate
        ? ({ editor }) => onUpdate(editor.getJSON())
        : undefined,
      shouldRerenderOnTransaction: false,
      editorProps: {
        attributes: {
          class: clsx("font-poppins bg-background", editable && "mud-theme"),
        },
      },
      immediatelyRender: false,
    },
    [editable, !editable && content]
  );

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
