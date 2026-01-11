'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { InstagramSVG } from '@/components/ui/svgs/instagram-svg';
import { TiktokSVG } from '@/components/ui/svgs/tiktok-svg';

import { Post, SortDirection, PostSortField } from '@/lib/types';
import { ImageLoader } from '@/components/ui/image-loader';

type SortableHeaderProps = {
  label: string;
  field: Exclude<PostSortField, null>;
  currentSortField: PostSortField;
  currentSortDirection: SortDirection;
  onSort: (field: PostSortField, direction: SortDirection) => void;
};

const SortableHeader = ({
  label,
  field,
  currentSortField,
  currentSortDirection,
  onSort,
}: SortableHeaderProps) => {
  const isActive = currentSortField === field;
  const isAsc = isActive && currentSortDirection === 'asc';
  const isDesc = isActive && currentSortDirection === 'desc';

  const handleClick = () => {
    if (!isActive) {
      onSort(field, 'asc');
    } else if (isAsc) {
      onSort(field, 'desc');
    } else {
      onSort(null, null);
    }
  };

  return (
    <Button variant='ghost' onClick={handleClick}>
      <span>{label}</span>
      <span className='flex size-4 items-center justify-center'>
        {isAsc ? (
          <ArrowUp className='size-4' />
        ) : isDesc ? (
          <ArrowDown className='size-4' />
        ) : (
          <ArrowUpDown className='size-4 text-muted-foreground/40' />
        )}
      </span>
    </Button>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const truncateCaption = (caption: string | null, maxLength = 50) => {
  if (!caption) return '';
  if (caption.length <= maxLength) return caption;
  return caption.slice(0, maxLength) + '...';
};

type CreateColumnsParams = {
  sortField: PostSortField;
  sortDirection: SortDirection;
  onSort: (field: PostSortField, direction: SortDirection) => void;
};

export const createColumns = ({
  sortField,
  sortDirection,
  onSort,
}: CreateColumnsParams): ColumnDef<Post>[] => [
  {
    id: 'post',
    header: 'Post',
    size: 280,
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className='flex items-center gap-3'>
          {post.thumbnail_url ? (
            <ImageLoader
              src={post.thumbnail_url.split(',')[0]}
              alt=''
              width={40}
              height={40}
              className='size-10 rounded object-cover'
              containerClassName='size-10 rounded object-cover'
            />
          ) : (
            <div className='flex size-10 items-center justify-center rounded bg-muted'>
              <span className='text-xs text-muted-foreground'>No img</span>
            </div>
          )}
          <span className='max-w-[200px] truncate text-sm'>
            {truncateCaption(post.caption)}
          </span>
        </div>
      );
    },
  },
  {
    id: 'platform',
    header: 'Platform',
    size: 100,
    cell: ({ row }) => {
      const platform = row.original.platform;
      return (
        <div className='flex justify-center'>
          {platform === 'tiktok' ? (
            <TiktokSVG className='size-6 text-foreground' />
          ) : (
            <InstagramSVG className='size-6' />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'likes',
    size: 100,
    header: () => (
      <SortableHeader
        label='Likes'
        field='likes'
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSort={onSort}
      />
    ),
    cell: ({ row }) => {
      const likes = row.original.likes ?? 0;
      return likes.toLocaleString();
    },
  },
  {
    accessorKey: 'comments',
    size: 120,
    header: () => (
      <SortableHeader
        label='Comments'
        field='comments'
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSort={onSort}
      />
    ),
    cell: ({ row }) => {
      const comments = row.original.comments ?? 0;
      return comments.toLocaleString();
    },
  },
  {
    accessorKey: 'shares',
    size: 100,
    header: () => (
      <SortableHeader
        label='Shares'
        field='shares'
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSort={onSort}
      />
    ),
    cell: ({ row }) => {
      const shares = row.original.shares ?? 0;
      return shares.toLocaleString();
    },
  },
  {
    accessorKey: 'engagement_rate',
    size: 130,
    header: () => (
      <SortableHeader
        label='Engagement'
        field='engagement_rate'
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSort={onSort}
      />
    ),
    cell: ({ row }) => {
      const rate = row.original.engagement_rate ?? 0;
      return `${rate.toFixed(2)}%`;
    },
  },
  {
    accessorKey: 'posted_at',
    size: 130,
    header: () => (
      <SortableHeader
        label='Posted'
        field='posted_at'
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSort={onSort}
      />
    ),
    cell: ({ row }) => formatDate(row.original.posted_at),
  },
];
