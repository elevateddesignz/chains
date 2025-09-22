'use client';

import { useMemo } from 'react';

import { useBuilderStore } from '@/stores/use-builder-store';

export function PriceBreakdown() {
  const { config } = useBuilderStore();
  const pricing = useMemo(() => {
    const base = 12000;
    const sizeMultiplier = 1 + config.size * 0.1;
    const finishMultiplier = config.finish === 'chrome' ? 1.4 : config.finish === 'gloss' ? 1.2 : 1;
    const attachments = config.attachments.length * 2500;
    const subtotal = Math.round(base * sizeMultiplier * finishMultiplier + attachments);
    const tax = Math.round(subtotal * 0.07);
    const shipping = 1500;
    const total = subtotal + tax + shipping;
    return { base, subtotal, tax, shipping, total };
  }, [config]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Price Breakdown</h4>
      <dl className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <dt>Base</dt>
          <dd>${(pricing.base / 100).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>${(pricing.subtotal / 100).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Tax</dt>
          <dd>${(pricing.tax / 100).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Shipping</dt>
          <dd>${(pricing.shipping / 100).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-2 text-white">
          <dt>Total</dt>
          <dd>${(pricing.total / 100).toFixed(2)}</dd>
        </div>
      </dl>
    </div>
  );
}
