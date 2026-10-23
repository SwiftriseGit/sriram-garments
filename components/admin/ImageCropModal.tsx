"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move, Info, Sparkles } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  aspectRatio: number; // width / height, e.g. 3 / 1 or 1 / 1
  aspectRatioLabel: string;
  targetWidth?: number;
  targetHeight?: number;
  isUploading?: boolean;
  onCropComplete: (blob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  aspectRatio,
  aspectRatioLabel,
  targetWidth = 1920,
  targetHeight = 640,
  isUploading = false,
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset transforms whenever imageSrc or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc, aspectRatio]);

  // Handle Drag / Pan (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(3, Math.max(0.8, prev + delta)));
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Perform Final Crop on Canvas
  const handleApplyCrop = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High quality canvas rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const containerRect = container.getBoundingClientRect();
    const scaleFactor = targetWidth / containerRect.width;

    ctx.save();
    // Move origin to canvas center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply offset & zoom relative to canvas coordinates
    const drawX = offset.x * scaleFactor;
    const drawY = offset.y * scaleFactor;
    ctx.translate(drawX, drawY);

    // Compute base image scaled dimensions inside the viewport
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let baseWidth = containerRect.width;
    let baseHeight = containerRect.width / imgAspect;

    if (baseHeight < containerRect.height) {
      baseHeight = containerRect.height;
      baseWidth = containerRect.height * imgAspect;
    }

    const scaledWidth = baseWidth * zoom * scaleFactor;
    const scaledHeight = baseHeight * zoom * scaleFactor;

    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      },
      "image/webp",
      0.92
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl sm:max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4.5 border-b border-zinc-800 flex items-center justify-between text-white bg-zinc-900/60">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Crop &amp; Position Banner
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                {aspectRatioLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 p-3 sm:p-5 bg-zinc-900 flex flex-col items-center justify-center overflow-hidden select-none">
          {/* Aspect Ratio Box with Boundary Frame */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{ aspectRatio: `${aspectRatio}` }}
            className="relative w-full max-h-[50vh] sm:max-h-[55vh] rounded-xl overflow-hidden border-2 border-orange-500/80 shadow-2xl bg-black flex items-center justify-center cursor-grab active:cursor-grabbing group"
          >
            {/* The Raw Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transition: isDragging ? "none" : "transform 0.05s ease-out",
                maxWidth: "none",
              }}
              className="absolute pointer-events-none origin-center max-w-none"
            />

            {/* Rule-of-Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-white/15" />
              <div className="border-r border-white/15" />
              <div />
            </div>

            {/* Hint Badge */}
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-zinc-300 font-medium flex items-center gap-1.5 pointer-events-none">
              <Move className="w-3 h-3 text-orange-400" />
              <span>Drag to reposition image</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-3.5 sm:p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2.5 flex-1 min-w-50">
              <ZoomOut className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-orange-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="font-mono text-zinc-400 text-[11px] w-9 text-right shrink-0">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Tools (Rotate & Reset) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-xs cursor-pointer font-medium"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffset({ x: 0, y: 0 });
                  setRotation(0);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors text-xs cursor-pointer font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-900 gap-3">
            <span className="text-[11px] text-zinc-500 hidden sm:inline-block">
              Cropped output: {targetWidth} × {targetHeight} px (WebP)
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                disabled={isUploading}
                onClick={onCancel}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isUploading}
                onClick={handleApplyCrop}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading to R2...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply Crop &amp; Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
