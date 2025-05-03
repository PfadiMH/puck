import { PostHeroSvg } from "@components/graphics/PostHeroSvg";
import { FileSaveProps, FileTable } from "@components/puck-fields/fileTable";
import { ComponentConfig } from "@measured/puck";
import Image from "next/image";

export type HeroProps = {
  title: string;
  backgroundImage: FileSaveProps[];
};

function Hero({ title, backgroundImage }: HeroProps) {
  const imageUrl = backgroundImage?.[0]?.url;

  return (
    <div className="w-full h-96 relative flex flex-col justify-center overflow-hidden items-center">
      {imageUrl && (
        <Image
          fill
          src={imageUrl}
          alt="Hero Image"
          style={{ objectFit: "cover" }}
        />
      )}
      {title && (
        <>
          <h1 className="text-4xl font-bold text-center z-10 text-white">
            {title}
          </h1>
          <div className="bg-black opacity-15 absolute z-5 w-full h-full" />
        </>
      )}
      <PostHeroSvg className="z-20 absolute bottom-0" />
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
      type: "custom",
      render: FileTable,
    },
  },
  defaultProps: {
    title: "",
    backgroundImage: [],
  },
};
