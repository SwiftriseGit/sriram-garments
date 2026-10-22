import { S3Client } from "@aws-sdk/client-s3";

const endpoint =
  process.env.R2_ENDPOINT ||
  (process.env.R2_ACCOUNT_ID
    ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "");

export const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME || "javarag";
export const R2_PREFIX = (process.env.R2_FOLDER_PREFIX || "cloths").replace(
  /\/+$/,
  ""
);

/**
 * Get the public-facing URL for an R2 object key.
 * If NEXT_PUBLIC_R2_URL is set (e.g. custom domain or pub-*.r2.dev), it uses that.
 * Otherwise, it falls back to Next.js route handler /api/r2/[...key] to stream the file.
 */
export function getR2PublicUrl(key: string): string {
  const publicBase = process.env.NEXT_PUBLIC_R2_URL?.trim().replace(/\/+$/, "");
  if (publicBase) {
    return `${publicBase}/${key}`;
  }
  return `/api/r2/${key}`;
}
