import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color,
        );

        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + item.quantity, i.stock),
                  }
                : i,
            ),
          });
        } else {
          // Add new item
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
