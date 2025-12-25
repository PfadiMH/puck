import { PostHeroSvg } from "@components/graphics/PostHeroSvg";
import { singleSelectionFileTableField } from "@components/puck-fields/fileTable";
import { FileProps, getFile } from "@lib/storage/storage";
import { ComponentConfig } from "@measured/puck";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export type HeroWrapperProps = {
  title: string;
  backgroundImage: string;
};

export type HeroProps = {
  title: string;
  backgroundImageData?: FileProps;
};

export async function HeroServerWrapper({
  title,
  backgroundImage,
}: HeroWrapperProps) {
  if (!backgroundImage) {
    return <Hero title={title} />;
  }

  let fileData;
  try {
    fileData = await getFile(backgroundImage);

    if (!fileData?.url) {
      throw new Error("File data is missing a URL.");
    }
  } catch (error) {
    console.error(
      `Failed to retrieve file data for ID: ${backgroundImage}`,
      error
    );
    return (
      <div className="full w-full h-96 relative flex flex-col justify-center overflow-hidden items-center text-center">
        Image not available.
      </div>
    );
  }

  return <Hero backgroundImageData={fileData} title={title} />;
}

export function HeroClientWrapper({
  title,
  backgroundImage,
}: HeroWrapperProps) {
  if (!backgroundImage) {
    return <Hero title={title} />;
  }

  const {
    data: fileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["file", backgroundImage],
    queryFn: () => getFile(backgroundImage),
    enabled: !!backgroundImage,
  });

  if (isError || !fileData || !fileData.url) {
    return (
      <div className="full w-full h-96 relative flex flex-col justify-center overflow-hidden items-center text-center">
        Image not available.
      </div>
    );
  }

  return <Hero backgroundImageData={fileData} title={title} />;
}

function Hero({ title, backgroundImageData }: HeroProps) {
  return (
    <div className="full w-full h-96 relative flex flex-col justify-center overflow-hidden items-center">
      {backgroundImageData && (
        <Image
          src={backgroundImageData.url}
          alt={backgroundImageData.description}
          fill={true}
          className="object-cover !static"
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

export const heroPageConfig: ComponentConfig<HeroWrapperProps> = {
  render: ({ backgroundImage, title }) => (
    <HeroServerWrapper backgroundImage={backgroundImage} title={title} />
  ),
  fields: {
    title: {
      type: "text",
      label: "Title (Optional)",
    },
    backgroundImage: singleSelectionFileTableField,
  },
};

export const heroEditorConfig: ComponentConfig<HeroWrapperProps> = {
  render: HeroClientWrapper,
  fields: {
    title: {
      type: "text",
      label: "Title (Optional)",
    },
    backgroundImage: singleSelectionFileTableField,
  },
};
