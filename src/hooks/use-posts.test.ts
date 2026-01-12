// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { usePosts } from './use-posts';
import { createWrapper } from '@/test/test-utils';

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/client';

const mockRange = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();

const mockSupabase = {
  from: mockFrom,
};

const createMockPost = (
  overrides: Partial<{
    id: string;
    likes: number;
    comments: number;
    shares: number;
    engagement_rate: number;
    posted_at: string;
    platform: string;
  }> = {},
) => ({
  id: overrides.id ?? 'post-1',
  user_id: 'test-user-id',
  platform: overrides.platform ?? 'instagram',
  media_type: 'image',
  posted_at: overrides.posted_at ?? '2026-01-01T00:00:00Z',
  caption: 'Test caption',
  thumbnail_url: null,
  permalink: null,
  likes: overrides.likes ?? 100,
  comments: overrides.comments ?? 10,
  shares: overrides.shares ?? 5,
  saves: null,
  reach: null,
  impressions: null,
  engagement_rate: overrides.engagement_rate ?? 3.5,
  created_at: '2026-01-01T00:00:00Z',
});

const setupMockChain = () => {
  mockRange.mockResolvedValue({ data: [], error: null, count: 0 });
  mockOrder.mockReturnValue({ range: mockRange });
  mockEq.mockReturnValue({ order: mockOrder });
  mockSelect.mockReturnValue({ eq: mockEq, order: mockOrder });
  mockFrom.mockReturnValue({ select: mockSelect });
};

describe('usePosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof createClient>,
    );
    setupMockChain();
  });

  it('should fetch posts with default parameters', async () => {
    const mockPosts = [
      createMockPost({ id: 'post-1' }),
      createMockPost({ id: 'post-2' }),
    ];
    mockRange.mockResolvedValue({ data: mockPosts, error: null, count: 2 });

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPosts);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('should fetch posts with custom page and pageSize', async () => {
    const mockPosts = [createMockPost({ id: 'post-1' })];
    mockRange.mockResolvedValue({ data: mockPosts, error: null, count: 25 });

    const { result } = renderHook(() => usePosts({ page: 2, pageSize: 5 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.totalCount).toBe(25);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageSize).toBe(5);
    expect(mockRange).toHaveBeenCalledWith(5, 9);
  });

  it('should apply platform filter', async () => {
    const mockPosts = [createMockPost({ id: 'post-1', platform: 'tiktok' })];
    mockRange.mockResolvedValue({ data: mockPosts, error: null, count: 1 });

    const { result } = renderHook(() => usePosts({ platform: 'tiktok' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockEq).toHaveBeenCalledWith('platform', 'tiktok');
    expect(result.current.data).toEqual(mockPosts);
  });

  it('should apply sort field and direction', async () => {
    const mockPosts = [createMockPost({ id: 'post-1', likes: 500 })];
    mockRange.mockResolvedValue({ data: mockPosts, error: null, count: 1 });

    const { result } = renderHook(
      () => usePosts({ sortField: 'likes', sortDirection: 'desc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockOrder).toHaveBeenCalledWith('likes', { ascending: false });
  });

  it('should apply ascending sort direction', async () => {
    const mockPosts = [createMockPost({ id: 'post-1' })];
    mockRange.mockResolvedValue({ data: mockPosts, error: null, count: 1 });

    const { result } = renderHook(
      () => usePosts({ sortField: 'engagement_rate', sortDirection: 'asc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockOrder).toHaveBeenCalledWith('engagement_rate', {
      ascending: true,
    });
  });

  it('should handle database error', async () => {
    mockRange.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
      count: null,
    });

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('should calculate totalPages correctly', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 23 });

    const { result } = renderHook(() => usePosts({ pageSize: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.totalPages).toBe(3);
  });

  it('should return empty data when no posts exist', async () => {
    mockRange.mockResolvedValue({ data: [], error: null, count: 0 });

    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });
});
