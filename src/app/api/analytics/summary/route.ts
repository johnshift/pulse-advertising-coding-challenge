import { dailyMetricRowsSchema, postsResponseSchema } from '@/lib/schemas';
import type { AnalyticsSummary } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabase = await createClient();

  // Auth Check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // We fetch raw data here to aggregate in JS.
  const [postsResponse, metricsResponse] = await Promise.all([
    supabase.from('posts').select('*').eq('user_id', user.id),

    supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(60), // Fetch last 60 days to calculate trends (30 vs 30)
  ]);

  if (postsResponse.error) {
    console.error('Posts query error:', postsResponse.error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }

  if (metricsResponse.error) {
    console.error('Metrics query error:', metricsResponse.error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }

  const postsValidation = postsResponseSchema.safeParse(postsResponse.data);
  if (!postsValidation.success) {
    console.error('Posts schema validation error:', postsValidation.error);
    return NextResponse.json(
      { error: 'Data validation failed' },
      { status: 500 },
    );
  }

  const metricsValidation = dailyMetricRowsSchema.safeParse(
    metricsResponse.data,
  );
  if (!metricsValidation.success) {
    console.error('Metrics schema validation error:', metricsValidation.error);
    return NextResponse.json(
      { error: 'Data validation failed' },
      { status: 500 },
    );
  }

  const posts = postsValidation.data;
  const metrics = metricsValidation.data;

  // Total Engagement (Sum of interactions on posts)
  const totalEngagement = posts.reduce(
    (acc, post) =>
      acc + ((post.likes ?? 0) + (post.comments ?? 0) + (post.shares ?? 0)),
    0,
  );

  // Average Engagement Rate
  const avgEngagementRate =
    posts.length > 0
      ? posts.reduce((acc, post) => acc + (post.engagement_rate ?? 0), 0) /
        posts.length
      : 0;

  // Top Performing Post
  // Sort by total interactions (likes + comments + shares)
  const sortedPosts = [...posts].sort(
    (a, b) =>
      (b.likes ?? 0) +
      (b.comments ?? 0) +
      (b.shares ?? 0) -
      ((a.likes ?? 0) + (a.comments ?? 0) + (a.shares ?? 0)),
  );
  const topPost = sortedPosts[0] || null;

  // Trend Calculation (Last 30 days vs Previous 30 days)
  // We use daily_metrics for this as it's cleaner time-series data
  const currentPeriod = metrics.slice(0, 30);
  const previousPeriod = metrics.slice(30, 60);

  const currentSum = currentPeriod.reduce(
    (acc, m) => acc + (m.engagement ?? 0),
    0,
  );
  const previousSum = previousPeriod.reduce(
    (acc, m) => acc + (m.engagement ?? 0),
    0,
  );

  // Prevent division by zero
  const trendPercentage =
    previousSum === 0
      ? currentSum > 0
        ? 100
        : 0
      : ((currentSum - previousSum) / previousSum) * 100;

  // Return Computed Data
  const response: AnalyticsSummary = {
    totalEngagement,
    avgEngagementRate: parseFloat(avgEngagementRate.toFixed(2)),
    topPost,
    trend: {
      value: parseFloat(trendPercentage.toFixed(1)),
      direction: trendPercentage >= 0 ? 'up' : 'down',
    },
  };

  return NextResponse.json(response);
};
