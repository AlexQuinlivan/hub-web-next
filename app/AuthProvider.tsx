'use client';

import {SessionProvider} from 'next-auth/react';
import {ReactNode} from 'react';

export default function AuthProvider({children}: { children: ReactNode }) {
  return (
    <SessionProvider
      // Refetch the session every 5 minutes to avoid stale credentials
      refetchInterval={process.env.NEXT_PUBLIC_REFRESH_SESSION_INTERVAL_SEC as unknown as number}>

      {children}
    </SessionProvider>
  );
}
