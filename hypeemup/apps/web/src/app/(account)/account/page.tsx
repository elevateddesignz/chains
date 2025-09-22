import { Suspense } from 'react';

import { AccountOverview } from '@/components/account/account-overview';

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="text-white/60">Loading account...</p>}>
      <AccountOverview />
    </Suspense>
  );
}
