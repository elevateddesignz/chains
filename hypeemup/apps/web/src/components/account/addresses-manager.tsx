'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

import { apiFetch } from '@/lib/api-client';

interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  isDefault: boolean;
}

const fetcher = (path: string) => apiFetch<{ addresses: Address[] }>(path);

export function AddressesManager() {
  const { data, error } = useSWR('/account/addresses', fetcher, { suspense: true });
  const [saving, setSaving] = useState(false);

  if (error) {
    return <p className="text-red-400">Failed to load addresses.</p>;
  }

  const addresses = data?.addresses ?? [];

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await apiFetch(`/account/addresses/${id}`, { method: 'DELETE' });
      await mutate('/account/addresses');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Addresses</h1>
        <p className="text-sm text-white/60">Manage your shipping destinations and defaults.</p>
      </div>
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-sm text-white/60">No saved addresses yet.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{address.label}</p>
                  <p>{address.line1}</p>
                  {address.line2 ? <p>{address.line2}</p> : null}
                  <p>
                    {address.city}, {address.state} {address.postal}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="space-y-2 text-xs text-white/60">
                  {address.isDefault ? <span className="rounded-full border border-brand-orange px-2 py-1 text-brand-orange">Default</span> : null}
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    disabled={saving}
                    className="block rounded-full border border-white/20 px-3 py-1 uppercase tracking-wider text-white/60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
