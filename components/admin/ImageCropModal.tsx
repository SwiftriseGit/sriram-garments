"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Move,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Measure container inner dimensions
  const updateContainerDimensions = useCallback(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
  }, []);

  // Reset transforms whenever modal opens or imageSrc changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setImageLoaded(false);

      // Measure after DOM paint
      requestAnimationFrame(() => {
        updateContainerDimensions();
      });

      const handleResize = () => updateContainerDimensions();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isOpen, imageSrc, aspectRatio, updateContainerDimensions]);

  // If image is already completed in cache
  useEffect(() => {
    if (isOpen && imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
      setImageLoaded(true);
      updateContainerDimensions();
    }
  }, [isOpen, imageSrc, updateContainerDimensions]);

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

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(3, Math.max(0.8, prev + delta)));
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset tool
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  /**
   * Calculate cover-fit dimensions for viewport & canvas.
   * Takes 90° / 270° rotation into account so there are never black borders.
   */
  const calculateGeometry = (cW: number, cH: number) => {
    const img = imageRef.current;
    if (!img || !img.naturalWidth || !img.naturalHeight || cW === 0 || cH === 0) {
      return null;
    }

    const isRotated = rotation % 180 !== 0;
    const naturalAspect = img.naturalWidth / img.naturalHeight;
    const effectiveAspect = isRotated ? 1 / naturalAspect : naturalAspect;

    let effW: number, effH: number;
    if (cW / cH > effectiveAspect) {
      // Container is wider than rotated image -> fit width, height overflows
      effW = cW;
      effH = cW / effectiveAspect;
    } else {
      // Container is taller than rotated image -> fit height, width overflows
      effH = cH;
      effW = cH * effectiveAspect;
    }

    // Unrotated DOM element dimensions
    const baseW = isRotated ? effH : effW;
    const baseH = isRotated ? effW : effH;

    return { baseW, baseH, effW, effH };
  };

  /**
   * Apply crop by drawing exactly what is visible in the container
   * onto a canvas of dimensions targetWidth × targetHeight.
   */
  const handleApplyCrop = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container || !imageLoaded) return;

    const cW = container.clientWidth;
    const cH = container.clientHeight;
    if (cW === 0 || cH === 0) {
      toast.error("Crop container is initializing. Please try again.");
      return;
    }

    const geom = calculateGeometry(cW, cH);
    if (!geom) {
      toast.error("Image dimensions could not be read.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Ratio between Canvas pixel resolution and CSS container size
    const scaleFactor = targetWidth / cW;

    // Center of image on Canvas
    const canvasCenterX = (cW / 2 + offset.x) * scaleFactor;
    const canvasCenterY = (cH / 2 + offset.y) * scaleFactor;

    // Dimensions of image drawn on canvas
    const drawW = geom.baseW * zoom * scaleFactor;
    const drawH = geom.baseH * zoom * scaleFactor;

    ctx.save();
    // 1. Position origin at the image's center on the canvas
    ctx.translate(canvasCenterX, canvasCenterY);
    // 2. Rotate
    ctx.rotate((rotation * Math.PI) / 180);
    // 3. Draw image centered at (0, 0)
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        } else {
          toast.error("Failed to crop image. Please try again.");
        }
      },
      "image/webp",
      0.92
    );
  };

  /**
   * CSS styling for preview <img> so it precisely matches the canvas calculation.
   */
  const getImageStyle = (): React.CSSProperties => {
    const container = containerRef.current;
    const img = imageRef.current;

    if (!container || !img || !imageLoaded || containerSize.width === 0) {
      return {
        opacity: 0,
        position: "absolute",
        pointerEvents: "none",
      };
    }

    const geom = calculateGeometry(containerSize.width, containerSize.height);
    if (!geom) {
      return { opacity: 0, position: "absolute", pointerEvents: "none" };
    }

    const cW = containerSize.width;
    const cH = containerSize.height;

    return {
      position: "absolute",
      width: `${geom.baseW}px`,
      height: `${geom.baseH}px`,
      left: `${(cW - geom.baseW) / 2}px`,
      top: `${(cH - geom.baseH) / 2}px`,
      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
      transformOrigin: "center center",
      transition: isDragging ? "none" : "transform 0.05s ease-out",
      maxWidth: "none",
      pointerEvents: "none" as const,
    };
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    updateContainerDimensions();
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
                Crop &amp; Frame Banner Visual
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
            {/* The Raw Image — sized to cover-fit the container */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              style={getImageStyle()}
            />

            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
                <span className="text-xs">Loading image preview...</span>
              </div>
            )}

            {/* Rule-of-Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div />
            </div>

            {/* Hint Badge */}
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-zinc-300 font-medium flex items-center gap-1.5 pointer-events-none">
              <Move className="w-3 h-3 text-orange-400" />
              <span>Drag to reposition • Scroll or slider to zoom</span>
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
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors text-xs cursor-pointer font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-900 gap-3">
            <span className="text-[11px] text-zinc-500 hidden sm:inline-block">
              Export format: {targetWidth} × {targetHeight} px (WebP)
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
                disabled={isUploading || !imageLoaded}
                onClick={handleApplyCrop}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading cropped WebP to R2...</span>
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
