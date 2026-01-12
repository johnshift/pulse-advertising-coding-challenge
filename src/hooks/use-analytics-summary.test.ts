// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, it, expect } from 'vitest';

import { useAnalyticsSummary } from './use-analytics-summary';
import { server } from '@/test/setup';
import { createWrapper } from '@/test/test-utils';

const mockSummary = {
  totalEngagement: 15000,
  avgEngagementRate: 4.5,
  topPost: {
    id: '1',
    user_id: 'user-1',
    platform: 'instagram',
    media_type: 'image',
    posted_at: '2026-01-10T12:00:00Z',
    caption: 'Test post',
    thumbnail_url: null,
    permalink: null,
    likes: 500,
    comments: 50,
    shares: 25,
    saves: 10,
    reach: 1000,
    impressions: 1500,
    engagement_rate: 5.0,
    created_at: '2026-01-10T12:00:00Z',
  },
  trend: { value: 12.5, direction: 'up' },
};

describe('useAnalyticsSummary', () => {
  it('should fetch and return summary data', async () => {
    server.use(
      http.get('/api/analytics/summary', () => {
        return HttpResponse.json(mockSummary);
      }),
    );

    const { result } = renderHook(() => useAnalyticsSummary(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockSummary);
  });

  it('should handle fetch error', async () => {
    server.use(
      http.get('/api/analytics/summary', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useAnalyticsSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch summary');
  });
});
