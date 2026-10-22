import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET } from "@/lib/r2";
import { Readable } from "stream";

/**
 * Next.js 16 Route Handler for streaming R2 assets.
 * Note: Dynamic route parameters MUST be awaited in Next.js 16.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params; // Mandatory await in Next.js 16

    if (!key || key.length === 0) {
      return NextResponse.json({ error: "Missing file key" }, { status: 400 });
    }

    const objectKey = key.join("/");

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: objectKey,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Convert AWS SDK stream to Web ReadableStream
    let webStream: ReadableStream;
    if (typeof (response.Body as any).transformToWebStream === "function") {
      webStream = (response.Body as any).transformToWebStream();
    } else {
      const nodeStream = response.Body as Readable;
      webStream = new ReadableStream({
        start(controller) {
          nodeStream.on("data", (chunk) => controller.enqueue(chunk));
          nodeStream.on("end", () => controller.close());
          nodeStream.on("error", (err) => controller.error(err));
        },
      });
    }

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Length": response.ContentLength?.toString() || "",
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: response.ETag || "",
      },
    });
  } catch (error: any) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("Error streaming from Cloudflare R2:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file from storage" },
      { status: 500 }
    );
  }
}
