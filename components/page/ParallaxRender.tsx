import Desktop from "@components/graphics/parallax-layers/DesktopCombined.svg";
import Parallax from "./Parallax";

type ParallaxRendererProps = {
  editMode?: boolean;
};

export function ParallaxRender({ editMode }: Readonly<ParallaxRendererProps>) {
  if (editMode) {
    return <img src={Desktop.src} alt="Mobile" className="w-full" />;
  }
  return <Parallax />;
}
