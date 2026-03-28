import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type LibraryQueryProviderProps = {
  children: React.ReactNode;
};

export function LibraryQueryProvider({ children }: LibraryQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 60_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

LibraryQueryProvider.displayName = "LibraryQueryProvider";

export default LibraryQueryProvider;
