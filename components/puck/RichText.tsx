import { ComponentConfig } from "@puckeditor/core";
import DOMPurify from "isomorphic-dompurify";
import { isValidElement, ReactNode } from "react";

export type RichTextProps = {
  content: ReactNode;
};

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.hasAttribute("style")) {
    const style = node.getAttribute("style") || "";
    const match = style.match(/text-align:\s*(left|center|right|justify)/i);
    node.setAttribute("style", match ? match[0] : "");
  }
});

const styles = `
  .rich-text ul { list-style-type: disc; padding-left: 1.5rem; }
  .rich-text ol { list-style-type: decimal; padding-left: 1.5rem; }
  .rich-text li { margin: 0.25rem 0; }
  .rich-text blockquote { border-left: 4px solid var(--color-primary); padding-left: 1rem; font-style: italic; }
  .rich-text a { color: var(--color-primary); text-decoration: underline; }
`;

export const richTextConfig: ComponentConfig<RichTextProps> = {
  label: "Rich Text",
  render: ({ content }) => {
    if (isValidElement(content)) {
      return (
        <>
          <style>{styles}</style>
          <div className="rich-text">{content}</div>
        </>
      );
    }

    if (typeof content === "string") {
      return (
        <>
          <style>{styles}</style>
          <div
            className="rich-text"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content, {
                ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "a", "h1", "h2", "h3", "h4", "ul", "ol", "li", "blockquote"],
                ALLOWED_ATTR: ["href", "target", "rel", "style"],
              }),
            }}
          />
        </>
      );
    }

    return (
      <>
        <style>{styles}</style>
        <div className="rich-text" />
      </>
    );
  },
  fields: {
    content: {
      type: "richtext",
      renderMenu: ({ children }) => (
        <div
          data-puck-rte-menu
          className="_RichTextMenu_k97eh_1 _RichTextMenu--form_k97eh_7"
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest("button, [role=menuitem]")) {
              e.preventDefault();
            }
          }}
        >
          {children}
        </div>
      ),
    },
  },
  defaultProps: {
    content: "<p></p>",
  },
};
