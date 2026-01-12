'use client';

import { ReactNode } from 'react';
import * as motion from 'motion/react-client';

import { PostDetailDialog } from '@/components/posts-table/post-detail-dialog';
import { useAnalyticsSummary } from '@/hooks/use-analytics-summary';
import type { AnalyticsSummary } from '@/lib/types';
import { useDashboardStore } from '@/lib/stores/dashboard.store';
import { fadeUpVariant, staggerContainer } from '@/lib/motion';

import { AvgEngagementCard } from './avg-engagement-card';
import {
  SummaryCardsEmpty,
  SummaryCardsError,
  SummaryCardsLoading,
} from './summary-cards-states';
import { TopPostCard, TopPostCardEmpty } from './top-post-card';
import { TotalEngagementCard } from './total-engagement-card';

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
  const { selectedPost, isPostDialogOpen, openPostDialog, closePostDialog } =
    useDashboardStore();

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
      <motion.div
        className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={fadeUpVariant}>
          <TotalEngagementCard
            totalEngagement={summary.totalEngagement}
            trend={summary.trend}
          />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          <AvgEngagementCard
            avgEngagementRate={summary.avgEngagementRate}
            trend={summary.trend}
          />
        </motion.div>
        <motion.div variants={fadeUpVariant}>
          {summary.topPost ? (
            <TopPostCard
              post={summary.topPost}
              onClick={() => openPostDialog(summary.topPost!)}
            />
          ) : (
            <TopPostCardEmpty />
          )}
        </motion.div>
      </motion.div>
      <PostDetailDialog
        post={selectedPost}
        open={isPostDialogOpen}
        onOpenChange={(open) => !open && closePostDialog()}
      />
    </SummaryCardsWrapper>
  );
};
