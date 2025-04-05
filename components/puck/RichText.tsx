import { ComponentConfig } from "@measured/puck";
import { PuckRichText, PuckRichTextProps } from "@tohuhono/puck-rich-text";

export type RichTextProps = PuckRichTextProps;

export const richTextConfig: ComponentConfig<RichTextProps> = PuckRichText;
