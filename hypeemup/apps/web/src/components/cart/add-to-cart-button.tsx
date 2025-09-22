'use client';

import { useState } from 'react';

import { useBuilderStore } from '@/stores/use-builder-store';
import { useCartStore } from '@/stores/use-cart-store';

export function AddToCartButton() {
  const { config } = useBuilderStore();
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: `builder-${Date.now()}`,
      name: `${config.text} Chain`,
      price: 25000,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="w-full rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black"
    >
      {added ? 'Added!' : 'Add custom build to cart'}
    </button>
  );
}
