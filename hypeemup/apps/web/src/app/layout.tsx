import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/layout/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HypeEmUp | Custom 3D-Printed Chains',
  description: 'Design hype chains with the HypeEmUp builder and shop curated accessories.',
  metadataBase: new URL('https://hypeemup.com'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className + ' flex min-h-screen flex-col bg-brand-navy'}>
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
