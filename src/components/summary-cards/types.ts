import { Post } from '@/lib/types';

export type TrendDirection = 'up' | 'down';

export type Trend = {
  value: number;
  direction: TrendDirection;
};

export type AnalyticsSummary = {
  totalEngagement: number;
  avgEngagementRate: number;
  topPost: Post | null;
  trend: Trend;
};
