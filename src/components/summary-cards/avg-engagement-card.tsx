'use client';

import { Percent, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Trend } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AvgEngagementCardProps = {
  avgEngagementRate: number;
  trend: Trend;
};

export const AvgEngagementCard = ({
  avgEngagementRate,
  trend,
}: AvgEngagementCardProps) => {
  const isPositive = trend.direction === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className='relative overflow-hidden border-chart-2/20 bg-linear-to-br from-card to-chart-2/5'>
      <div className='absolute top-4 right-4 rounded-lg bg-chart-3/10 p-2'>
        <Percent className='size-5 text-chart-3' aria-hidden='true' />
      </div>
      <CardHeader>
        <p className='text-lg font-bold text-white/80'>Avg. Engagement Rate</p>
      </CardHeader>
      <CardContent className='space-y-3'>
        <CardTitle className='text-4xl font-bold tracking-tight'>
          {avgEngagementRate.toFixed(2)}%
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
