'use client';

import * as Toast from '@radix-ui/react-toast';
import { ReactNode } from 'react';

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2" />
    </Toast.Provider>
  );
}

export function useToast() {
  const open = (title: string, description?: string) => {
    const toast = document.createElement('div');
    document.body.appendChild(toast);
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 5000);
    console.info('[toast]', title, description);
  };

  return { open };
}
