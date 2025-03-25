import { ComponentConfig } from "@measured/puck";
import { ParallaxRender } from "./ParallaxRender";

export type GraphicProps = {
  selection: string;
  editMode?: boolean;
};

function Graphic({ editMode, selection }: Readonly<GraphicProps>) {
  switch (selection) {
    case "Parallax":
      return <ParallaxRender editMode={editMode} />;
    case "Nothing":
      return <p>Nüüt</p>;
    default:
      if (editMode) {
        return <p>please select a type</p>;
      }
      return <></>;
  }
}
export const graphicConfig: ComponentConfig<GraphicProps> = {
  render: Graphic,
  fields: {
    selection: {
      type: "select",
      options: [
        { value: "Nothing", label: "Nüüt" },
        { value: "Parallax", label: "Parallax" },
      ],
      label: "Graphic Type",
    },
  },
};
