import { Suspense } from 'react';

import { OrderDetail } from '@/components/account/order-detail';

interface OrderDetailPageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <Suspense fallback={<p className="text-white/60">Loading order...</p>}>
      <OrderDetail orderId={params.id} />
    </Suspense>
  );
}
