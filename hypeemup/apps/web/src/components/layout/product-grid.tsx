import React from 'react';

type Item = { id: string; name: string; href?: string; price?: string };

export function ProductGrid({ items = [] as Item[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <a key={p.id} href={p.href ?? '#'} className="block rounded-xl border p-4 hover:shadow">
          <div className="font-medium">{p.name}</div>
          {p.price ? <div className="text-sm opacity-70">{p.price}</div> : null}
        </a>
      ))}
    </div>
  );
}
