import { Suspense } from 'react';

import { OrdersList } from '@/components/account/orders-list';

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-white/60">Loading orders...</p>}>
      <OrdersList />
    </Suspense>
  );
}
