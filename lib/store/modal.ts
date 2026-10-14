import { create } from "zustand";
import type { ReactNode } from "react";

// ──────────────────────────────────────────────
// Global Modal Manager
// ──────────────────────────────────────────────

export type ModalType =
  | "cart"
  | "search"
  | "confirm-delete"
  | "image-preview"
  | "quick-view"
  | null;

interface ModalData {
  [key: string]: any;
}

interface ModalState {
  type: ModalType;
  data: ModalData;
  isOpen: boolean;

  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  data: {},
  isOpen: false,

  openModal: (type, data = {}) =>
    set({
      type,
      data,
      isOpen: true,
    }),

  closeModal: () =>
    set({
      type: null,
      data: {},
      isOpen: false,
    }),
}));
