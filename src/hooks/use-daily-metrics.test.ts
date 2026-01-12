// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, it, expect } from 'vitest';

import { useDailyMetrics } from './use-daily-metrics';
import { server } from '@/test/setup';
import { createWrapper } from '@/test/test-utils';

const mockMetrics = [
  { date: '2026-01-01', engagement: 100, reach: 500 },
  { date: '2026-01-02', engagement: 150, reach: 600 },
  { date: '2026-01-03', engagement: 120, reach: 550 },
];

describe('useDailyMetrics', () => {
  it('should fetch metrics for week time range', async () => {
    server.use(
      http.get('/api/metrics/daily', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('range')).toBe('week');
        return HttpResponse.json(mockMetrics);
      }),
    );

    const { result } = renderHook(() => useDailyMetrics('week'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMetrics);
  });

  it('should fetch metrics for month time range', async () => {
    server.use(
      http.get('/api/metrics/daily', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('range')).toBe('month');
        return HttpResponse.json(mockMetrics);
      }),
    );

    const { result } = renderHook(() => useDailyMetrics('month'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMetrics);
  });

  it('should fetch metrics for quarter time range', async () => {
    server.use(
      http.get('/api/metrics/daily', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('range')).toBe('quarter');
        return HttpResponse.json(mockMetrics);
      }),
    );

    const { result } = renderHook(() => useDailyMetrics('quarter'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMetrics);
  });

  it('should handle fetch error', async () => {
    server.use(
      http.get('/api/metrics/daily', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useDailyMetrics('week'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch metrics');
  });
});
