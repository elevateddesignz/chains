'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCartStore } from '@/stores/use-cart-store';
import { apiFetch } from '@/lib/api-client';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { url } = await apiFetch<{ url: string }>('/checkout/session', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });
      clear();
      window.location.href = url;
    } catch (err) {
      setError('Unable to start checkout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Checkout</h1>
      {items.length === 0 ? (
        <p className="text-white/70">Add items to your cart to begin checkout.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
          <p>You're almost there. We'll send you to Stripe Checkout to securely complete payment.</p>
          <p className="mt-3 text-white">Subtotal: ${(subtotal / 100).toFixed(2)}</p>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-60"
          >
            {loading ? 'Redirecting...' : 'Continue to Stripe' }
          </button>
          {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
        </div>
      )}
    </div>
  );
}
