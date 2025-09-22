import Link from 'next/link';
import { ReactNode } from 'react';

import { Route } from '@/types/routes';

const links = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/saved-designs', label: 'Saved designs' },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
        <h2 className="text-lg font-semibold text-white">Account</h2>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href as Route} className="transition hover:text-brand-orange">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
