import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@supabase/ssr';
import { updateSession } from './proxy';

const mockGetClaims = vi.fn();

const mockSupabase = {
  auth: {
    getClaims: mockGetClaims,
  },
};

const createMockRequest = (pathname: string) => {
  const url = new URL(`http://localhost:3000${pathname}`);
  return new NextRequest(url);
};

describe('updateSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createServerClient).mockReturnValue(mockSupabase as never);
  });

  describe('authenticated user', () => {
    beforeEach(() => {
      mockGetClaims.mockResolvedValue({
        data: { claims: { email: 'test@example.com' } },
      });
    });

    it('redirects to /dashboard when visiting /auth/login', async () => {
      const request = createMockRequest('/auth/login');
      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/dashboard',
      );
    });

    it('redirects to /dashboard when visiting /auth/sign-up', async () => {
      const request = createMockRequest('/auth/sign-up');
      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/dashboard',
      );
    });

    it('redirects to /dashboard when visiting /auth/forgot-password', async () => {
      const request = createMockRequest('/auth/forgot-password');
      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/dashboard',
      );
    });

    it('allows access to /auth/update-password', async () => {
      const request = createMockRequest('/auth/update-password');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /dashboard', async () => {
      const request = createMockRequest('/dashboard');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /', async () => {
      const request = createMockRequest('/');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });
  });

  describe('unauthenticated user', () => {
    beforeEach(() => {
      mockGetClaims.mockResolvedValue({
        data: { claims: null },
      });
    });

    it('redirects to /auth/login when visiting /dashboard', async () => {
      const request = createMockRequest('/dashboard');
      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/auth/login',
      );
    });

    it('redirects to /auth/login when visiting /api/protected-route', async () => {
      const request = createMockRequest('/api/protected-route');
      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/auth/login',
      );
    });

    it('allows access to /auth/login', async () => {
      const request = createMockRequest('/auth/login');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /auth/sign-up', async () => {
      const request = createMockRequest('/auth/sign-up');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /auth/forgot-password', async () => {
      const request = createMockRequest('/auth/forgot-password');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /', async () => {
      const request = createMockRequest('/');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('allows access to /login', async () => {
      const request = createMockRequest('/login');
      const response = await updateSession(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });
  });
});
