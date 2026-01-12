import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { postsResponseSchema } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/query-keys';
import type { Platform, SortDirection, PostSortField } from '@/lib/types';

type UsePostsParams = {
  page?: number;
  pageSize?: number;
  sortField?: PostSortField;
  sortDirection?: SortDirection;
  platform?: Platform | null;
};

const DEFAULT_SORT_FIELD = 'posted_at' as const;
const DEFAULT_SORT_DIRECTION = 'desc' as const;

const fetchPosts = async (
  page: number,
  pageSize: number,
  sortField: NonNullable<PostSortField>,
  sortDirection: NonNullable<SortDirection>,
  platform: Platform | null,
) => {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let queryBuilder = supabase.from('posts').select('*', { count: 'exact' });

  if (platform) {
    queryBuilder = queryBuilder.eq('platform', platform);
  }

  queryBuilder = queryBuilder
    .order(sortField, { ascending: sortDirection === 'asc' })
    .range(from, to);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  const validatedPosts = postsResponseSchema.parse(data);

  return {
    posts: validatedPosts,
    totalCount: count ?? 0,
  };
};

export const usePosts = ({
  page = 1,
  pageSize = 10,
  sortField,
  sortDirection,
  platform = null,
}: UsePostsParams = {}) => {
  const effectiveSortField = sortField ?? DEFAULT_SORT_FIELD;
  const effectiveSortDirection = sortDirection ?? DEFAULT_SORT_DIRECTION;

  const query = useQuery({
    ...queryKeys.posts.list({
      page,
      pageSize,
      sortField: effectiveSortField,
      sortDirection: effectiveSortDirection,
      platform,
    }),
    queryFn: () =>
      fetchPosts(
        page,
        pageSize,
        effectiveSortField,
        effectiveSortDirection,
        platform,
      ),
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
