import {
  createQueryKeys,
  mergeQueryKeys,
} from '@lukemorales/query-key-factory';

import type { Platform, PostSortField, SortDirection } from '@/lib/types';
import type { TimeRange } from '@/components/daily-metrics/types';

export const posts = createQueryKeys('posts', {
  list: (filters: {
    page: number;
    pageSize: number;
    sortField: PostSortField;
    sortDirection: SortDirection;
    platform: Platform | null;
  }) => ({
    queryKey: [filters],
  }),
});

export const analytics = createQueryKeys('analytics', {
  summary: null,
  daily: (timeRange: TimeRange) => [timeRange],
});

export const queryKeys = mergeQueryKeys(posts, analytics);
