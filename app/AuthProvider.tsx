'use client';

import {SessionProvider} from 'next-auth/react';
import {ReactNode} from 'react';

// 5 minute session interval check
const REFRESH_SESSION_INTERVAL_SEC = (5 * 60)

export default function AuthProvider({children}: { children: ReactNode }) {
  return (
    <SessionProvider
      // Refetch the session every 5 minutes to avoid stale credentials
      refetchInterval={REFRESH_SESSION_INTERVAL_SEC}>

      {children}
    </SessionProvider>
  );
}
