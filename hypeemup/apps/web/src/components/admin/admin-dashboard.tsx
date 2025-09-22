'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { apiFetch } from '@/lib/api-client';

interface AdminDashboardResponse {
  stats: {
    ordersToday: number;
    revenueToday: number;
    openTickets: number;
    liveChats: number;
  };
  latestOrders: Array<{
    id: string;
    customer: string;
    total: number;
    status: string;
  }>;
  openSessions: Array<{
    id: string;
    customer?: string;
    status: string;
  }>;
}

const fetcher = (path: string) => apiFetch<AdminDashboardResponse>(path);

export function AdminDashboard() {
  const { data, error } = useSWR('/admin/dashboard', fetcher, { suspense: true });

  if (error) {
    return <p className="text-red-400">Failed to load dashboard.</p>;
  }

  if (!data) return null;

  const { stats, latestOrders, openSessions } = data;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap gap-4">
        <StatCard label="Orders today" value={stats.ordersToday.toString()} />
        <StatCard label="Revenue today" value={`$${(stats.revenueToday / 100).toFixed(2)}`} />
        <StatCard label="Open tickets" value={stats.openTickets.toString()} />
        <StatCard label="Live chats" value={stats.liveChats.toString()} />
      </header>
      <section className="rounded-2xl border border-white/10 bg-black/30 p-6">
        <div className="flex items-center justify-between text-sm text-white">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-brand-orange hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          {latestOrders.map((order) => (
            <li key={order.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3">
              <div>
                <p className="text-white">#{order.id.slice(-6)}</p>
                <p className="text-xs text-white/50">{order.customer}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-brand-orange">${(order.total / 100).toFixed(2)}</p>
                <p className="text-xs uppercase text-white/50">{order.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl border border-white/10 bg-black/30 p-6">
        <div className="flex items-center justify-between text-sm text-white">
          <h2 className="text-lg font-semibold">Live chat sessions</h2>
          <Link href="/admin/inbox" className="text-brand-orange hover:underline">
            Open inbox
          </Link>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          {openSessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3">
              <div>
                <p className="text-white">Session #{session.id.slice(-6)}</p>
                <p className="text-xs text-white/50">{session.customer ?? 'Guest'}</p>
              </div>
              <span className="text-xs uppercase text-white/50">{session.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-[160px] rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
