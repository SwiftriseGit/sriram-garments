"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "var(--font-montserrat), sans-serif",
        },
        classNames: {
          toast: "border-zinc-200 shadow-lg",
          title: "text-zinc-900 font-semibold",
          description: "text-zinc-500",
          actionButton: "bg-zinc-900 text-white",
          cancelButton: "bg-zinc-100 text-zinc-700",
        },
      }}
      richColors
      closeButton
    />
  );
}
