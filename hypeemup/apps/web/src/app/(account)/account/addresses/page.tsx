import { Suspense } from 'react';

import { AddressesManager } from '@/components/account/addresses-manager';

export default function AddressesPage() {
  return (
    <Suspense fallback={<p className="text-white/60">Loading addresses...</p>}>
      <AddressesManager />
    </Suspense>
  );
}
