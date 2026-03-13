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
    label: "Image",
  },
  alt: {
    type: "text",
    label: "Alt Text (for accessibility, not visible)",
  },
  sizing: {
    type: "select",
    label: "Size",
    options: [
      { label: "Full Width (edge to edge)", value: "full-width" },
      { label: "Contained (max 576px, centered)", value: "contained" },
      { label: "Fixed Width", value: "fixed" },
    ],
  },
  width: {
    type: "number",
    label: "Width (px)",
  },
  caption: {
    type: "text",
    label: "Caption",
  },
  link: {
    type: "text",
    label: "Link",
  },
};

function ImageComponent({ src, alt, sizing, width, caption, link }: ImageProps) {
  if (!src) {
    return (
      <div className="border-2 border-dashed border-contrast-ground/30 rounded-lg p-8 text-center text-contrast-ground/50">
        No image selected
      </div>
    );
  }

  let imageElement: React.ReactNode;

  if (sizing === "full-width") {
    imageElement = (
      <div className="full w-full">
        <NextImage
          src={src}
          alt={alt || ""}
          width={1200}
          height={800}
          className="w-full h-auto"
          sizes="100vw"
        />
      </div>
    );
  } else if (sizing === "contained") {
    imageElement = (
      <div className="max-w-xl mx-auto">
        <NextImage
          src={src}
          alt={alt || ""}
          width={800}
          height={600}
          className="w-full h-auto"
          sizes="(max-width: 576px) 100vw, 576px"
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
        <figcaption className="mt-2 text-sm text-contrast-ground/60 text-center">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return <>{imageElement}</>;
}

export const imageConfig: ComponentConfig<ImageProps> = {
  label: "Image",
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
