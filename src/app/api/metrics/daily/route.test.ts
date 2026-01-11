import { testApiHandler } from 'next-test-api-route-handler';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as appHandler from './route';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

const mockOrder = vi.fn();
const mockGte = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockGetUser = vi.fn();

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
};

const setupMockChain = (skipGte = false) => {
  mockOrder.mockResolvedValue({ data: [], error: null });
  mockGte.mockReturnValue({ order: mockOrder });
  if (skipGte) {
    mockEq.mockReturnValue({ order: mockOrder });
  } else {
    mockEq.mockReturnValue({ gte: mockGte, order: mockOrder });
  }
  mockSelect.mockReturnValue({ eq: mockEq });
  mockFrom.mockReturnValue({ select: mockSelect });
};

describe('GET /api/metrics/daily', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    setupMockChain();
  });

  it('returns 401 when auth error occurs', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Auth error' },
    });

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily',
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
      url: '/api/metrics/daily',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Unauthorized');
      },
    });
  });

  it('returns daily metrics for authenticated user', async () => {
    const mockData = [
      { date: '2026-01-01', engagement: 100, reach: 500 },
      { date: '2026-01-02', engagement: 150, reach: 600 },
    ];

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockOrder.mockResolvedValue({ data: mockData, error: null });

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily?range=week',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual(mockData);
        expect(mockFrom).toHaveBeenCalledWith('daily_metrics');
        expect(mockSelect).toHaveBeenCalledWith('date, engagement, reach');
        expect(mockEq).toHaveBeenCalledWith('user_id', 'test-user-id');
      },
    });
  });

  it('applies correct date filter for week range', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockOrder.mockResolvedValue({ data: [], error: null });

    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily?range=week',
      test: async ({ fetch }) => {
        await fetch({ method: 'GET' });

        expect(mockGte).toHaveBeenCalledWith(
          'date',
          new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
        );
      },
    });

    vi.restoreAllMocks();
  });

  it('applies correct date filter for month range', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockOrder.mockResolvedValue({ data: [], error: null });

    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily?range=month',
      test: async ({ fetch }) => {
        await fetch({ method: 'GET' });

        expect(mockGte).toHaveBeenCalledWith(
          'date',
          new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
        );
      },
    });

    vi.restoreAllMocks();
  });

  it('applies correct date filter for quarter range', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockOrder.mockResolvedValue({ data: [], error: null });

    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily?range=quarter',
      test: async ({ fetch }) => {
        await fetch({ method: 'GET' });

        expect(mockGte).toHaveBeenCalledWith(
          'date',
          new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString(),
        );
      },
    });

    vi.restoreAllMocks();
  });

  it('applies correct date filter for year range', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockOrder.mockResolvedValue({ data: [], error: null });

    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily?range=year',
      test: async ({ fetch }) => {
        await fetch({ method: 'GET' });

        expect(mockGte).toHaveBeenCalledWith(
          'date',
          new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString(),
        );
      },
    });

    vi.restoreAllMocks();
  });

  it('does not apply date filter when range is all', async () => {
    setupMockChain(true);
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily?range=all',
      test: async ({ fetch }) => {
        await fetch({ method: 'GET' });

        expect(mockGte).not.toHaveBeenCalled();
        expect(mockOrder).toHaveBeenCalledWith('date', { ascending: true });
      },
    });
  });

  it('defaults to month range when invalid range provided', async () => {
    setupMockChain();
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily?range=invalid',
      test: async ({ fetch }) => {
        await fetch({ method: 'GET' });

        expect(mockGte).toHaveBeenCalledWith(
          'date',
          new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
        );
      },
    });

    vi.restoreAllMocks();
  });

  it('returns 500 on database error', async () => {
    setupMockChain();
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });

    await testApiHandler({
      appHandler,
      url: '/api/metrics/daily',
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' });
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Database connection failed');
      },
    });
  });
});
