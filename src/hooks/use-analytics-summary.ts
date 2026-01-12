import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

export const useAnalyticsSummary = () => {
  return useQuery({
    ...queryKeys.analytics.summary,
    queryFn: async () => {
      const res = await fetch('/api/analytics/summary');
      if (!res.ok) throw new Error('Failed to fetch summary');
      return res.json();
    },
  });
};
