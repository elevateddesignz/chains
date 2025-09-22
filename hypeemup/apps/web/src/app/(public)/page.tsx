import Link from 'next/link';

import { ProductGrid } from '@/components/layout/product-grid';
import { apiFetch } from '@/lib/api-client';

interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
}

async function getFeaturedProducts(): Promise<ProductSummary[]> {
  try {
    const response = await apiFetch<{ products: ProductSummary[] }>('/products?featured=true', {
      next: { revalidate: 60 },
    } as unknown as RequestInit);
    return response.products;
  } catch (error) {
    console.error('Failed to fetch featured products', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-3xl bg-gradient-to-br from-brand-slate/90 to-black/60 p-12">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/60">
            Custom 3D-printed hype chains
          </span>
          <h1 className="text-4xl font-black text-white md:text-5xl">
            Design a signature chain that amplifies your energy.
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            HypeEmUp turns your logo, text, or artwork into premium 3D-printed chains and accessories with Detroit-inspired style.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/builder"
              className="rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black shadow-lg"
            >
              Launch builder
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white/80 hover:border-brand-orange hover:text-brand-orange"
            >
              Browse shop
            </Link>
          </div>
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Featured drops</h2>
          <Link href="/shop" className="text-sm text-brand-orange hover:underline">
            View all
          </Link>
        </div>
        {products.length > 0 ? (
          <ProductGrid
            products={products.map((product) => ({
              slug: product.slug,
              name: product.name,
              description: product.description,
              price: product.basePrice,
              image: product.images[0],
            }))}
          />
        ) : (
          <p className="text-sm text-white/60">No featured products yet.</p>
        )}
      </section>
    </div>
  );
}
