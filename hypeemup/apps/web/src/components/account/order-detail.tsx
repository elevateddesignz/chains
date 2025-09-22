'use client';

import useSWR from 'swr';

import { apiFetch } from '@/lib/api-client';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShipmentEvent {
  description: string;
  occurredAt: string;
  location?: string;
}

interface OrderDetailResponse {
  order: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
  };
  shipment?: {
    carrier: string;
    trackingNumber: string;
    trackingUrl: string;
    status: string;
    events: ShipmentEvent[];
  };
}

const fetcher = (path: string) => apiFetch<OrderDetailResponse>(path);

export function OrderDetail({ orderId }: { orderId: string }) {
  const { data, error } = useSWR(`/account/orders/${orderId}`, fetcher, { suspense: true });

  if (error) {
    return <p className="text-red-400">Unable to load order.</p>;
  }

  if (!data) return null;

  const { order, shipment } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Order #{order.id.slice(-8)}</h1>
          <p className="text-sm text-white/60">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/70">
          {order.status}
        </span>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
        <h3 className="text-white">Items</h3>
        <ul className="mt-3 space-y-2">
          {order.items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center justify-between">
              <span>
                {item.name} <span className="text-xs text-white/40">×{item.quantity}</span>
              </span>
              <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-white">
          <span>Total</span>
          <span>${(order.total / 100).toFixed(2)}</span>
        </div>
      </div>
      {shipment ? (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
          <h3 className="text-white">Shipment</h3>
          <p className="text-xs text-white/50">
            {shipment.carrier} • <a href={shipment.trackingUrl} className="text-brand-orange underline">{shipment.trackingNumber}</a>
          </p>
          <ul className="mt-4 space-y-3">
            {shipment.events.map((event, index) => (
              <li key={index} className="rounded-xl border border-white/10 bg-black/40 p-3">
                <p className="text-white/80">{event.description}</p>
                <p className="text-xs text-white/50">
                  {event.location ? `${event.location} • ` : ''}
                  {new Date(event.occurredAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
