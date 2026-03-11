import { filePickerField } from "@components/puck-fields/file-picker";
import type { ComponentConfig } from "@puckeditor/core";
import NextImage from "next/image";
import React from "react";

export type GalleryProps = {
  images: Array<{ src?: string; alt: string }>;
  columns: number;
  gap: string;
};

function Gallery({ images, columns, gap }: GalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Keine Bilder hinzugefügt
      </div>
    );
  }

  const colTemplate = `repeat(${columns}, 1fr)`;

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .puck-gallery {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .puck-gallery {
            grid-template-columns: var(--gallery-tablet) !important;
          }
        }
        @media (min-width: 1024px) {
          .puck-gallery {
            grid-template-columns: var(--gallery-desktop) !important;
          }
        }
      `}</style>
      <div
        className="puck-gallery"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap,
          "--gallery-tablet": `repeat(${Math.min(2, columns)}, 1fr)`,
          "--gallery-desktop": colTemplate,
        } as React.CSSProperties}
      >
        {images.map((image, idx) =>
          image.src ? (
            <div key={idx} className="aspect-[4/3] relative overflow-hidden rounded-lg">
              <NextImage
                src={image.src}
                alt={image.alt || ""}
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-lg"
                sizes={`(max-width: 767px) 100vw, (max-width: 1023px) 50vw, ${Math.round(100 / columns)}vw`}
              />
            </div>
          ) : (
            <div
              key={idx}
              className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm"
            >
              Kein Bild
            </div>
          )
        )}
      </div>
    </>
  );
}

export const galleryConfig: ComponentConfig<GalleryProps> = {
  label: "Galerie",
  render: Gallery,
  fields: {
    images: {
      type: "array",
      label: "Bilder",
      arrayFields: {
        src: {
          ...filePickerField,
          label: "Bild",
        },
        alt: {
          type: "text",
          label: "Alt-Text",
        },
      },
      getItemSummary: (item) => item.alt || "Bild",
      defaultItemProps: {
        src: "",
        alt: "",
      },
    },
    columns: {
      type: "select",
      label: "Spalten",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
    },
    gap: {
      type: "select",
      label: "Abstand",
      options: [
        { label: "Kein", value: "0" },
        { label: "Klein", value: "0.5rem" },
        { label: "Mittel", value: "1rem" },
        { label: "Gross", value: "2rem" },
      ],
    },
  },
  defaultProps: {
    images: [],
    columns: 3,
    gap: "1rem",
  },
};
