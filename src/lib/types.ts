import type { Post, Trend } from './schemas';

export type SortDirection = 'asc' | 'desc' | null;
export type Platform = 'instagram' | 'tiktok';

export type PostSortField =
  | 'likes'
  | 'comments'
  | 'shares'
  | 'engagement_rate'
  | 'posted_at'
  | null;

export type AnalyticsSummary = {
  totalEngagement: number;
  avgEngagementRate: number;
  topPost: Post | null;
  trend: Trend;
};

export type {
  DailyMetric,
  DailyMetricsResponse,
  TimeRange,
  TrendDirection,
} from './schemas';
