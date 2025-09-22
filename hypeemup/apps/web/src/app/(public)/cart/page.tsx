'use client';

import Link from 'next/link';

import { useCartStore } from '@/stores/use-cart-store';

export default function CartPage() {
  const { items, subtotal, clear } = useCartStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Your cart</h1>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
          <p>Your cart is empty. Keep exploring custom builds!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-xs text-white/50">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm text-brand-orange">${((item.price * item.quantity) / 100).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-white">
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/checkout"
              className="flex-1 rounded-full bg-brand-orange px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-black"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={clear}
              className="flex-1 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white/70"
            >
              Clear cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
