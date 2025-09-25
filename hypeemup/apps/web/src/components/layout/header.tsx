'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Route } from '@/types/routes';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CartSheet } from '@/components/cart/cart-sheet';

const NAV_LINKS: Array<{ label: string; href: Route }> = [
  { label: 'Home', href: '/' },
  { label: 'Builder', href: '/builder' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'FAQs', href: '/pages/faqs' },
];

export function Header() {
  const pathname = usePathname();
  const activeHref = useMemo(() => pathname ?? '/', [pathname]);

  return (
    <header className="border-b border-white/10 bg-brand-slate/40 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="HypeEmUp"
            width={512}
            height={512}
            className="h-10 w-auto"
            priority
          />
          <span className="sr-only">HypeEmUp</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-brand-orange ${
                activeHref.startsWith(link.href) ? 'text-brand-orange' : 'text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CartSheet />
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-white/80 transition hover:border-brand-orange hover:text-brand-orange"
          >
            Account
          </Link>
        </div>
      </div>
    </header>
  );
}
