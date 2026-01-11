import { Suspense } from 'react';

import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/logout-button';

const AppHeaderAuthSkeleton = () => {
  return <div>Loading...</div>;
};

const AppHeaderAuthInner = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return <AppHeaderAuthSkeleton />;
  }

  return (
    <div className='flex items-center gap-4'>
      <span className='hidden text-sm text-muted-foreground md:block'>
        {data.claims.email}
      </span>
      <LogoutButton />
    </div>
  );
};

export const AppHeaderAuth = () => {
  return (
    <Suspense fallback={<AppHeaderAuthSkeleton />}>
      <AppHeaderAuthInner />
    </Suspense>
  );
};
