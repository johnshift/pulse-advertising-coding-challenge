import { useQuery } from '@tanstack/react-query';

export const useDailyMetrics = () => {
  return useQuery({
    queryKey: ['analytics', 'daily'],
    queryFn: async () => {
      const res = await fetch('/api/metrics/daily');
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    },
  });
};
