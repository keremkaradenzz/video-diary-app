import { QueryClient } from '@tanstack/react-query';

// All data is local (SQLite, files) and only changes through our own mutations, which invalidate
// the affected queries. So nothing needs refetching on mount/focus, and retrying a local failure
// only delays the error.
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity, retry: false } },
});
