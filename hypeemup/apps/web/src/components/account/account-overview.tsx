'use client';

import useSWR from 'swr';

import { apiFetch } from '@/lib/api-client';

type OrderSummary = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
};

type AccountResponse = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  orders: OrderSummary[];
};

const fetcher = (path: string) => apiFetch<AccountResponse>(path);

export function AccountOverview() {
  const { data, error } = useSWR('/account/overview', fetcher, { suspense: true });

  if (error) {
    return <p className="text-red-400">Unable to load account.</p>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white">
        <h2 className="text-lg font-semibold">Welcome back, {data.user.firstName}</h2>
        <p className="text-sm text-white/60">Manage your orders, saved designs, and shipping details.</p>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-white/60">Recent orders</h3>
        {data.orders.length === 0 ? (
          <p className="text-sm text-white/60">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {data.orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span>#{order.id.slice(-6)}</span>
                  <span className="font-semibold text-brand-orange">${(order.total / 100).toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="uppercase">{order.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
