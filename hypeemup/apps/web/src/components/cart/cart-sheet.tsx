'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useCartStore } from '@/stores/use-cart-store';

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const { items, subtotal } = useCartStore();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full border border-white/20 p-2 text-white/80 transition hover:border-brand-orange hover:text-brand-orange"
        aria-label="View cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {items.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-xs text-black">
            {items.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-brand-slate/90 p-4 shadow-2xl">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Cart</h3>
          <div className="mt-4 flex max-h-56 flex-col gap-3 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-xs text-white/60">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm text-white/80">
                  <span>{item.name}</span>
                  <span>${(item.price / 100).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white">
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-4 block rounded-full bg-brand-orange px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-black"
            onClick={() => setOpen(false)}
          >
            Checkout
          </Link>
        </div>
      ) : null}
    </div>
  );
}
