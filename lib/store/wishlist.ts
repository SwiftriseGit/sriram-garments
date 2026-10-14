import { create } from "zustand";

// ──────────────────────────────────────────────
// Wishlist Store
// ──────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  color: { name: string; hex: string; tone: "dark" | "light" };
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];

  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) return state;
      return { items: [...state.items, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  toggleItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) {
        return { items: state.items.filter((i) => i.id !== item.id) };
      }
      return { items: [...state.items, item] };
    }),

  isWishlisted: (id) => get().items.some((i) => i.id === id),

  clearWishlist: () => set({ items: [] }),
}));
