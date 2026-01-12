import { DailyMetrics } from '@/components/daily-metrics';
import { PostsTable } from '@/components/posts-table';
import { SummaryCards } from '@/components/summary-cards';
import { AppHeader } from '@/components/app-header/app-header';

const DashboardPage = () => {
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />

      <main className='mx-auto max-w-6xl space-y-10 px-6 py-8'>
        <SummaryCards />
        <DailyMetrics />
        <PostsTable />
      </main>
    </div>
  );
};

export default DashboardPage;
