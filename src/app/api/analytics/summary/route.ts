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

  try {
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

    if (postsResponse.error) throw postsResponse.error;
    if (metricsResponse.error) throw metricsResponse.error;

    const posts = postsResponse.data || [];
    const metrics = metricsResponse.data || [];

    // Total Engagement (Sum of interactions on posts)
    const totalEngagement = posts.reduce(
      (acc, post) => acc + (post.likes + post.comments + post.shares),
      0,
    );

    // Average Engagement Rate
    const avgEngagementRate =
      posts.length > 0
        ? posts.reduce((acc, post) => acc + Number(post.engagement_rate), 0) /
          posts.length
        : 0;

    // Top Performing Post
    // Sort by total interactions (likes + comments + shares)
    const sortedPosts = [...posts].sort(
      (a, b) =>
        b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares),
    );
    const topPost = sortedPosts[0] || null;

    // Trend Calculation (Last 30 days vs Previous 30 days)
    // We use daily_metrics for this as it's cleaner time-series data
    const currentPeriod = metrics.slice(0, 30);
    const previousPeriod = metrics.slice(30, 60);

    const currentSum = currentPeriod.reduce((acc, m) => acc + m.engagement, 0);
    const previousSum = previousPeriod.reduce(
      (acc, m) => acc + m.engagement,
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
    return NextResponse.json({
      totalEngagement,
      avgEngagementRate: parseFloat(avgEngagementRate.toFixed(2)),
      topPost,
      trend: {
        value: parseFloat(trendPercentage.toFixed(1)),
        direction: trendPercentage >= 0 ? 'up' : 'down',
      },
    });
  } catch (error) {
    console.error('Aggregation Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
