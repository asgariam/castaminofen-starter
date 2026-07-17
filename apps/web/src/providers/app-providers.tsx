'use client';

import { ReactQueryProvider } from '@/providers/react-query-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
