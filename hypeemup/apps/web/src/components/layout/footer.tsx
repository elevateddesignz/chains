import Link from 'next/link';

import { Route } from '@/types/routes';

const FOOTER_LINKS: Array<{ label: string; href: Route }> = [
  { label: 'Privacy', href: '/pages/privacy' },
  { label: 'Terms', href: '/pages/terms' },
  { label: 'Shipping', href: '/pages/shipping' },
  { label: 'Returns', href: '/pages/returns' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between md:px-8">
        <p>&copy; {new Date().getFullYear()} HypeEmUp. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-brand-orange">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
