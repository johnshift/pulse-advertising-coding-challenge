import { Tables } from '@/lib/database.types';

export type SortDirection = 'asc' | 'desc' | null;
export type Platform = 'instagram' | 'tiktok';

export type Post = Tables<'posts'>;
export type PostSortField =
  | 'likes'
  | 'comments'
  | 'shares'
  | 'engagement_rate'
  | 'posted_at'
  | null;
