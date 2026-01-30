"use client";

import { Lightbox } from "@components/ui/Lightbox";
import NextImage from "next/image";
import { useState } from "react";

interface ImageWithLightboxProps {
  src: string;
  alt: string;
  aspectClass: string;
  aspectStyle?: React.CSSProperties;
  objectFit: "cover" | "contain";
  enableLightbox: boolean;
  blurDataURL?: string;
}

export function ImageWithLightbox({
  src,
  alt,
  aspectClass,
  aspectStyle,
  objectFit,
  enableLightbox,
  blurDataURL,
}: ImageWithLightboxProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (enableLightbox && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-lg ${aspectClass} ${
          enableLightbox ? "cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary" : ""
        }`}
        style={aspectStyle}
        onClick={() => enableLightbox && setLightboxOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={enableLightbox ? 0 : undefined}
        role={enableLightbox ? "button" : undefined}
        aria-label={enableLightbox ? `View ${alt} in lightbox` : undefined}
      >
        <NextImage
          src={src}
          alt={alt}
          fill
          className={objectFit === "cover" ? "object-cover" : "object-contain"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
        />
      </div>
      {enableLightbox && (
        <Lightbox
          src={src}
          alt={alt}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
