import { ProductGrid } from '@/components/layout/product-grid';
import { apiFetch } from '@/lib/api-client';

interface ProductSummary {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
}

async function getProducts(): Promise<ProductSummary[]> {
  try {
    const data = await apiFetch<{ products: ProductSummary[] }>('/products');
    return data.products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Shop chains & accessories</h1>
          <p className="text-sm text-white/60">Filter by collections and categories to find your next hype upgrade.</p>
        </div>
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
        <p className="text-sm text-white/60">No products available. Check back soon!</p>
      )}
    </div>
  );
}
