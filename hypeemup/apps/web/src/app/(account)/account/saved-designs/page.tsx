import { Suspense } from 'react';

import { SavedDesigns } from '@/components/account/saved-designs';

export default function SavedDesignsPage() {
  return (
    <Suspense fallback={<p className="text-white/60">Loading saved designs...</p>}>
      <SavedDesigns />
    </Suspense>
  );
}
