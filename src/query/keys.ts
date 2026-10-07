/** TanStack Query keys for the videos table, shared by every hook that reads or patches it. */
export const videoKeys = {
  all: ['videos'] as const,
  list: ['videos', 'list'] as const,
  count: ['videos', 'count'] as const,
  one: (id: number) => ['videos', id] as const,
};
