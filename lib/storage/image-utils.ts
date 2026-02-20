import sharp from "sharp";
import { encode } from "blurhash";

export interface ImageMetadata {
  width: number;
  height: number;
  blurhash: string;
}

export async function processImage(buffer: Buffer): Promise<{
  processed: Buffer;
  metadata: ImageMetadata;
}> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read image dimensions");
  }

  // Convert to WebP for better compression (keep original if already webp)
  // Use clone() to avoid pipeline state issues
  const processed = await image.clone().webp({ quality: 85 }).toBuffer();

  // Generate blurhash from a small version of the image
  // Use clone() for independent pipeline
  const { data, info } = await image
    .clone()
    .resize(32, 32, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4
  );

  return {
    processed,
    metadata: {
      width: metadata.width,
      height: metadata.height,
      blurhash,
    },
  };
}

export function isImageMimeType(contentType: string): boolean {
  return contentType.startsWith("image/");
}
