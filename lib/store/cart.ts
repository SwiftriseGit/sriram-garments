import { create } from "zustand";

// ──────────────────────────────────────────────
// Cart Store
// ──────────────────────────────────────────────

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  color: { name: string; hex: string; tone: "dark" | "light" };
  size: string;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.id === item.id && i.size === item.size
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (id, size) =>
    set((state) => ({
      items: state.items.filter((i) => !(i.id === id && i.size === size)),
    })),

  updateQuantity: (id, size, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => !(i.id === id && i.size === size))
          : state.items.map((i) =>
              i.id === id && i.size === size ? { ...i, quantity } : i
            ),
    })),

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
