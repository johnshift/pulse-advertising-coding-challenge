import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { Platform, SortDirection, PostSortField } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

type UsePostsParams = {
  page?: number;
  pageSize?: number;
  sortField?: PostSortField;
  sortDirection?: SortDirection;
  platform?: Platform | null;
};

const DEFAULT_SORT_FIELD = 'posted_at' as const;
const DEFAULT_SORT_DIRECTION = 'desc' as const;

export const usePosts = ({
  page = 1,
  pageSize = 10,
  sortField,
  sortDirection,
  platform = null,
}: UsePostsParams = {}) => {
  const supabase = createClient();

  const effectiveSortField = sortField ?? DEFAULT_SORT_FIELD;
  const effectiveSortDirection = sortDirection ?? DEFAULT_SORT_DIRECTION;

  const query = useQuery({
    queryKey: [
      'posts',
      {
        page,
        pageSize,
        sortField: effectiveSortField,
        sortDirection: effectiveSortDirection,
        platform,
      },
    ],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let queryBuilder = supabase.from('posts').select('*', { count: 'exact' });

      if (platform) {
        queryBuilder = queryBuilder.eq('platform', platform);
      }

      queryBuilder = queryBuilder
        .order(effectiveSortField, {
          ascending: effectiveSortDirection === 'asc',
        })
        .range(from, to);

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      return {
        posts: data,
        totalCount: count ?? 0,
      };
    },
    placeholderData: keepPreviousData,
  });

  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    ...query,
    data: query.data?.posts,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize,
  };
};
