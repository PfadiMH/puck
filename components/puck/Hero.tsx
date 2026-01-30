import { PostHeroSvg } from "@components/graphics/PostHeroSvg";
import { filePickerWithMetaField } from "@components/puck-fields/file-picker-with-meta";
import type { FileSelection } from "@lib/storage/file-record";
import { ComponentConfig } from "@measured/puck";
import Image from "next/image";

export type HeroProps = {
  title: string;
  backgroundImage?: FileSelection | null;
};

function Hero({ title, backgroundImage }: HeroProps) {
  return (
    <div className="full w-full h-96 relative flex flex-col justify-center overflow-hidden items-center">
      {backgroundImage?.url && (
        <Image
          fill
          src={backgroundImage.url}
          alt="Hero Image"
          style={{ objectFit: "cover" }}
        />
      )}
      {title && (
        <>
          <h1 className="text-4xl font-bold text-center z-10 text-white">
            {title}
          </h1>
          <div className="bg-black opacity-15 absolute w-full h-full" />
        </>
      )}
      <PostHeroSvg className="absolute bottom-0" />
    </div>
  );
}

export const heroConfig: ComponentConfig<HeroProps> = {
  render: Hero,
  fields: {
    title: {
      type: "text",
      label: "Title (Optional)",
    },
    backgroundImage: {
      ...filePickerWithMetaField,
      label: "Background Image",
    },
  },
  defaultProps: {
    title: "",
    backgroundImage: null,
  },
};
