import { filePickerField } from "@components/puck-fields/file-picker";
import type { ComponentConfig, Fields } from "@puckeditor/core";
import NextImage from "next/image";

export type ImageProps = {
  src?: string;
  alt: string;
  sizing: "full-width" | "contained" | "fixed";
  width?: number;
  caption?: string;
  link?: string;
};

const allFields: Fields<ImageProps> = {
  src: {
    ...filePickerField,
    label: "Bild",
  },
  alt: {
    type: "text",
    label: "Alt-Text",
  },
  sizing: {
    type: "select",
    label: "Grösse",
    options: [
      { label: "Volle Breite", value: "full-width" },
      { label: "Zentriert", value: "contained" },
      { label: "Feste Breite", value: "fixed" },
    ],
  },
  width: {
    type: "number",
    label: "Breite (px)",
  },
  caption: {
    type: "text",
    label: "Bildunterschrift",
  },
  link: {
    type: "text",
    label: "Link",
  },
};

function ImageComponent({ src, alt, sizing, width, caption, link }: ImageProps) {
  if (!src) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Kein Bild ausgewählt
      </div>
    );
  }

  let imageElement: React.ReactNode;

  if (sizing === "full-width") {
    imageElement = (
      <NextImage
        src={src}
        alt={alt || ""}
        width={1200}
        height={800}
        className="w-full h-auto"
        sizes="100vw"
      />
    );
  } else if (sizing === "contained") {
    imageElement = (
      <div className="max-w-2xl mx-auto">
        <NextImage
          src={src}
          alt={alt || ""}
          width={1200}
          height={800}
          className="w-full h-auto"
          sizes="(max-width: 672px) 100vw, 672px"
        />
      </div>
    );
  } else {
    // fixed
    const fixedWidth = width || 400;
    imageElement = (
      <NextImage
        src={src}
        alt={alt || ""}
        width={fixedWidth}
        height={Math.round(fixedWidth * 0.667)}
        className="h-auto"
        sizes={`${fixedWidth}px`}
      />
    );
  }

  if (link) {
    imageElement = (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {imageElement}
      </a>
    );
  }

  if (caption) {
    return (
      <figure>
        {imageElement}
        <figcaption className="mt-2 text-sm text-gray-600 text-center">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return <>{imageElement}</>;
}

export const imageConfig: ComponentConfig<ImageProps> = {
  label: "Bild",
  render: ImageComponent,
  fields: allFields,
  resolveFields: (data) => {
    if (data.props.sizing === "fixed") {
      return allFields;
    }
    const { width: _, ...rest } = allFields;
    return rest as Fields<ImageProps>;
  },
  defaultProps: {
    src: "",
    alt: "",
    sizing: "contained",
    caption: "",
    link: "",
  },
};
