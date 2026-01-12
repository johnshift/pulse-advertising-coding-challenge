import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { TimeRange } from '@/components/daily-metrics/types';
import { queryKeys } from '@/lib/query-keys';

export const useDailyMetrics = (timeRange: TimeRange) => {
  return useQuery({
    ...queryKeys.analytics.daily(timeRange),
    queryFn: async () => {
      const res = await fetch(`/api/metrics/daily?range=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    },
    placeholderData: keepPreviousData,
  });
};
