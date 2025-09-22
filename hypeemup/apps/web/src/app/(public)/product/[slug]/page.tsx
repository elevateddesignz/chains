import { Metadata } from 'next';
import Image from 'next/image';

import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { apiFetch } from '@/lib/api-client';

interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  options: Record<string, unknown>;
}

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const data = await apiFetch<{ product: ProductDetail }>(`/products/${slug}`);
    return data.product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product not found - HypeEmUp' };
  return {
    title: `${product.name} - HypeEmUp`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    return <p className="text-white/70">Product not found.</p>;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative h-96 w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/40">No image</div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-white/70">
          <h3 className="text-lg font-semibold text-white">Customization options</h3>
          <pre className="mt-3 overflow-x-auto text-xs text-white/50">
            {JSON.stringify(product.options, null, 2)}
          </pre>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <p className="mt-2 text-lg text-brand-orange">${(product.basePrice / 100).toFixed(2)}</p>
        </div>
        <p className="text-white/70">{product.description}</p>
        <AddToCartButton />
      </div>
    </div>
  );
}
