import { StateCreator } from 'zustand';

import { Platform, SortDirection, PostSortField } from '@/lib/types';

export interface PostsSlice {
  page: number;
  pageSize: number;
  sortField: PostSortField;
  sortDirection: SortDirection;
  platform: Platform | null;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (field: PostSortField, direction: SortDirection) => void;
  setPlatform: (platform: Platform | null) => void;
  resetFilters: () => void;
}

export const createPostsSlice: StateCreator<PostsSlice, [], [], PostsSlice> = (
  set,
) => ({
  page: 1,
  pageSize: 10,
  sortField: null,
  sortDirection: null,
  platform: null,
  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size, page: 1 }),
  setSorting: (field, direction) =>
    set({ sortField: field, sortDirection: direction, page: 1 }),
  setPlatform: (platform) => set({ platform, page: 1 }),
  resetFilters: () => set({ platform: null, page: 1 }),
});
