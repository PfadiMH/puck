import { ImageComponent } from "@components/helperComponents/ImageComponent";
import navbarConfig, { NavbarData } from "@config/navbar.config";
import { Render } from "@measured/puck/rsc";

export type NavbarComponentsProps = {
  data: NavbarData;
};

function splitData(data: NavbarData) {
  const halfLength = Math.ceil(data.content.length / 2);
  return {
    leftItems: {
      ...data,
      content: data.content.slice(0, halfLength),
    },
    rightItems: {
      ...data,
      content: data.content.slice(halfLength),
    },
  };
}

export function NavbarComponentsDesktop({ data }: NavbarComponentsProps) {
  const { leftItems, rightItems } = splitData(data);
  const logo = data.root.props.logo;
  return (
    <div className="hidden md:grid grid-cols-[1fr_min-content_1fr] gap-4 items-end border-b-[#F4D51F] border-b-8">
      <div className="flex justify-end gap-4 flex-wrap mb-1">
        <Render config={navbarConfig} data={leftItems} />
      </div>
      {logo && (
        <div className="relative w-28 h-28 mb-[-50px]">
          <a href="/">
            <ImageComponent path={logo} title="logo" />
          </a>
        </div>
      )}
      <div className="flex justify-start gap-4 flex-wrap mb-1">
        <Render config={navbarConfig} data={rightItems} />
      </div>
    </div>
  );
}
