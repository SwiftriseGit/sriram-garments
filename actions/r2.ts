"use server";

import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET, R2_PREFIX, getR2PublicUrl } from "@/lib/r2";
import connectDB from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import { requireAdmin } from "@/lib/auth/dal";

export interface PresignedUrlResponse {
  success: boolean;
  uploadUrl?: string;
  fileUrl?: string;
  key?: string;
  error?: string;
}

/** Check if an image URL belongs to Cloudflare R2 */
export async function isR2Image(keyOrUrl: string): Promise<boolean> {
  if (!keyOrUrl) return false;
  return (
    keyOrUrl.startsWith("/api/r2/") ||
    keyOrUrl.includes("/api/r2/") ||
    keyOrUrl.includes(".r2.cloudflarestorage.com") ||
    keyOrUrl.includes(".r2.dev") ||
    keyOrUrl.startsWith(`${R2_PREFIX}/`)
  );
}

/** Extract the pure S3 object key inside the bucket (e.g. cloths/filename.jpg) */
export async function extractR2Key(keyOrUrl: string): Promise<string | null> {
  if (!keyOrUrl) return null;
  let key = keyOrUrl.trim();

  // Handle absolute URLs
  if (key.startsWith("http://") || key.startsWith("https://")) {
    try {
      const url = new URL(key);
      key = url.pathname;
    } catch {
      // not a valid url, continue with string processing
    }
  }

  // Remove leading /
  key = key.replace(/^\/+/, "");

  // Remove api/r2/ prefix if present
  if (key.startsWith("api/r2/")) {
    key = key.replace(/^api\/r2\//, "");
  }

  key = decodeURIComponent(key);

  // If there's an R2_PREFIX like "cloths/"
  const prefixIndex = key.indexOf(`${R2_PREFIX}/`);
  if (prefixIndex !== -1) {
    key = key.slice(prefixIndex);
  }

  return key;
}

/**
 * Next.js 16 Server Action to generate a short-lived S3 presigned PUT URL
 * for direct streaming upload to Cloudflare R2 from the client browser.
 */
export async function getUploadUrl(
  filename: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  try {
    if (!filename || !contentType) {
      return { success: false, error: "Filename and content type are required" };
    }

    if (!contentType.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }

    // Sanitize filename & create unique object key inside folder prefix (e.g. cloths/...)
    const sanitizedName = filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");
    const uniqueKey = `${R2_PREFIX}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: uniqueKey,
      ContentType: contentType,
    });

    // Generate presigned URL valid for 60 seconds
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });
    const fileUrl = getR2PublicUrl(uniqueKey);

    return {
      success: true,
      uploadUrl,
      fileUrl,
      key: uniqueKey,
    };
  } catch (err: any) {
    console.error("Cloudflare R2 presigned URL generation error:", err);
    return {
      success: false,
      error: err.message || "Failed to provision upload authorization.",
    };
  }
}

/**
 * Server Action to delete an image object from Cloudflare R2
 */
export async function deleteR2Object(keyOrUrl: string) {
  try {
    const key = await extractR2Key(keyOrUrl);
    if (!key) return { success: false, error: "Invalid key or URL" };

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`[R2] Deleted object: ${key} from bucket ${R2_BUCKET}`);
    return { success: true };
  } catch (err: any) {
    console.error("Cloudflare R2 delete error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Clean up orphaned images in Cloudflare R2 that are no longer associated
 * with any product in the MongoDB database.
 */
export async function cleanupOrphanedR2Images() {
  await requireAdmin();

  try {
    await connectDB();
    const products = await ProductModel.find().select("images").lean();
    const activeKeys = new Set<string>();

    for (const p of products) {
      if (Array.isArray(p.images)) {
        for (const img of p.images) {
          const key = await extractR2Key(img);
          if (key) activeKeys.add(key);
        }
      }
    }

    // List all objects in bucket under cloths/
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: `${R2_PREFIX}/`,
    });

    const listRes = await r2Client.send(listCommand);
    const objects = listRes.Contents || [];

    let deletedCount = 0;
    for (const obj of objects) {
      // Don't delete directory marker itself (e.g. cloths/)
      if (obj.Key && obj.Key !== `${R2_PREFIX}/` && !activeKeys.has(obj.Key)) {
        console.log(`[R2 Cleanup] Deleting orphaned object: ${obj.Key}`);
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET,
            Key: obj.Key,
          })
        );
        deletedCount++;
      }
    }

    return { success: true, deletedCount };
  } catch (err: any) {
    console.error("Failed to cleanup orphaned R2 images:", err);
    return { success: false, error: err.message };
  }
}
