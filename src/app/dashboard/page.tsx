import { redirect } from 'next/navigation';

import { DailyMetrics } from '@/components/daily-metrics';
import { PostsTable } from '@/components/posts-table';
import { SummaryCards } from '@/components/summary-cards';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/app-header/app-header';

const DashboardPage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

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
