import { create } from 'zustand';

import { createPostsSlice, PostsSlice } from './posts.slice';

type DashboardStore = PostsSlice;

export const useDashboardStore = create<DashboardStore>()((...a) => ({
  ...createPostsSlice(...a),
}));
