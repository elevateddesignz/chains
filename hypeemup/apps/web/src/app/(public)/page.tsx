import Image from 'next/image';
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

interface HeroPolaroid {
  src: string;
  alt: string;
  caption: string;
  className: string;
}

const HERO_POLAROIDS: HeroPolaroid[] = [
  {
    src: '/images/polaroids/polaroid-1.jpg',
    alt: 'Two fans holding Breezy Bowl chains.',
    caption: 'Breezy Bowl hype',
    className: 'left-2 top-2 -rotate-6 sm:left-6',
  },
  {
    src: '/images/polaroids/polaroid-2.jpg',
    alt: 'Mirror selfie showing custom Breezy Bowl chain.',
    caption: 'Custom looks',
    className: 'right-4 top-[18%] rotate-3 sm:right-10',
  },
  {
    src: '/images/polaroids/polaroid-3.jpg',
    alt: 'Fan at the stadium wearing a Team Breezy chain.',
    caption: 'In the crowd',
    className: 'left-[18%] bottom-6 rotate-6 sm:left-[22%]',
  },
  {
    src: '/images/polaroids/polaroid-4.jpg',
    alt: 'Graduate wearing a custom Class of 2025 chain.',
    caption: 'Milestone moments',
    className: 'right-6 bottom-1 -rotate-2 sm:right-10',
  },
];

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
      <section className="grid gap-10 rounded-3xl bg-gradient-to-br from-brand-slate/90 to-black/60 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
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
        <div className="flex justify-center lg:justify-end">
          <div className="relative mt-4 h-[320px] w-[240px] sm:mt-0 sm:h-[380px] sm:w-[300px]">
            {HERO_POLAROIDS.map((polaroid) => (
              <div
                key={polaroid.src}
                className={`absolute flex w-40 flex-col items-center rounded-md border border-slate-200/70 bg-white px-3 pb-6 pt-3 text-center shadow-[0_18px_45px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(15,23,42,0.6)] sm:w-48 ${polaroid.className}`}
              >
                <div className="relative h-36 w-full overflow-hidden rounded-sm sm:h-44">
                  <Image
                    src={polaroid.src}
                    alt={polaroid.alt}
                    fill
                    sizes="(min-width: 1024px) 12rem, 8rem"
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="mt-4 text-xs font-semibold uppercase tracking-[0.18rem] text-slate-500">
                  {polaroid.caption}
                </span>
              </div>
            ))}
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
