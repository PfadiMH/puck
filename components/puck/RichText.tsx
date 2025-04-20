import { RichTextData, RichTextEditor } from "@components/misc/RichTextEditor";
import { ComponentConfig } from "@measured/puck";

export type RichTextProps = {
  richTextData: RichTextData;
};

function RichText({ richTextData }: RichTextProps) {
  return <div className="w-full overflow-hidden"></div>;
}

export const richTextConfig: ComponentConfig<RichTextProps> = {
  render: RichText,
  fields: {
    richTextData: {
      type: "custom",
      render: RichTextEditor,
    },
  },
};
