'use client';

import * as motion from 'motion/react-client';

import { DailyMetrics } from '@/components/daily-metrics';
import { PostsTable } from '@/components/posts-table';
import { SummaryCards } from '@/components/summary-cards';
import { fadeUpVariant, staggerContainer } from '@/lib/motion';

export const DashboardContent = () => {
  return (
    <motion.main
      className='mx-auto max-w-6xl space-y-10 px-6 py-8'
      variants={staggerContainer}
      initial='hidden'
      animate='visible'
    >
      <motion.div variants={fadeUpVariant}>
        <SummaryCards />
      </motion.div>
      <motion.div variants={fadeUpVariant}>
        <DailyMetrics />
      </motion.div>
      <motion.div variants={fadeUpVariant}>
        <PostsTable />
      </motion.div>
    </motion.main>
  );
};
