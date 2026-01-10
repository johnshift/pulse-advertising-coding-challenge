import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/logout-button';

const DashboardPage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  return (
    <div className='flex h-svh w-full items-center justify-center gap-2'>
      <p>
        Hello <span>{data.claims.email}</span>
      </p>
      <LogoutButton />
    </div>
  );
};

export default DashboardPage;
