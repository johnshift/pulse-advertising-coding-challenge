export type DailyMetric = {
  date: string;
  engagement: number;
  reach: number;
};

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

export type MetricKey = 'engagement' | 'reach';

export type MetricSelection = 'all' | 'engagement' | 'reach';

export type ChartType = 'line' | 'area';
