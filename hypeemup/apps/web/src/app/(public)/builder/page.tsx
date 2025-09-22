import { BuilderCanvas } from '@/components/builder/builder-canvas';
import { ImageUploader } from '@/components/builder/image-uploader';
import { OptionsPanel } from '@/components/builder/options-panel';
import { PriceBreakdown } from '@/components/builder/price-breakdown';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

export default function BuilderPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <BuilderCanvas />
        <PriceBreakdown />
      </div>
      <div className="space-y-6">
        <OptionsPanel />
        <ImageUploader />
        <AddToCartButton />
      </div>
    </div>
  );
}
