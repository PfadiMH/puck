import { ComponentConfig } from "@puckeditor/core";
import DOMPurify from "isomorphic-dompurify";
import { isValidElement, ReactNode } from "react";

export type RichTextProps = {
  content: ReactNode;
};

export const richTextConfig: ComponentConfig<RichTextProps> = {
  label: "Rich Text",
  render: ({ content }) => {
    if (isValidElement(content)) {
      return <div className="rich-text">{content}</div>;
    }

    if (typeof content === "string") {
      return (
        <div
          className="rich-text"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content, {
              ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "a", "h1", "h2", "h3", "h4", "ul", "ol", "li", "blockquote"],
              ALLOWED_ATTR: ["href", "target", "rel"],
            }),
          }}
        />
      );
    }

    return <div className="rich-text" />;
  },
  fields: {
    content: {
      type: "richtext",
    },
  },
  defaultProps: {
    content: "",
  },
};
