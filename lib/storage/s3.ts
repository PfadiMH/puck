import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "@lib/env";

function getS3Client(): S3Client | null {
  if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    return null;
  }

  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION || "auto",
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Required for MinIO
  });
}

const s3Client = getS3Client();

export function isStorageConfigured(): boolean {
  return s3Client !== null && !!env.S3_BUCKET && !!env.S3_PUBLIC_URL;
}

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  if (!s3Client || !env.S3_BUCKET) {
    throw new Error("S3 storage not configured");
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function deleteFile(key: string): Promise<void> {
  if (!s3Client || !env.S3_BUCKET) {
    throw new Error("S3 storage not configured");
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
    })
  );
}

export async function fileExists(key: string): Promise<boolean> {
  if (!s3Client || !env.S3_BUCKET) {
    return false;
  }

  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      })
    );
    return true;
  } catch (err: unknown) {
    // NotFound is expected when file doesn't exist
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      err.name === "NotFound"
    ) {
      return false;
    }
    // Re-throw unexpected errors (network, permissions, etc.)
    throw err;
  }
}

export function getPublicUrl(key: string): string {
  if (!env.S3_PUBLIC_URL) {
    throw new Error("S3_PUBLIC_URL not configured");
  }
  // Encode path segments while preserving slashes
  const encodedKey = key
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return `${env.S3_PUBLIC_URL}/${encodedKey}`;
}
