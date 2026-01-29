import { richTextEditorField } from "@components/puck-fields/rich-text-editor";
import { ComponentConfig } from "@measured/puck";
import DOMPurify from "isomorphic-dompurify";

export type RichTextProps = {
  content: string;
};

const richTextStyles = `
  .rich-text h2, .rich-text h3, .rich-text h4 {
    font-family: var(--rockingsoda);
  }
  .rich-text h2 { font-size: 2.25rem; margin-top: 1.5rem; margin-bottom: 1rem; }
  .rich-text h3 { font-size: 1.875rem; margin-top: 1.25rem; margin-bottom: 0.75rem; }
  .rich-text h4 { font-size: 1.5rem; margin-top: 1rem; margin-bottom: 0.5rem; }
  .rich-text p { margin-bottom: 1rem; }
  .rich-text strong { font-weight: 700; }
  .rich-text em { font-style: italic; }
  .rich-text a { color: var(--color-primary); text-decoration: underline; }
  .rich-text ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; padding-left: 0.5rem; }
  .rich-text ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; padding-left: 0.5rem; }
  .rich-text li { margin-bottom: 0.25rem; }
  .rich-text blockquote { border-left: 4px solid var(--color-primary); padding-left: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; margin: 1rem 0; font-style: italic; }
`;

function RichText({ content }: RichTextProps) {
  const sanitizedContent = content
    ? DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "u",
          "s",
          "a",
          "h2",
          "h3",
          "h4",
          "ul",
          "ol",
          "li",
          "blockquote",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class"],
        ALLOWED_URI_REGEXP:
          /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      })
    : "";

  return (
    <>
      <style>{richTextStyles}</style>
      <div
        className="rich-text"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </>
  );
}

export const richTextConfig: ComponentConfig<RichTextProps> = {
  label: "Rich Text",
  render: RichText,
  fields: {
    content: richTextEditorField,
  },
  defaultProps: {
    content: "",
  },
};
