'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export const LogoutButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    startTransition(() => {
      router.push('/');
    });
  };

  return (
    <Button size='sm' variant='secondary' onClick={logout} disabled={isPending}>
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
};
