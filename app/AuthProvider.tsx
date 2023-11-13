'use client';

import {SessionProvider} from 'next-auth/react';
import {ReactNode} from 'react';

export default function NextAuthProvider(
  {
    children,
  }: {
    children: ReactNode;
  }) {
  return (
    <SessionProvider
      // Refetch the session every 5 minutes to avoid stale credentials
      refetchInterval={10}>
      {children}
    </SessionProvider>
  );
}
