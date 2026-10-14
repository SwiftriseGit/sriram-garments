"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxFiles = 6,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (fileArray.length === 0) {
        toast.error("Please select image files only");
        return;
      }

      const remaining = maxFiles - images.length;
      if (fileArray.length > remaining) {
        toast.error(`You can only upload ${remaining} more image(s)`);
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        for (const file of fileArray) {
          formData.append("files", file);
        }

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const { urls } = await res.json();
        onChange([...images, ...urls]);
        toast.success(
          `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`
        );
      } catch (error: any) {
        toast.error(error.message || "Failed to upload images");
      } finally {
        setIsUploading(false);
      }
    },
    [images, maxFiles, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-indigo-400 bg-indigo-50/50"
            : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-zinc-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-700">
                Drop images here or click to browse
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                PNG, JPG, WebP up to 5MB · Max {maxFiles} images
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50"
            >
              {url.startsWith("/") || url.startsWith("http") ? (
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-zinc-300" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name="images" value={images.join(",")} />
    </div>
  );
}
