import { Suspense } from 'react';

import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-white/60">Loading admin dashboard...</p>}>
      <AdminDashboard />
    </Suspense>
  );
}
