'use client';

import { ReactNode } from 'react';

import { useAnalyticsSummary } from '@/hooks/use-analytics-summary';

import { AvgEngagementCard } from './avg-engagement-card';
import {
  SummaryCardsEmpty,
  SummaryCardsError,
  SummaryCardsLoading,
} from './summary-cards-states';
import { TopPostCard, TopPostCardEmpty } from './top-post-card';
import { TotalEngagementCard } from './total-engagement-card';
import { AnalyticsSummary } from './types';

const SummaryCardsWrapper = ({ children }: { children: ReactNode }) => (
  <div className='w-full space-y-6'>
    <div>
      <h2 className='text-2xl font-bold tracking-tight'>Overview</h2>
      <p className='mt-1 text-sm text-muted-foreground'>
        Your performance snapshot at a glance
      </p>
    </div>
    {children}
  </div>
);

export const SummaryCards = () => {
  const { data, isLoading, isError, refetch } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <SummaryCardsWrapper>
        <SummaryCardsLoading />
      </SummaryCardsWrapper>
    );
  }

  if (isError) {
    return (
      <SummaryCardsWrapper>
        <SummaryCardsError onRetry={() => refetch()} />
      </SummaryCardsWrapper>
    );
  }

  const summary = data as AnalyticsSummary | undefined;

  if (!summary || (summary.totalEngagement === 0 && !summary.topPost)) {
    return (
      <SummaryCardsWrapper>
        <SummaryCardsEmpty />
      </SummaryCardsWrapper>
    );
  }

  return (
    <SummaryCardsWrapper>
      <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
        <TotalEngagementCard
          totalEngagement={summary.totalEngagement}
          trend={summary.trend}
        />
        <AvgEngagementCard
          avgEngagementRate={summary.avgEngagementRate}
          trend={summary.trend}
        />
        {summary.topPost ? (
          <TopPostCard post={summary.topPost} />
        ) : (
          <TopPostCardEmpty />
        )}
      </div>
    </SummaryCardsWrapper>
  );
};
