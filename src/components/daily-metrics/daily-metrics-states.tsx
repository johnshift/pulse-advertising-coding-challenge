'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const DailyMetricsLoading = () => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-4'>
        <Skeleton className='h-9 w-32' />
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-24' />
          <Skeleton className='h-9 w-24' />
        </div>
      </div>
      <Skeleton className='h-[300px] w-full' />
    </div>
  );
};

type DailyMetricsEmptyProps = {
  message?: string;
};

export const DailyMetricsEmpty = ({
  message = 'No daily metrics available for this period.',
}: DailyMetricsEmptyProps) => {
  return (
    <div className='flex h-[300px] items-center justify-center'>
      <p className='text-muted-foreground'>{message}</p>
    </div>
  );
};

type DailyMetricsErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export const DailyMetricsError = ({
  message = "We couldn't load your daily metrics right now.",
  onRetry,
}: DailyMetricsErrorProps) => {
  return (
    <div className='flex h-[300px] flex-col items-center justify-center gap-4'>
      <p className='text-muted-foreground'>{message}</p>
      {onRetry && (
        <Button variant='outline' onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
