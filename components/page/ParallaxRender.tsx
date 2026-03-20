import Desktop from "@components/graphics/parallax-layers/DesktopCombined.svg";
import Parallax from "./Parallax";

type ParallaxRendererProps = {
  editMode?: boolean;
};

function ParallaxRender({ editMode }: ParallaxRendererProps) {
  if (editMode) {
    return (
      <div className="full relative">
        <img src={Desktop.src} alt="Desktop Parallax" className="w-full block" />
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--color-mud-ground) 60%)",
          }}
        />
      </div>
    );
  }
  return <Parallax />;
}

export default ParallaxRender;
