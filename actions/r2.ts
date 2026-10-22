"use server";

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET, R2_PREFIX, getR2PublicUrl } from "@/lib/r2";

export interface PresignedUrlResponse {
  success: boolean;
  uploadUrl?: string;
  fileUrl?: string;
  key?: string;
  error?: string;
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
    let key = keyOrUrl;
    if (keyOrUrl.startsWith("http")) {
      const url = new URL(keyOrUrl);
      key = url.pathname.replace(/^\//, "");
      if (key.startsWith("api/r2/")) {
        key = key.replace(/^api\/r2\//, "");
      }
    } else if (keyOrUrl.startsWith("/api/r2/")) {
      key = keyOrUrl.replace(/^\/api\/r2\//, "");
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    await r2Client.send(command);
    return { success: true };
  } catch (err: any) {
    console.error("Cloudflare R2 delete error:", err);
    return { success: false, error: err.message };
  }
}
