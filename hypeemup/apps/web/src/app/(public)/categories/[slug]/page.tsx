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

interface CategoryResponse {
  category: {
    name: string;
    description?: string;
    products: ProductSummary[];
  };
}

async function getCategory(slug: string): Promise<CategoryResponse['category'] | null> {
  try {
    const data = await apiFetch<CategoryResponse>(`/categories/${slug}`);
    return data.category;
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug);
  if (!category) notFound();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{category.name}</h1>
        {category.description ? <p className="text-sm text-white/60">{category.description}</p> : null}
      </header>
      <ProductGrid
        products={category.products.map((product) => ({
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
