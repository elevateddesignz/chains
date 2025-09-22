'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        let nextItems: CartItem[];
        if (existing) {
          nextItems = get().items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
          );
        } else {
          nextItems = [...get().items, item];
        }
        const subtotal = nextItems.reduce((acc, current) => acc + current.price * current.quantity, 0);
        set({ items: nextItems, subtotal });
      },
      removeItem: (id) => {
        const nextItems = get().items.filter((item) => item.id !== id);
        const subtotal = nextItems.reduce((acc, current) => acc + current.price * current.quantity, 0);
        set({ items: nextItems, subtotal });
      },
      clear: () => set({ items: [], subtotal: 0 }),
    }),
    {
      name: 'hypeemup-cart',
    },
  ),
);
