import Desktop from "@components/graphics/parallax-layers/DesktopCombined.svg";
import Parallax from "./Parallax";

type ParallaxRendererProps = {
  editMode?: boolean;
};

function ParallaxRender({ editMode }: ParallaxRendererProps) {
  if (editMode) {
    return <img src={Desktop.src} alt="Desktop Parallax" className="w-full" />;
  }
  return <Parallax />;
}

export default ParallaxRender;
