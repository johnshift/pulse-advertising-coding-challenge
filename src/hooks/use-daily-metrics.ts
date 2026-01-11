import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { TimeRange } from '@/components/daily-metrics/types';

export const useDailyMetrics = (timeRange: TimeRange) => {
  return useQuery({
    queryKey: ['analytics', 'daily', timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/metrics/daily?range=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    },
    placeholderData: keepPreviousData,
  });
};
