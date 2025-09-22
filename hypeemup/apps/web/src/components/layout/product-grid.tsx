import { ProductCard, ProductCardProps } from './product-card';

export function ProductGrid({ products }: { products: ProductCardProps[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} {...product} />
      ))}
    </div>
  );
}
