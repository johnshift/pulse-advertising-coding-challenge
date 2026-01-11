import { testApiHandler } from 'next-test-api-route-handler';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as appHandler from './route';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

const mockPostsResult = vi.fn();
const mockMetricsResult = vi.fn();
const mockGetUser = vi.fn();

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
  from: vi.fn((table: string) => {
    if (table === 'posts') {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation(() => mockPostsResult()),
        }),
      };
    }
    if (table === 'daily_metrics') {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockImplementation(() => mockMetricsResult()),
            }),
          }),
        }),
      };
    }
    return {};
  }),
};

describe('GET /api/analytics/summary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    mockPostsResult.mockResolvedValue({ data: [], error: null });
    mockMetricsResult.mockResolvedValue({ data: [], error: null });
  });

  it('returns 401 when auth error occurs', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Auth error' },
    });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Unauthorized');
      },
    });
  });

  it('returns 401 when no user exists', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Unauthorized');
      },
    });
  });

  it('returns summary with empty data when user has no posts or metrics', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: [], error: null });
    mockMetricsResult.mockResolvedValue({ data: [], error: null });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual({
          totalEngagement: 0,
          avgEngagementRate: 0,
          topPost: null,
          trend: {
            value: 0,
            direction: 'up',
          },
        });
      },
    });
  });

  it('calculates totalEngagement correctly', async () => {
    const mockPosts = [
      { likes: 10, comments: 5, shares: 2, engagement_rate: '3.5' },
      { likes: 20, comments: 10, shares: 5, engagement_rate: '4.0' },
    ];

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: mockPosts, error: null });
    mockMetricsResult.mockResolvedValue({ data: [], error: null });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.totalEngagement).toBe(52); // (10+5+2) + (20+10+5) = 17 + 35 = 52
      },
    });
  });

  it('calculates avgEngagementRate correctly', async () => {
    const mockPosts = [
      { likes: 10, comments: 5, shares: 2, engagement_rate: '3.5' },
      { likes: 20, comments: 10, shares: 5, engagement_rate: '4.5' },
    ];

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: mockPosts, error: null });
    mockMetricsResult.mockResolvedValue({ data: [], error: null });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.avgEngagementRate).toBe(4); // (3.5 + 4.5) / 2 = 4
      },
    });
  });

  it('returns topPost as the post with highest total engagement', async () => {
    const mockPosts = [
      { id: 1, likes: 10, comments: 5, shares: 2, engagement_rate: '3.5' }, // total: 17
      { id: 2, likes: 50, comments: 20, shares: 10, engagement_rate: '5.0' }, // total: 80
      { id: 3, likes: 30, comments: 15, shares: 5, engagement_rate: '4.0' }, // total: 50
    ];

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: mockPosts, error: null });
    mockMetricsResult.mockResolvedValue({ data: [], error: null });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.topPost).toEqual(mockPosts[1]); // Post with id: 2 has highest engagement
      },
    });
  });

  it('calculates positive trend correctly', async () => {
    const currentPeriodMetrics = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      engagement: 100,
    }));
    const previousPeriodMetrics = Array.from({ length: 30 }, (_, i) => ({
      date: `2025-12-${String(i + 1).padStart(2, '0')}`,
      engagement: 50,
    }));

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: [], error: null });
    mockMetricsResult.mockResolvedValue({
      data: [...currentPeriodMetrics, ...previousPeriodMetrics],
      error: null,
    });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        // Current: 30 * 100 = 3000, Previous: 30 * 50 = 1500
        // Trend: ((3000 - 1500) / 1500) * 100 = 100%
        expect(json.trend.value).toBe(100);
        expect(json.trend.direction).toBe('up');
      },
    });
  });

  it('calculates negative trend correctly', async () => {
    const currentPeriodMetrics = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      engagement: 50,
    }));
    const previousPeriodMetrics = Array.from({ length: 30 }, (_, i) => ({
      date: `2025-12-${String(i + 1).padStart(2, '0')}`,
      engagement: 100,
    }));

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: [], error: null });
    mockMetricsResult.mockResolvedValue({
      data: [...currentPeriodMetrics, ...previousPeriodMetrics],
      error: null,
    });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        // Current: 30 * 50 = 1500, Previous: 30 * 100 = 3000
        // Trend: ((1500 - 3000) / 3000) * 100 = -50%
        expect(json.trend.value).toBe(-50);
        expect(json.trend.direction).toBe('down');
      },
    });
  });

  it('handles trend calculation when previous period is zero', async () => {
    const currentPeriodMetrics = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      engagement: 100,
    }));

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: [], error: null });
    mockMetricsResult.mockResolvedValue({
      data: currentPeriodMetrics,
      error: null,
    });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.trend.value).toBe(100);
        expect(json.trend.direction).toBe('up');
      },
    });
  });

  it('returns 500 on posts database error', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });
    mockMetricsResult.mockResolvedValue({ data: [], error: null });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Internal Server Error');
      },
    });
  });

  it('returns 500 on metrics database error', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockPostsResult.mockResolvedValue({ data: [], error: null });
    mockMetricsResult.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });

    await testApiHandler({
      appHandler,
      url: '/api/analytics/summary',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Internal Server Error');
      },
    });
  });
});
