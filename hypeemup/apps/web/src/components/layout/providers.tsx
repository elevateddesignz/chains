'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

import { ToastProvider } from '@/components/ui/toast-provider';
import { ChatWidget } from '@/components/chat/chat-widget';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <ToastProvider>{children}</ToastProvider>
      <ChatWidget />
    </ThemeProvider>
  );
}
