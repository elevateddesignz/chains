import Image from 'next/image';
import Link from 'next/link';

import { Route } from '@/types/routes';

export interface ProductCardProps {
  slug: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export function ProductCard({ slug, name, description, price, image }: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}` as Route}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-brand-orange"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-black/60">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/40">No image</div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-white/60 line-clamp-3">{description}</p>
        <span className="text-sm font-semibold text-brand-orange">${(price / 100).toFixed(2)}</span>
      </div>
    </Link>
  );
}
