import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/auth/logout-button';
import { DailyMetrics } from '@/components/daily-metrics';
import { PostsTable } from '@/components/posts-table';
import { createClient } from '@/lib/supabase/server';

const DashboardPage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  return (
    <main className='space-y-12 px-8 pt-20'>
      <div className='fixed top-4 right-4 flex items-center gap-4'>
        <p>
          Hello <span>{data.claims.email}</span>
        </p>
        <LogoutButton />
      </div>

      <div className='max-w-6xl'>
        <DailyMetrics />
      </div>

      <div className='max-w-6xl'>
        <h1 className='mb-6 text-2xl font-bold'>Posts</h1>
        <PostsTable />
      </div>
    </main>
  );
};

export default DashboardPage;
