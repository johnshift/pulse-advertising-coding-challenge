'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SummaryCardsLoading = () => {
  return (
    <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
      <Card className='relative overflow-hidden'>
        <div className='absolute top-4 right-4'>
          <Skeleton className='size-9 rounded-lg' />
        </div>
        <CardHeader>
          <Skeleton className='h-7 w-36' />
        </CardHeader>
        <CardContent className='space-y-3'>
          <Skeleton className='h-10 w-24' />
          <div className='flex items-center gap-1.5'>
            <Skeleton className='size-4' />
            <Skeleton className='h-5 w-12' />
            <Skeleton className='h-5 w-24' />
          </div>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden'>
        <div className='absolute top-4 right-4'>
          <Skeleton className='size-9 rounded-lg' />
        </div>
        <CardHeader>
          <Skeleton className='h-7 w-44' />
        </CardHeader>
        <CardContent className='space-y-3'>
          <Skeleton className='h-10 w-24' />
          <div className='flex items-center gap-1.5'>
            <Skeleton className='size-4' />
            <Skeleton className='h-5 w-12' />
            <Skeleton className='h-5 w-24' />
          </div>
        </CardContent>
      </Card>

      <Card className='relative overflow-hidden md:col-span-2 lg:col-span-1 lg:gap-4'>
        <div className='absolute top-4 right-4'>
          <Skeleton className='size-9 rounded-lg' />
        </div>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='size-4' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4'>
            <Skeleton className='size-20 shrink-0 rounded-lg' />
            <div className='min-w-0 flex-1'>
              <Skeleton className='h-[32px] w-full' />
              <div className='mt-2.5 flex flex-wrap gap-3'>
                <Skeleton className='h-4 w-10' />
                <Skeleton className='h-4 w-10' />
                <Skeleton className='h-4 w-10' />
              </div>
              <Skeleton className='mt-2 h-4 w-36' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type SummaryCardsEmptyProps = {
  message?: string;
};

export const SummaryCardsEmpty = ({
  message = "There isn't enough data yet to show your performance summary.",
}: SummaryCardsEmptyProps) => {
  return (
    <div className='flex h-32 items-center justify-center overflow-hidden rounded-md border p-4'>
      <p className='text-center text-muted-foreground'>{message}</p>
    </div>
  );
};

type SummaryCardsErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export const SummaryCardsError = ({
  message = "We couldn't load your summary right now.",
  onRetry,
}: SummaryCardsErrorProps) => {
  return (
    <div className='flex h-32 flex-col items-center justify-center gap-4 overflow-hidden rounded-md border p-4'>
      <p className='text-center text-muted-foreground'>{message}</p>
      {onRetry && (
        <Button variant='outline' onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
