'use client';

import useSWR, { mutate } from 'swr';

import { apiFetch } from '@/lib/api-client';

interface SavedDesign {
  id: string;
  name: string;
  previewKey: string;
  createdAt: string;
}

const fetcher = (path: string) => apiFetch<{ designs: SavedDesign[] }>(path);

export function SavedDesigns() {
  const { data, error } = useSWR('/account/saved-designs', fetcher, { suspense: true });

  if (error) {
    return <p className="text-red-400">Unable to load designs.</p>;
  }

  const designs = data?.designs ?? [];

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/account/saved-designs/${id}`, { method: 'DELETE' });
      await mutate('/account/saved-designs');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Saved designs</h1>
      {designs.length === 0 ? (
        <p className="text-sm text-white/60">No saved designs yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {designs.map((design) => (
            <li key={design.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white">{design.name}</p>
                  <p className="text-xs text-white/50">Saved {new Date(design.createdAt).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(design.id)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/50"
                >
                  Delete
                </button>
              </div>
              <p className="mt-3 text-xs text-white/40">Preview asset: {design.previewKey}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
