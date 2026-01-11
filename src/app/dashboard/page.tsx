import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/auth/logout-button';
import { DailyMetrics } from '@/components/daily-metrics';
import { PostsTable } from '@/components/posts-table';
import { SummaryCards } from '@/components/summary-cards';
import { createClient } from '@/lib/supabase/server';

const DashboardPage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
        <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
          <h1 className='text-xl font-semibold tracking-tight'>Dashboard</h1>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-muted-foreground'>
              {data.claims.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-6xl space-y-10 px-6 py-8'>
        <SummaryCards />
        <DailyMetrics />
        <PostsTable />
      </main>
    </div>
  );
};

export default DashboardPage;
