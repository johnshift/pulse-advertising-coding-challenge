'use client';

import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Trend } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

type TotalEngagementCardProps = {
  totalEngagement: number;
  trend: Trend;
};

export const TotalEngagementCard = ({
  totalEngagement,
  trend,
}: TotalEngagementCardProps) => {
  const isPositive = trend.direction === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className='relative overflow-hidden border-chart-1/20 bg-linear-to-br from-card to-chart-1/5'>
      <div className='absolute top-4 right-4 rounded-lg bg-chart-1/10 p-2'>
        <Activity className='size-5 text-chart-1' aria-hidden='true' />
      </div>
      <CardHeader>
        <p className='text-lg font-bold text-white/80'>Total Engagement</p>
      </CardHeader>
      <CardContent className='space-y-3'>
        <CardTitle className='text-4xl font-bold tracking-tight'>
          {formatNumber(totalEngagement)}
        </CardTitle>
        <div
          className={cn(
            'flex items-center gap-1.5 text-sm',
            isPositive ? 'text-emerald-500' : 'text-rose-500',
          )}
        >
          <TrendIcon className='size-4' aria-hidden='true' />
          <span className='font-medium'>
            {isPositive ? '+' : ''}
            {trend.value}%
          </span>
          <span className='text-muted-foreground'>vs last 30 days</span>
        </div>
      </CardContent>
    </Card>
  );
};
