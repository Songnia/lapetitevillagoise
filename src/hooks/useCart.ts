import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '@/lib/menu-data';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemName: string) => void;
  updateQuantity: (itemName: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

// Helper to parse price string like "4 500 FCFA" to number
const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.name === item.name);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (itemName) => {
        set({ items: get().items.filter((i) => i.name !== itemName) });
      },
      updateQuantity: (itemName, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemName);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.name === itemName ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + parsePrice(item.price) * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
