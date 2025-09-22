'use client';

import useSWR from 'swr';

import { apiFetch } from '@/lib/api-client';

type OrderSummary = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

const fetcher = (path: string) => apiFetch<{ orders: OrderSummary[] }>(path);

export function OrdersList() {
  const { data, error } = useSWR('/account/orders', fetcher, { suspense: true });

  if (error) {
    return <p className="text-red-400">Failed to load orders.</p>;
  }

  const orders = data?.orders ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Order history</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-white/60">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span>Order #{order.id.slice(-8)}</span>
                <span className="font-semibold text-brand-orange">${(order.total / 100).toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                <span>{new Date(order.createdAt).toLocaleString()}</span>
                <span className="uppercase">{order.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
