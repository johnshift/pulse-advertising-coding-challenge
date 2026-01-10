import { useQuery } from '@tanstack/react-query';

import { createClient } from '@/lib/supabase/client';

export const usePosts = () => {
  const supabase = createClient();
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
