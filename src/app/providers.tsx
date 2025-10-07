'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query Provider
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분간 캐시 유지
            gcTime: 5 * 60 * 1000, // 5분간 가비지 컬렉션 유지 (cacheTime 대체)
            retry: 1, // 실패 시 1번만 재시도
            refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
