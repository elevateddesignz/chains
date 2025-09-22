import Link from 'next/link';

import { apiFetch } from '@/lib/api-client';
import { Route } from '@/types/routes';

interface CollectionSummary {
  slug: string;
  name: string;
  description?: string;
}

async function getCollections(): Promise<CollectionSummary[]> {
  try {
    const data = await apiFetch<{ collections: CollectionSummary[] }>('/collections');
    return data.collections;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Collections</h1>
        <p className="text-sm text-white/60">Curated drops from our hype lab.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}` as Route}
            className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white transition hover:border-brand-orange"
          >
            <h2 className="text-xl font-semibold">{collection.name}</h2>
            {collection.description ? <p className="mt-2 text-sm text-white/60">{collection.description}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
