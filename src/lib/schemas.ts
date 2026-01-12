import { z } from 'zod';

export const timeRangeSchema = z.enum([
  'week',
  'month',
  'quarter',
  'year',
  'all',
]);

export const dailyMetricRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  date: z.string(),
  engagement: z.number().nullable(),
  reach: z.number().nullable(),
  created_at: z.string().nullable(),
});

export const dailyMetricSchema = dailyMetricRowSchema.pick({
  date: true,
  engagement: true,
  reach: true,
});

export const postSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  platform: z.string(),
  media_type: z.string(),
  posted_at: z.string(),
  caption: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  permalink: z.string().nullable(),
  likes: z.number().nullable(),
  comments: z.number().nullable(),
  shares: z.number().nullable(),
  saves: z.number().nullable(),
  reach: z.number().nullable(),
  impressions: z.number().nullable(),
  engagement_rate: z.number().nullable(),
  created_at: z.string().nullable(),
});

export const postsResponseSchema = z.array(postSchema);
export const dailyMetricsResponseSchema = z.array(dailyMetricSchema);
export const dailyMetricRowsSchema = z.array(dailyMetricRowSchema);

export const trendDirectionSchema = z.enum(['up', 'down']);

export const trendSchema = z.object({
  value: z.number(),
  direction: trendDirectionSchema,
});

export type TimeRange = z.infer<typeof timeRangeSchema>;
export type DailyMetricRow = z.infer<typeof dailyMetricRowSchema>;
export type DailyMetric = z.infer<typeof dailyMetricSchema>;
export type DailyMetricsResponse = z.infer<typeof dailyMetricsResponseSchema>;
export type Post = z.infer<typeof postSchema>;
export type TrendDirection = z.infer<typeof trendDirectionSchema>;
export type Trend = z.infer<typeof trendSchema>;
