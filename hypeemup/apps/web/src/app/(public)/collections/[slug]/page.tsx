import { notFound } from 'next/navigation';

import { ProductGrid } from '@/components/layout/product-grid';
import { apiFetch } from '@/lib/api-client';

interface ProductSummary {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
}

interface CollectionResponse {
  collection: {
    name: string;
    description?: string;
    products: ProductSummary[];
  };
}

async function getCollection(slug: string): Promise<CollectionResponse['collection'] | null> {
  try {
    const data = await apiFetch<CollectionResponse>(`/collections/${slug}`);
    return data.collection;
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface CollectionPageProps {
  params: { slug: string };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollection(params.slug);
  if (!collection) notFound();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
        {collection.description ? <p className="text-sm text-white/60">{collection.description}</p> : null}
      </header>
      <ProductGrid
        products={collection.products.map((product) => ({
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.basePrice,
          image: product.images[0],
        }))}
      />
    </div>
  );
}
