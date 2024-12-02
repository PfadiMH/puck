import type { Config } from "@measured/puck";
import type { TextProps } from "./components/Text";
import Text from "./components/Text";

type Props = {
  HeadingBlock: { title: string };
  Text: TextProps;
};

export const config: Config<Props> = {
  components: {
    Text: {
      render: Text,
      fields: {
        text: {
          type: "textarea",
        },
      },
    },
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
    HeadingComponent:{
      fields:{
        text: {type: "text"},
        textAlign: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        text: "HeadingComponent",
        textAlign: "center",
      },
      render: ({ text, textAlign }) => (
        <div style={{ padding: 64 }}>
          <h1 style={{ textAlign }}>{text}</h1>
        </div>
      ),
    },
  },
};

export default config;
