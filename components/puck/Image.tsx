import { filePickerWithMetaField } from "@components/puck-fields/file-picker-with-meta";
import { ImageWithLightbox } from "@components/puck/ImageWithLightbox";
import type { FileSelection } from "@lib/storage/file-record";
import { ComponentConfig } from "@measured/puck";

type AspectRatio = "auto" | "16:9" | "4:3" | "1:1" | "3:2";
type ObjectFit = "cover" | "contain";

export type ImageProps = {
  file?: FileSelection | null;
  alt: string;
  objectFit: ObjectFit;
  aspectRatio: AspectRatio;
  caption?: string;
  enableLightbox: boolean;
};

const aspectRatioClasses: Record<AspectRatio, string> = {
  auto: "",
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "3:2": "aspect-[3/2]",
};

/**
 * Convert blurhash to a simple data URL placeholder.
 * For now, returns a neutral gray placeholder.
 * A full implementation would decode the blurhash to an image.
 */
function blurhashToDataURL(blurhash?: string): string | undefined {
  if (!blurhash) return undefined;
  // Simple gray placeholder - could be enhanced with actual blurhash decoding
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23e5e7eb' width='1' height='1'/%3E%3C/svg%3E";
}

function Image({
  file,
  alt,
  objectFit,
  aspectRatio,
  caption,
  enableLightbox,
}: ImageProps) {
  if (!file) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
        <p>No image selected</p>
      </div>
    );
  }

  const aspectClass = aspectRatioClasses[aspectRatio];
  const blurDataURL = blurhashToDataURL(file.blurhash);
  const aspectStyle =
    aspectRatio === "auto" && file.width && file.height
      ? { aspectRatio: `${file.width} / ${file.height}` }
      : undefined;

  return (
    <figure className="w-full">
      <ImageWithLightbox
        src={file.url}
        alt={alt || file.filename}
        aspectClass={aspectClass}
        aspectStyle={aspectStyle}
        objectFit={objectFit}
        enableLightbox={enableLightbox}
        blurDataURL={blurDataURL}
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-contrast-ground/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const imageConfig: ComponentConfig<ImageProps> = {
  label: "Image",
  render: Image,
  fields: {
    file: {
      ...filePickerWithMetaField,
      label: "Image",
    },
    alt: {
      type: "text",
      label: "Alt Text",
    },
    objectFit: {
      type: "radio",
      label: "Object Fit",
      options: [
        { value: "cover", label: "Cover" },
        { value: "contain", label: "Contain" },
      ],
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      options: [
        { value: "auto", label: "Auto (Original)" },
        { value: "16:9", label: "16:9 (Widescreen)" },
        { value: "4:3", label: "4:3 (Standard)" },
        { value: "1:1", label: "1:1 (Square)" },
        { value: "3:2", label: "3:2 (Photo)" },
      ],
    },
    caption: {
      type: "text",
      label: "Caption (Optional)",
    },
    enableLightbox: {
      type: "radio",
      label: "Click to Enlarge",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
    },
  },
  defaultProps: {
    file: null,
    alt: "",
    objectFit: "cover",
    aspectRatio: "auto",
    enableLightbox: true,
  },
};
